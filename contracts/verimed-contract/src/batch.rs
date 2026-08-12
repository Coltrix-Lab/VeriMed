use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

/// Batch registration and chain-of-custody logging. This is the module the scan-to-verify
/// flow reads from: `get_batch` returns the full custody log so a consumer or pharmacist
/// can see not just "is this genuine" but the whole path the unit took to reach them.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CustodyRole {
    Manufacturer,
    Distributor,
    Wholesaler,
    Pharmacy,
    Clinic,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BatchStatus {
    Registered,
    InTransit,
    Delivered,
    Flagged,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CustodyEvent {
    pub holder: Address,
    pub role: CustodyRole,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Batch {
    pub manufacturer: Address,
    pub product_name: String,
    pub manufacture_date: u64,
    pub expiry_date: u64,
    pub unit_count: u32,
    pub status: BatchStatus,
    pub custody_log: Vec<CustodyEvent>,
    pub flag_count: u32,
}

#[contracttype]
pub enum DataKey {
    Batch(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum BatchError {
    BatchAlreadyExists = 1,
    BatchNotFound = 2,
    InvalidExpiry = 3,
    BatchNotTransferable = 4,
}

#[contract]
pub struct BatchContract;

#[contractimpl]
impl BatchContract {
    /// Manufacturer mints a batch record and opens its custody log with itself as the
    /// first holder.
    pub fn register_batch(
        env: Env,
        manufacturer: Address,
        batch_id: u64,
        product_name: String,
        manufacture_date: u64,
        expiry_date: u64,
        unit_count: u32,
    ) -> Result<(), BatchError> {
        manufacturer.require_auth();

        if expiry_date <= manufacture_date {
            return Err(BatchError::InvalidExpiry);
        }

        let key = DataKey::Batch(batch_id);
        if env.storage().persistent().has(&key) {
            return Err(BatchError::BatchAlreadyExists);
        }

        let mut custody_log = Vec::new(&env);
        custody_log.push_back(CustodyEvent {
            holder: manufacturer.clone(),
            role: CustodyRole::Manufacturer,
            timestamp: env.ledger().timestamp(),
        });

        let batch = Batch {
            manufacturer: manufacturer.clone(),
            product_name,
            manufacture_date,
            expiry_date,
            unit_count,
            status: BatchStatus::Registered,
            custody_log,
            flag_count: 0,
        };

        env.storage().persistent().set(&key, &batch);
        env.events()
            .publish((symbol_short!("BatchReg"), batch_id), manufacturer);
        Ok(())
    }

    /// Appends a signed custody handoff event as stock moves through the supply chain.
    /// Requires auth from the receiving holder (the party asserting they now have it).
    pub fn log_custody_transfer(
        env: Env,
        holder: Address,
        batch_id: u64,
        role: CustodyRole,
    ) -> Result<(), BatchError> {
        holder.require_auth();

        let key = DataKey::Batch(batch_id);
        let mut batch: Batch = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(BatchError::BatchNotFound)?;

        if batch.status == BatchStatus::Delivered || batch.status == BatchStatus::Flagged {
            return Err(BatchError::BatchNotTransferable);
        }

        batch.custody_log.push_back(CustodyEvent {
            holder: holder.clone(),
            role,
            timestamp: env.ledger().timestamp(),
        });
        batch.status = BatchStatus::InTransit;

        env.storage().persistent().set(&key, &batch);
        env.events()
            .publish((symbol_short!("Custody"), batch_id), holder);
        Ok(())
    }

    /// Last-mile confirmation by a receiving clinic/CHW. This is the event the `escrow`
    /// module's `DeliveryConfirmed` trigger is meant to be paired with off-chain (the
    /// caller confirms delivery here, then calls `escrow::confirm_event` for the same
    /// beneficiary/program) — see README for why these stay two calls instead of one
    /// cross-contract call for this MVP.
    pub fn confirm_delivery(env: Env, receiver: Address, batch_id: u64) -> Result<(), BatchError> {
        receiver.require_auth();

        let key = DataKey::Batch(batch_id);
        let mut batch: Batch = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(BatchError::BatchNotFound)?;

        if batch.status == BatchStatus::Flagged {
            return Err(BatchError::BatchNotTransferable);
        }

        batch.custody_log.push_back(CustodyEvent {
            holder: receiver.clone(),
            role: CustodyRole::Clinic,
            timestamp: env.ledger().timestamp(),
        });
        batch.status = BatchStatus::Delivered;

        env.storage().persistent().set(&key, &batch);
        env.events()
            .publish((symbol_short!("Deliver"), batch_id), receiver);
        Ok(())
    }

    /// Records a counterfeit/diversion flag against a batch. `reporter` here is expected
    /// to be a platform service address relaying a walletless consumer report (see README
    /// Status section) or a wallet-holding supply-chain participant reporting directly.
    pub fn report_flag(
        env: Env,
        reporter: Address,
        batch_id: u64,
        _reason: String,
    ) -> Result<(), BatchError> {
        reporter.require_auth();

        let key = DataKey::Batch(batch_id);
        let mut batch: Batch = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(BatchError::BatchNotFound)?;

        batch.flag_count += 1;
        batch.status = BatchStatus::Flagged;

        env.storage().persistent().set(&key, &batch);
        env.events()
            .publish((symbol_short!("Flagged"), batch_id), reporter);
        Ok(())
    }

    /// Read-only lookup used by the scan-to-verify flow: authenticity + full custody log.
    pub fn get_batch(env: Env, batch_id: u64) -> Result<Batch, BatchError> {
        env.storage()
            .persistent()
            .get(&DataKey::Batch(batch_id))
            .ok_or(BatchError::BatchNotFound)
    }
}
