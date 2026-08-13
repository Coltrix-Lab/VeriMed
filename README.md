# VeriMed 💊🔗

**Blockchain-Verified Pharmaceutical Provenance & Aid Delivery — Built on Stellar (Soroban)**

## 🌟 Overview

An estimated **1 in 10 medical products in low- and middle-income countries is substandard or falsified** (WHO). Fake antimalarials, underdosed antibiotics, diluted insulin — this kills patients directly and drives antimicrobial resistance globally. It is not a single-country problem: every country with a pharmaceutical supply chain is exposed, from Lagos to Manila to rural India.

A related, compounding problem: **donor-funded medicine routinely leaks** before it reaches the clinic it was meant for — stock stolen or diverted in transit, with little to no verifiable proof of where the loss happened. Aid funders (governments, NGOs, multilateral donors) have no reliable way to prove delivery, only to hope for it.

**VeriMed** is a blockchain-based pharmaceutical provenance and verified-delivery platform with two integrated layers:

1. **Manufacturer-to-Pharmacy Traceability** — every drug batch gets a tamper-evident code at manufacture; every custody transfer (manufacturer → distributor → pharmacy/clinic) is logged on an immutable chain; anyone can scan a unit to instantly verify authenticity, expiry, and custody history — no wallet or crypto knowledge required.
2. **Verified Aid & Donor-Funded Delivery** — donors fund an escrow pool tied to a shipment or program; funds release automatically and only when the receiving clinic or Community Health Worker confirms last-mile delivery by scanning the batch on arrival. This closes the loop on "did the aid actually arrive," provably.

---

## 🧬 Why Blockchain Here (Not as a Buzzword)

The hard part of drug provenance is proving an **object's chain of custody** — a problem blockchain is structurally suited for, unlike trying to verify subjective human behavior. A batch's custody chain is a sequence of signed handoffs between known, wallet-identified supply-chain participants. Any break in that expected sequence, a duplicate scan of a unit already dispensed, or a manual counterfeit report is immediately visible and auditable — no admin eyeballing screenshots, no trust required in any single party.

---

## 🎯 Key Features

- **Batch & Custody Registry**: Manufacturers register batches on-chain with product metadata, manufacture/expiry dates, and unit serials; every custody handoff (distributor, wholesaler, pharmacy, clinic) is logged as a signed on-chain event.
- **Scan-to-Verify**: A public, walletless web flow — scan a QR/NFC code and get a plain-language authenticity result: genuine or flagged, in-date or expired, expected custody chain or anomaly.
- **Trigger-Agnostic Escrow**: The core escrow/payout contract (inherited and generalized from this project's original task-engagement design) locks a sponsor's funds and releases them automatically when a defined verification event fires — now generalized so that event can be a delivery confirmation, not just an admin sign-off.
- **Configurable Commission**: Platform commission is set per program (basis points), not hardcoded — different for manufacturer SaaS fees, donor verification fees, and regulator data-licensing.
- **Rollover Mechanics**: Unspent program/shipment funds roll over into the next round rather than defaulting to reversion.
- **Counterfeit & Diversion Reporting**: Any participant — including consumers — can flag a suspicious batch, generating an on-chain flag and notifying the regulator role.
- **Wallet-Based Authentication**: Supply-chain participants (manufacturers, distributors, pharmacies, donors) authenticate via Stellar wallet; consumers never need one.

---

## 🗺️ Roles

| Role | What they do |
|---|---|
| **Manufacturer** | Registers batches, mints serial codes, logs initial custody. |
| **Distributor / Wholesaler** | Logs custody handoff events as stock moves through the chain. |
| **Pharmacy / Clinic** | Receives stock (logs handoff), scans to verify before dispensing. |
| **Regulator** (NAFDAC-equivalent) | Read access to chain-of-custody and counterfeit-report data; dashboard of flagged batches and diversion hotspots. |
| **Donor / Sponsor** (KOICA-style program, NGO, government agency) | Funds an escrow pool tied to a shipment/program; views delivery-confirmation and impact/M&E reporting. |
| **Receiving Clinic / CHW** | Confirms last-mile delivery by scanning on arrival; may be disbursed to from escrow. |
| **Consumer / Patient** | Scans a unit at point of use to verify authenticity — no wallet required. |
| **Platform Admin** | Oversight dashboard, dispute resolution for contested custody events or counterfeit reports. |

---

## 🏛️ Smart Contract Mechanics (Rust / Soroban)

Contract lives at [`contracts/verimed-contract`](contracts/verimed-contract). Two modules:

### `escrow` — generalized from this project's original campaign-escrow logic
- `initialize_program(program_id, sponsor, token, total_funds, commission_bps, treasury)` — sponsor deposits real tokens into the contract, locking them; commission is configurable per program instead of a fixed rate.
- `confirm_event(verifier, program_id, beneficiary, trigger)` — records a verified release-trigger event (e.g. `DeliveryConfirmed`, `AdminVerified`) against a beneficiary. Trigger-agnostic by design — a delivery confirmation event from `batch` can drive this the same way an admin verification could.
- `execute_payout(admin, program_id)` — computes and transfers the configurable commission to the treasury and splits the remainder across confirmed beneficiaries — real token transfers, not bookkeeping-only.
- `rollover_program(admin, program_id)` — unspent funds continue into the next round.

### `batch` — new
- `register_batch(manufacturer, batch_id, product_name, manufacture_date, expiry_date, unit_count)` — creates the on-chain batch record and opening custody event.
- `log_custody_transfer(holder, batch_id, role)` — appends a signed custody handoff event.
- `confirm_delivery(receiver, batch_id)` — last-mile confirmation by a receiving clinic/CHW; this is the event `escrow`'s delivery trigger consumes.
- `report_flag(batch_id, reason)` — records a counterfeit/diversion flag against a batch.
- `get_batch(batch_id)` — read-only view returning the full batch record and custody log, used by the scan-to-verify flow.

---

## 🛠️ Technology Stack

- **Blockchain Core**: Stellar Network
- **Smart Contracts / Escrow**: Rust (`#![no_std]`), Soroban SDK
- **Frontend App**: Next.js, React, Tailwind-style CSS
- **Backend Infrastructure**: off-chain metadata storage, counterfeit-report evidence, and custody geolocation logs (to be built — see Status below)

---

## 🚀 Getting Started

**Smart contracts** (Rust / Soroban, in [`contracts/verimed-contract`](contracts/verimed-contract)):
```bash
cd contracts/verimed-contract
cargo test                                       # 5/5 unit tests
cargo build --target wasm32-unknown-unknown --release   # compiles to .wasm
```

**Frontend** (Next.js, in [`frontend`](frontend)):
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```
The frontend runs fully standalone against the mock data layer in `frontend/src/lib/verimed.ts` — no wallet, RPC endpoint, or deployed contract needed to click through the demo.

---

## 📍 Status: What's Real vs. What's a Stub

Built for speed toward a demoable pitch. Being explicit about what's genuinely working versus scaffolded:

- ✅ **Working**: `escrow` and `batch` Soroban contracts — real logic, real token transfers via the Soroban token client, 5/5 `cargo test` unit tests passing, compiles cleanly to `wasm32-unknown-unknown`.
- ✅ **Working (frontend, session-local mock data by default)**: the full register → hand off → confirm delivery → scan-to-verify → flag loop is genuinely interactive within a browser session — `/dashboard/register-batch`, `/dashboard/fund-program`, `/verify`, and `/dashboard/report` all read and write through the same typed data layer (`frontend/src/lib/verimed.ts`), which is built so swapping to live Soroban RPC calls means editing that one file, not the pages.
- 🧱 **Stub (real UI, seeded data)**: `/dashboard/donor` and `/dashboard/regulator` — genuine aggregation logic (impact stats, a real CSV export, flagged-batch/hotspot views) but reading from the same seeded mock data rather than live chain state.
- ❌ **Not yet done**: testnet/mainnet deployment (needs Stellar CLI + a funded identity — infrastructure step, not a code gap), off-chain backend for evidence/geolocation storage, wallet-connect integration in the UI, camera-based QR/NFC scanning (the verify flow takes a typed/pasted code today).

This repo was repositioned from an earlier task-engagement concept ("EngageX") — the escrow/commission/rollover pattern above is inherited from that design and generalized for pharmaceutical provenance and verified aid delivery.
