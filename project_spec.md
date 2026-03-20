# EngageX Architecture & Technical Specification

## 1. Overview
EngageX is a decentralized task engagement platform built on the Stellar blockchain. It connects Companies (who want exposure/tasks completed) with Users (who perform tasks for crypto rewards), mediated by Admins.

**Tech Stack**:
- **Smart Contracts**: Rust (Soroban on Stellar)
- **Frontend**: Next.js / React (Wallet Connection Integration)
- **Backend/Off-chain**: Node.js/Rust for off-chain admin verifications, evidence storage, and mid-timeline triggers.

---

## 2. User Flows & Journeys

### A. Company Journey (Campaign Creation & Funding)
1. **Login**: Connects Stellar Wallet.
2. **Dashboard**: Views analytics of past/current campaigns.
3. **Create Campaign**: 
   - Specifies tasks (e.g., "Follow us on TikTok and like the pinned video").
   - Sets total budget (e.g., 1000 XLM / USDC).
   - Sets timeline (start date, mid-timeline review date, end date).
4. **Fund Campaign**: 
   - Company signs a Soroban transaction.
   - Funds are transferred into the **Smart Contract Escrow** and completely locked.
   - Campaign state becomes `ACTIVE`.

### B. User Journey (Task Completion & Earning)
1. **Login**: Connects Stellar Wallet (Acts as unique identifier).
2. **Dashboard**: Browses `ACTIVE` campaigns.
3. **Claim Task**: Opts into a specific campaign's task.
4. **Perform & Submit**: 
   - User performs the task externally (e.g., TikTok).
   - User uploads screenshot/video evidence via the EngageX web interface.
   - Status changes to `PENDING_VERIFICATION`.
5. **Reward**: Upon Admin approval, the smart contract disperses the funds, and the user receives their portion in their wallet.

### C. Admin Journey (Verification & Resolution)
1. **Review Dashboard**: Views all `PENDING_VERIFICATION` submissions.
2. **Manual Verification**: Reviews off-chain evidence.
3. **Trigger Payout**: Admin signs/authorizes the transaction triggering the payout function on the smart contract for the verified users.
4. **Interventions (Mid-Timeline)**:
   - Evaluates campaigns at mid-timeline if task completion is low.
   - Can intervene (e.g., promote campaign, resolve disputes).
5. **Rollover Trigger**: If campaign ends and budget remains, Admin triggers the contract to rollover funds for another round.

---

## 3. Revenue Model & Payout Logic
The platform takes exactly a **15% commission** from the locked funds assigned to the accomplished tasks, while users receive the remaining **85%**.

**Math Example**:
- Total Campaign Budget: 1000 XLM for 100 verified tasks.
- If all 100 tasks are completed: 
  - Platform gets 150 XLM (15%).
  - 850 XLM is pooled and distributed proportionally to the 100 verified users (8.5 XLM each).
- **Note**: The commission is only deducted at the time of *payout*, based on the amount actually being paid out for verified tasks.

---

## 4. Smart Contract Mechanics (Rust / Soroban)

### State Structure
- `campaigns`: Map of `campaign_id` => `CampaignDetails`
- `CampaignDetails`: `company_wallet`, `total_funds`, `status`, `timeline`, `verified_users`

### Core Functions
1. **`initialize_campaign`**: Called by Company. Transfers funds from Company to Contract. Updates State to tracking funds for this `campaign_id`.
2. **`verify_user_task`**: Called by Admin (or oracle). Adds user wallet to `verified_users` list for a campaign.
3. **`execute_payout`**: Called by Admin. 
   - Calculates total reward pool based on verified users.
   - Calculates 15% commission on the reward pool.
   - Transfers 15% to `App_Treasury_Wallet`.
   - Distributes remaining 85% proportionally to users in `verified_users`.
4. **`trigger_rollover`**: Called by Admin after campaign end date. 
   - Instead of refunding the company, remaining funds stay locked in the contract, and the campaign timeline/status is reset for a "Round 2".

---

## 5. Event Triggers (Chronological Flow)
1. `CampaignCreated` -> Front-end updates active campaign list.
2. `FundsDeposited` -> Contract locks funds securely.
3. `TaskClaimed` (Off-chain) -> User reserves a slot.
4. `EvidenceSubmitted` (Off-chain) -> Notifies Admin dashboard.
5. `MidTimelineAlert` (Off-chain Cron Job) -> Triggers if < 50% tasks claimed at midpoint. Prompts Admin intervention.
6. `TaskVerified` -> Smart contract records verified user.
7. `PayoutExecuted` -> Contract distributes XLM, emits events for indexing.
8. `CampaignRollover` -> Emitted if time expires and funds remain.
