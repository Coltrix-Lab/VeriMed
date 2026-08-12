use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Env, Vec};

/// Generalized from this project's original campaign-escrow logic: a sponsor locks
/// real tokens against a program, and funds release only when a defined verification
/// event fires for a beneficiary. The event that fires is intentionally decoupled from
/// how it's produced — an admin's manual sign-off and the `batch` module's on-chain
/// delivery confirmation both call `confirm_event` the same way.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProgramStatus {
    Active,
    PayoutExecuted,
    RolledOver,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ReleaseTrigger {
    /// Fired by the `batch` module when a receiving clinic/CHW confirms last-mile delivery.
    DeliveryConfirmed,
    /// Fired by a platform admin for cases without an on-chain delivery event (disputes, manual overrides).
    AdminVerified,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProgramDetails {
    pub sponsor: Address,
    pub token: Address,
    pub treasury: Address,
    pub total_funds: i128,
    /// Platform commission in basis points (1000 = 10%). Configurable per program instead
    /// of a fixed platform-wide rate, since manufacturer SaaS fees, donor verification fees,
    /// and regulator data-licensing all warrant different rates.
    pub commission_bps: u32,
    pub status: ProgramStatus,
    pub confirmed_beneficiaries: Vec<Address>,
    pub created_at: u64,
}

#[contracttype]
pub enum DataKey {
    Program(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum EscrowError {
    ProgramAlreadyExists = 1,
    ProgramNotFound = 2,
    ProgramNotActive = 3,
    InvalidAmount = 4,
    InvalidCommission = 5,
}

const MAX_BPS: u32 = 10_000;

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Sponsor deposits real tokens into the contract, locking them against `program_id`.
    pub fn initialize_program(
        env: Env,
        program_id: u64,
        sponsor: Address,
        token: Address,
        total_funds: i128,
        commission_bps: u32,
        treasury: Address,
    ) -> Result<(), EscrowError> {
        sponsor.require_auth();

        if total_funds <= 0 {
            return Err(EscrowError::InvalidAmount);
        }
        if commission_bps > MAX_BPS {
            return Err(EscrowError::InvalidCommission);
        }

        let key = DataKey::Program(program_id);
        if env.storage().persistent().has(&key) {
            return Err(EscrowError::ProgramAlreadyExists);
        }

        // Real escrow lock: pull funds from the sponsor into this contract's balance.
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sponsor, &env.current_contract_address(), &total_funds);

        let details = ProgramDetails {
            sponsor: sponsor.clone(),
            token,
            treasury,
            total_funds,
            commission_bps,
            status: ProgramStatus::Active,
            confirmed_beneficiaries: Vec::new(&env),
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &details);
        env.events().publish(
            (symbol_short!("ProgInit"), program_id),
            (sponsor, total_funds, commission_bps),
        );
        Ok(())
    }

    /// Records a release-trigger event for a beneficiary against a program. Idempotent per
    /// beneficiary. Trigger-agnostic by design: `verifier` may be a platform admin or the
    /// `batch` module acting on a confirmed delivery.
    pub fn confirm_event(
        env: Env,
        verifier: Address,
        program_id: u64,
        beneficiary: Address,
        trigger: ReleaseTrigger,
    ) -> Result<(), EscrowError> {
        verifier.require_auth();

        let key = DataKey::Program(program_id);
        let mut details: ProgramDetails = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(EscrowError::ProgramNotFound)?;

        if details.status != ProgramStatus::Active {
            return Err(EscrowError::ProgramNotActive);
        }

        let already_confirmed = details
            .confirmed_beneficiaries
            .iter()
            .any(|existing| existing == beneficiary);
        if !already_confirmed {
            details.confirmed_beneficiaries.push_back(beneficiary.clone());
        }

        env.storage().persistent().set(&key, &details);
        env.events().publish(
            (symbol_short!("EvtConf"), program_id),
            (beneficiary, trigger),
        );
        Ok(())
    }

    /// Transfers the configured commission to the treasury and splits the remainder
    /// proportionally across confirmed beneficiaries — real token transfers, not bookkeeping.
    pub fn execute_payout(env: Env, admin: Address, program_id: u64) -> Result<(), EscrowError> {
        admin.require_auth();

        let key = DataKey::Program(program_id);
        let mut details: ProgramDetails = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(EscrowError::ProgramNotFound)?;

        if details.status != ProgramStatus::Active {
            return Err(EscrowError::ProgramNotActive);
        }

        let confirmed_count = details.confirmed_beneficiaries.len();
        if confirmed_count > 0 {
            let token_client = token::Client::new(&env, &details.token);
            let commission = (details.total_funds * details.commission_bps as i128) / MAX_BPS as i128;
            let beneficiary_pool = details.total_funds - commission;
            let per_beneficiary = beneficiary_pool / (confirmed_count as i128);

            if commission > 0 {
                token_client.transfer(&env.current_contract_address(), &details.treasury, &commission);
            }
            if per_beneficiary > 0 {
                for beneficiary in details.confirmed_beneficiaries.iter() {
                    token_client.transfer(&env.current_contract_address(), &beneficiary, &per_beneficiary);
                }
            }
        }

        details.status = ProgramStatus::PayoutExecuted;
        env.storage().persistent().set(&key, &details);
        env.events().publish(
            (symbol_short!("PayoutOk"), program_id),
            (confirmed_count, details.total_funds),
        );
        Ok(())
    }

    /// Unspent program funds continue into the next round rather than reverting.
    pub fn rollover_program(env: Env, admin: Address, program_id: u64) -> Result<(), EscrowError> {
        admin.require_auth();

        let key = DataKey::Program(program_id);
        let mut details: ProgramDetails = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(EscrowError::ProgramNotFound)?;

        if details.status != ProgramStatus::Active {
            return Err(EscrowError::ProgramNotActive);
        }

        details.status = ProgramStatus::RolledOver;
        env.storage().persistent().set(&key, &details);
        env.events()
            .publish((symbol_short!("RollOver"), program_id), admin);
        Ok(())
    }

    pub fn get_program(env: Env, program_id: u64) -> Result<ProgramDetails, EscrowError> {
        env.storage()
            .persistent()
            .get(&DataKey::Program(program_id))
            .ok_or(EscrowError::ProgramNotFound)
    }
}
