# EngageX 🚀
**A Decentralized Task Engagement Platform Built on Stellar (Soroban)**

## 🌟 Overview
EngageX is a blockchain-powered engagement platform bridging companies and users. Companies can launch marketing campaigns (such as follow, like, share, product advertisement) with an assigned budget. Users participate by completing these micro-tasks to earn cryptocurrency rewards securely and transparently.

All campaign funds are securely held in a Soroban **Smart Contract Escrow** deployed on the Stellar network. Payouts are trustless and automated upon off-chain verification by platform administrators.

---

## 🎯 Key Features
- **Smart Contract Escrow**: Campaign budgets are deposited and locked securely in Rust-based smart contracts.
- **Wallet Authentication**: Seamless sign-ups/logins utilizing Stellar Wallet Addresses as unique user identifiers.
- **Commission Model**: The platform programmatically deducts a **15% commission** from completed tasks when funds are dispersed to users in a verified batch. 85% goes directly to the verified users.
- **Rollover Mechanics**: If the campaign timeframe ends and the tasks remain uncompleted, the remaining funds roll over into a new round rather than reverting to the company.
- **Dispute & Intervention System**: Mid-campaign alert triggers allow administrators to step in if a task lacks engagement or requires dispute resolution.

---

## 🗺️ User Flows & Journeys

### 🏢 1. Company Journey (Campaign Creation)
1. **Connect Wallet:** The company logs in via their Stellar wallet.
2. **Dashboard Overview:** Views active, past, and drafted campaigns.
3. **Create Campaign:** 
   - Defines tasks (e.g., "Like and share our new post on X/Twitter").
   - Allocates a total budget (e.g., 5,000 XLM / USDC).
4. **Fund & Lock Escrow:** 
   - Deposits the budget into the Soroban Smart Contract.
   - Funds are locked into Escrow, and the campaign goes `ACTIVE`.

### 👥 2. User Journey (Earning by Engaging)
1. **Connect Wallet:** Users log in using their Stellar wallet (their unique platform identifier).
2. **Browse Tasks:** Explores `ACTIVE` campaigns on their personalized dashboard.
3. **Claim & Complete Tasks:** Selects tasks to complete on external platforms (e.g., TikTok, X).
4. **Submit Evidence:** Uploads screenshots or video evidence of the completed tasks securely via the web app.
5. **Get Paid:** Upon Admin verification, the smart contract disperses their share of the reward straight to their wallet!

### 🛡️ 3. Admin Journey (Verification & Management)
1. **Review Submissions:** Checks pending user submissions and evidence off-chain on the backend dashboard.
2. **Approve & Payout:** Initiates a signed transaction on the smart contract for the verified users to release payments automatically.
3. **Interventions:** Intervenes mid-timeline if tasks remain uncompleted to resolve issues or promote the campaign.
4. **Rollover Trigger:** Manually triggers unspent funds at the end of the campaign timeline to rollover into the next round.

---

## 🏛️ Smart Contract Mechanics (Rust / Soroban)

The decentralized contract is built entirely in Rust for the robust Stellar ecosystem. 

### Core State Structure
- `campaigns`: Map of `campaign_id` => `CampaignDetails`
- `CampaignDetails`: Tracks `company_wallet`, `total_funds`, `status`, `timeline`, and `verified_users`.

### Primary Contract Functions
- **`initialize_campaign`**: Transfers funds from the company to the contract, locking them securely in escrow and tracking state securely.
- **`verify_user_task`**: Appends verified user wallets to the campaign's completion list.
- **`execute_payout`**: 
   - Computes the user reward pool based on the number of verifications.
   - Computes the platform commission.
   - Transfers **15%** to the App Treasury automatically.
   - Splits the remaining **85%** proportionally among the verified users.
- **`trigger_rollover`**: Resets the campaign logic to "round 2", retaining unspent locked funds securely and expanding the timeline.

---

## 🔄 Event Triggers
We emphasize highly trackable life cycles ensuring transparent state transitions between on-chain and off-chain data:
1. `CampaignCreated` -> UI registers a new campaign.
2. `FundsDeposited` -> Smart contract securely locks down the funds.
3. `TaskClaimed` -> Users reserve slots (off-chain/hybrid).
4. `EvidenceSubmitted` -> Pings Admin dashboards for review.
5. `MidTimelineAlert` -> Off-chain Cron triggers if completion is under 50% at midpoint.
6. `TaskVerified` -> Smart contract logs verified users for reward pooling.
7. `PayoutExecuted` -> Releases funds to end users and deducts platform commission securely.
8. `CampaignRollover` -> Continues unspent funds into a new campaign timeline.

---

## 🛠️ Technology Stack
- **Blockchain Core**: Stellar Network
- **Smart Contracts / Escrow**: Rust (`#![no_std]`), Soroban SDK
- **Frontend App**: Next.js, React, Tailwind CSS
- **Backend Infrastructure**: Node.js/Rust (For off-chain verification workflows, evidence validation & storage)
