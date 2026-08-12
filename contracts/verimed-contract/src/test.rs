#![cfg(test)]

use crate::batch::{BatchContract, BatchContractClient, BatchStatus, CustodyRole};
use crate::escrow::{EscrowContract, EscrowContractClient, ProgramStatus, ReleaseTrigger};
use soroban_sdk::{testutils::Address as _, token, Address, Env, String};

fn create_token_contract<'a>(
    env: &Env,
    admin: &Address,
) -> (token::Client<'a>, token::StellarAssetClient<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(env, &sac.address()),
        token::StellarAssetClient::new(env, &sac.address()),
    )
}

#[test]
fn escrow_program_locks_funds_and_pays_out_with_configurable_commission() {
    let env = Env::default();
    env.mock_all_auths();

    let asset_admin = Address::generate(&env);
    let admin = Address::generate(&env);
    let sponsor = Address::generate(&env);
    let treasury = Address::generate(&env);
    let beneficiary_a = Address::generate(&env);
    let beneficiary_b = Address::generate(&env);

    let (token_client, token_admin_client) = create_token_contract(&env, &asset_admin);
    token_admin_client.mint(&sponsor, &10_000);

    let contract_id = env.register(EscrowContract, ());
    let client = EscrowContractClient::new(&env, &contract_id);

    let program_id = 1u64;
    client.initialize_program(
        &program_id,
        &sponsor,
        &token_client.address,
        &10_000i128,
        &1000u32, // 10% commission
        &treasury,
    );

    // Real escrow lock: funds actually left the sponsor and landed in the contract.
    assert_eq!(token_client.balance(&sponsor), 0);
    assert_eq!(token_client.balance(&contract_id), 10_000);

    client.confirm_event(
        &admin,
        &program_id,
        &beneficiary_a,
        &ReleaseTrigger::DeliveryConfirmed,
    );
    client.confirm_event(
        &admin,
        &program_id,
        &beneficiary_b,
        &ReleaseTrigger::AdminVerified,
    );
    // Duplicate confirmation for the same beneficiary must not double-count.
    client.confirm_event(
        &admin,
        &program_id,
        &beneficiary_a,
        &ReleaseTrigger::DeliveryConfirmed,
    );

    client.execute_payout(&admin, &program_id);

    assert_eq!(token_client.balance(&treasury), 1_000); // 10% of 10,000
    assert_eq!(token_client.balance(&beneficiary_a), 4_500); // (10,000 - 1,000) / 2
    assert_eq!(token_client.balance(&beneficiary_b), 4_500);
    assert_eq!(token_client.balance(&contract_id), 0);

    let program = client.get_program(&program_id);
    assert_eq!(program.status, ProgramStatus::PayoutExecuted);
}

#[test]
fn escrow_program_rolls_over_unspent_funds() {
    let env = Env::default();
    env.mock_all_auths();

    let asset_admin = Address::generate(&env);
    let admin = Address::generate(&env);
    let sponsor = Address::generate(&env);
    let treasury = Address::generate(&env);

    let (token_client, token_admin_client) = create_token_contract(&env, &asset_admin);
    token_admin_client.mint(&sponsor, &5_000);

    let contract_id = env.register(EscrowContract, ());
    let client = EscrowContractClient::new(&env, &contract_id);

    let program_id = 2u64;
    client.initialize_program(
        &program_id,
        &sponsor,
        &token_client.address,
        &5_000i128,
        &500u32,
        &treasury,
    );

    client.rollover_program(&admin, &program_id);

    let program = client.get_program(&program_id);
    assert_eq!(program.status, ProgramStatus::RolledOver);
    // Rolled-over funds stay locked in the contract, not reverted to the sponsor.
    assert_eq!(token_client.balance(&contract_id), 5_000);
}

#[test]
fn batch_registration_builds_an_ordered_custody_chain() {
    let env = Env::default();
    env.mock_all_auths();

    let manufacturer = Address::generate(&env);
    let distributor = Address::generate(&env);
    let clinic = Address::generate(&env);

    let contract_id = env.register(BatchContract, ());
    let client = BatchContractClient::new(&env, &contract_id);

    let batch_id = 100u64;
    client.register_batch(
        &manufacturer,
        &batch_id,
        &String::from_str(&env, "Amoxicillin 500mg"),
        &1_000u64,
        &50_000u64,
        &10_000u32,
    );

    client.log_custody_transfer(&distributor, &batch_id, &CustodyRole::Distributor);
    client.confirm_delivery(&clinic, &batch_id);

    let batch = client.get_batch(&batch_id);
    assert_eq!(batch.custody_log.len(), 3);
    assert_eq!(batch.status, BatchStatus::Delivered);
    assert_eq!(batch.custody_log.get(0).unwrap().holder, manufacturer);
    assert_eq!(batch.custody_log.get(1).unwrap().holder, distributor);
    assert_eq!(batch.custody_log.get(2).unwrap().holder, clinic);
}

#[test]
fn batch_report_flag_marks_batch_flagged() {
    let env = Env::default();
    env.mock_all_auths();

    let manufacturer = Address::generate(&env);
    let reporter = Address::generate(&env);

    let contract_id = env.register(BatchContract, ());
    let client = BatchContractClient::new(&env, &contract_id);

    let batch_id = 200u64;
    client.register_batch(
        &manufacturer,
        &batch_id,
        &String::from_str(&env, "Insulin Vial"),
        &1_000u64,
        &20_000u64,
        &500u32,
    );

    client.report_flag(
        &reporter,
        &batch_id,
        &String::from_str(&env, "suspected dilution"),
    );

    let batch = client.get_batch(&batch_id);
    assert_eq!(batch.flag_count, 1);
    assert_eq!(batch.status, BatchStatus::Flagged);
}

#[test]
fn batch_rejects_expiry_before_manufacture_date() {
    let env = Env::default();
    env.mock_all_auths();

    let manufacturer = Address::generate(&env);
    let contract_id = env.register(BatchContract, ());
    let client = BatchContractClient::new(&env, &contract_id);

    let result = client.try_register_batch(
        &manufacturer,
        &300u64,
        &String::from_str(&env, "Bad Batch"),
        &50_000u64,
        &1_000u64,
        &10u32,
    );
    assert!(result.is_err());
}
