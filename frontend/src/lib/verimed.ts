// Data layer for the VeriMed frontend.
//
// This currently reads from in-memory mock data seeded below, shaped to match the
// `batch` and `escrow` Soroban contract structs exactly (see
// contracts/verimed-contract/src/batch.rs and escrow.rs). Swapping to live chain data
// means replacing the bodies of the functions in this file with Soroban RPC calls
// (e.g. via @stellar/stellar-sdk's `Contract` + `Server.simulateTransaction` for reads,
// and signed invocations for writes) against a deployed contract ID — no page component
// needs to change, since they only ever call these functions.

export type CustodyRole = 'Manufacturer' | 'Distributor' | 'Wholesaler' | 'Pharmacy' | 'Clinic';
export type BatchStatus = 'Registered' | 'InTransit' | 'Delivered' | 'Flagged';

export interface CustodyEvent {
  holder: string;
  role: CustodyRole;
  timestamp: number; // unix seconds
}

export interface Batch {
  batchId: string;
  manufacturer: string;
  productName: string;
  manufactureDate: number; // unix seconds
  expiryDate: number; // unix seconds
  unitCount: number;
  status: BatchStatus;
  custodyLog: CustodyEvent[];
  flagCount: number;
  lastFlagReason?: string;
}

export type ProgramStatus = 'Active' | 'PayoutExecuted' | 'RolledOver';

export interface Program {
  programId: string;
  sponsor: string;
  treasury: string;
  totalFunds: number;
  commissionBps: number;
  status: ProgramStatus;
  confirmedBeneficiaries: string[];
  createdAt: number;
}

const DAY = 24 * 60 * 60;
const now = Math.floor(Date.now() / 1000);

const MOCK_BATCHES: Record<string, Batch> = {
  'VM-2026-A001': {
    batchId: 'VM-2026-A001',
    manufacturer: 'GVCXFQ7...MFR1 (Lagos Pharma Manufacturing Ltd.)',
    productName: 'Amoxicillin 500mg (100 caps)',
    manufactureDate: now - 120 * DAY,
    expiryDate: now + 600 * DAY,
    unitCount: 10000,
    status: 'Delivered',
    flagCount: 0,
    custodyLog: [
      { holder: 'GVCXFQ7...MFR1', role: 'Manufacturer', timestamp: now - 120 * DAY },
      { holder: 'GDPLM3X...DST2', role: 'Distributor', timestamp: now - 95 * DAY },
      { holder: 'GHPHRM9...PHM3', role: 'Pharmacy', timestamp: now - 60 * DAY },
      { holder: 'GCLNC4K...CLN4', role: 'Clinic', timestamp: now - 58 * DAY },
    ],
  },
  'VM-2026-A002': {
    batchId: 'VM-2026-A002',
    manufacturer: 'GVCXFQ7...MFR1 (Lagos Pharma Manufacturing Ltd.)',
    productName: 'Artemether/Lumefantrine 20/120mg (Antimalarial)',
    manufactureDate: now - 400 * DAY,
    expiryDate: now - 30 * DAY, // expired
    unitCount: 5000,
    status: 'InTransit',
    flagCount: 0,
    custodyLog: [
      { holder: 'GVCXFQ7...MFR1', role: 'Manufacturer', timestamp: now - 400 * DAY },
      { holder: 'GDPLM3X...DST2', role: 'Distributor', timestamp: now - 370 * DAY },
    ],
  },
  'VM-2026-A003': {
    batchId: 'VM-2026-A003',
    manufacturer: 'GUNKN0W...N999 (Unregistered source)',
    productName: 'Insulin Glargine 100IU/mL',
    manufactureDate: now - 50 * DAY,
    expiryDate: now + 300 * DAY,
    unitCount: 800,
    status: 'Flagged',
    flagCount: 3,
    custodyLog: [
      { holder: 'GUNKN0W...N999', role: 'Manufacturer', timestamp: now - 50 * DAY },
      { holder: 'GHPHRM9...PHM3', role: 'Pharmacy', timestamp: now - 10 * DAY },
    ],
  },
};

const MOCK_PROGRAMS: Program[] = [
  {
    programId: 'KOICA-NG-2026-01',
    sponsor: 'GDONR1K...OICA (KOICA Health Access Program)',
    treasury: 'GTREAS...URY01',
    totalFunds: 50000,
    commissionBps: 800, // 8%
    status: 'Active',
    confirmedBeneficiaries: ['GCHW001...NODE1', 'GCHW002...NODE2'],
    createdAt: now - 40 * DAY,
  },
  {
    programId: 'GLOBALFUND-NG-2025-11',
    sponsor: 'GDONR2G...FUND (Global Fund Malaria Program)',
    treasury: 'GTREAS...URY01',
    totalFunds: 120000,
    commissionBps: 500, // 5%
    status: 'PayoutExecuted',
    confirmedBeneficiaries: ['GCHW003...NODE3', 'GCHW004...NODE4', 'GCHW005...NODE5'],
    createdAt: now - 200 * DAY,
  },
];

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getBatch(batchId: string): Promise<Batch | null> {
  return delay(MOCK_BATCHES[batchId.trim().toUpperCase()] ?? null);
}

export async function listBatches(): Promise<Batch[]> {
  return delay(Object.values(MOCK_BATCHES));
}

export async function listPrograms(): Promise<Program[]> {
  return delay(MOCK_PROGRAMS);
}

export interface RegisterBatchInput {
  batchId: string;
  manufacturer: string;
  productName: string;
  manufactureDate: number;
  expiryDate: number;
  unitCount: number;
}

/** Mirrors `escrow::register_batch` — mutates the in-session mock store so a batch
 * registered here is immediately visible in the registry and scannable via /verify. */
export async function registerBatch(input: RegisterBatchInput): Promise<Batch> {
  const id = input.batchId.trim().toUpperCase();
  if (MOCK_BATCHES[id]) {
    throw new Error(`Batch ${id} already exists`);
  }
  if (input.expiryDate <= input.manufactureDate) {
    throw new Error('Expiry date must be after manufacture date');
  }
  const batch: Batch = {
    batchId: id,
    manufacturer: input.manufacturer,
    productName: input.productName,
    manufactureDate: input.manufactureDate,
    expiryDate: input.expiryDate,
    unitCount: input.unitCount,
    status: 'Registered',
    flagCount: 0,
    custodyLog: [{ holder: input.manufacturer, role: 'Manufacturer', timestamp: Math.floor(Date.now() / 1000) }],
  };
  MOCK_BATCHES[id] = batch;
  return delay(batch);
}

/** Mirrors `batch::log_custody_transfer`. */
export async function logCustodyTransfer(batchId: string, holder: string, role: CustodyRole): Promise<Batch> {
  const batch = MOCK_BATCHES[batchId.trim().toUpperCase()];
  if (!batch) throw new Error('Batch not found');
  if (batch.status === 'Delivered' || batch.status === 'Flagged') {
    throw new Error('Batch is no longer transferable');
  }
  batch.custodyLog.push({ holder, role, timestamp: Math.floor(Date.now() / 1000) });
  batch.status = 'InTransit';
  return delay(batch);
}

/** Mirrors `batch::confirm_delivery` — the event `escrow`'s DeliveryConfirmed trigger consumes. */
export async function confirmDelivery(batchId: string, receiver: string): Promise<Batch> {
  const batch = MOCK_BATCHES[batchId.trim().toUpperCase()];
  if (!batch) throw new Error('Batch not found');
  if (batch.status === 'Flagged') throw new Error('Batch is flagged, cannot confirm delivery');
  batch.custodyLog.push({ holder: receiver, role: 'Clinic', timestamp: Math.floor(Date.now() / 1000) });
  batch.status = 'Delivered';
  return delay(batch);
}

export interface FundProgramInput {
  programId: string;
  sponsor: string;
  treasury: string;
  totalFunds: number;
  commissionBps: number;
}

/** Mirrors `escrow::initialize_program` — locks the sponsor's funds against a program. */
export async function fundProgram(input: FundProgramInput): Promise<Program> {
  if (MOCK_PROGRAMS.some((p) => p.programId === input.programId)) {
    throw new Error(`Program ${input.programId} already exists`);
  }
  if (input.totalFunds <= 0) throw new Error('total_funds must be positive');
  if (input.commissionBps > 10000) throw new Error('commission_bps exceeds 100%');

  const program: Program = {
    programId: input.programId,
    sponsor: input.sponsor,
    treasury: input.treasury,
    totalFunds: input.totalFunds,
    commissionBps: input.commissionBps,
    status: 'Active',
    confirmedBeneficiaries: [],
    createdAt: Math.floor(Date.now() / 1000),
  };
  MOCK_PROGRAMS.unshift(program);
  return delay(program);
}

/** Mirrors `batch::report_flag`. The on-chain contract doesn't persist the reason
 * string (see batch.rs), but the regulator dashboard benefits from keeping the most
 * recent one, so the mock store retains it here. */
export async function reportFlag(batchId: string, reason: string): Promise<Batch> {
  const batch = MOCK_BATCHES[batchId.trim().toUpperCase()];
  if (!batch) throw new Error('Batch not found');
  batch.flagCount += 1;
  batch.status = 'Flagged';
  batch.lastFlagReason = reason;
  return delay(batch);
}

export function isExpired(batch: Batch): boolean {
  return batch.expiryDate < Math.floor(Date.now() / 1000);
}

export function isCustodyChainIntact(batch: Batch): boolean {
  if (batch.custodyLog.length === 0) return false;
  const timestamps = batch.custodyLog.map((e) => e.timestamp);
  return timestamps.every((t, i) => i === 0 || t >= timestamps[i - 1]);
}
