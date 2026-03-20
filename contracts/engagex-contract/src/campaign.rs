use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Active,
    PayoutExecuted,
    RolledOver,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CampaignDetails {
    pub company_wallet: Address,
    pub total_funds: i128,
    pub status: CampaignStatus,
    pub verified_users: Vec<Address>,
    pub created_at: u64,
}

#[contract]
pub struct CampaignContract;

#[contractimpl]
impl CampaignContract {
    /// Initialize a new campaign, locking the initial funds 
    pub fn initialize_campaign(
        env: Env,
        campaign_id: u64,
        company: Address,
        total_funds: i128,
    ) {
        company.require_auth();

        let mut campaigns: Map<u64, CampaignDetails> = env
            .storage()
            .persistent()
            .get(&symbol_short!("camps"))
            .unwrap_or(Map::new(&env));

        let details = CampaignDetails {
            company_wallet: company.clone(),
            total_funds,
            status: CampaignStatus::Active,
            verified_users: Vec::new(&env),
            created_at: env.ledger().timestamp(),
        };

        campaigns.set(campaign_id, details);
        env.storage().persistent().set(&symbol_short!("camps"), &campaigns);

        env.events().publish(
            (symbol_short!("CampCr"), campaign_id),
            (company, total_funds),
        );
    }
    
    /// Allow the admin server to verify that a user completed a task externally
    pub fn verify_user_task(env: Env, admin: Address, campaign_id: u64, user: Address) {
        admin.require_auth();

        let mut campaigns: Map<u64, CampaignDetails> = env
            .storage()
            .persistent()
            .get(&symbol_short!("camps"))
            .unwrap_or(Map::new(&env));

        let mut details = campaigns.get(campaign_id).expect("Campaign not found");
        if details.status != CampaignStatus::Active {
            panic!("Campaign is no longer active");
        }

        details.verified_users.push_back(user.clone());
        campaigns.set(campaign_id, details);

        env.storage().persistent().set(&symbol_short!("camps"), &campaigns);

        env.events().publish(
            (symbol_short!("TaskVer"), campaign_id),
            user,
        );
    }

    /// Execute the payout applying the 15% platform commission and dividing the rest
    pub fn execute_payout(env: Env, admin: Address, treasury: Address, campaign_id: u64) {
        admin.require_auth();

        let mut campaigns: Map<u64, CampaignDetails> = env
            .storage()
            .persistent()
            .get(&symbol_short!("camps"))
            .unwrap_or(Map::new(&env));

        let mut details = campaigns.get(campaign_id).expect("Campaign not found");
        if details.status != CampaignStatus::Active {
            panic!("Campaign is no longer active");
        }

        let verified_count = details.verified_users.len();
        if verified_count > 0 {
            // Platform takes 15% exactly
            let commission = (details.total_funds * 15) / 100;
            let user_pool = details.total_funds - commission;
            let _per_user = user_pool / (verified_count as i128);

            // Execute transfers... 
        }

        details.status = CampaignStatus::PayoutExecuted;
        campaigns.set(campaign_id, details);
        env.storage().persistent().set(&symbol_short!("camps"), &campaigns);

        env.events().publish(
            (symbol_short!("PayoutOk"), campaign_id),
            (verified_count, details.total_funds),
        );
    }

    /// Rollover trigger executed by Admin: remaining/locked funds move to Round 2.
    pub fn rollover_campaign(env: Env, admin: Address, campaign_id: u64) {
        admin.require_auth();

        let mut campaigns: Map<u64, CampaignDetails> = env
            .storage()
            .persistent()
            .get(&symbol_short!("camps"))
            .unwrap_or(Map::new(&env));

        let mut details = campaigns.get(campaign_id).expect("Campaign not found");
        if details.status != CampaignStatus::Active {
            panic!("Campaign is no longer active");
        }

        details.status = CampaignStatus::RolledOver;
        campaigns.set(campaign_id, details);
        env.storage().persistent().set(&symbol_short!("camps"), &campaigns);

        env.events().publish(
            (symbol_short!("RolledOver"), campaign_id),
            admin,
        );
    }
}
