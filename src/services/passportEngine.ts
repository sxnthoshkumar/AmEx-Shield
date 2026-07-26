import { AgentPassport, AgentCategory } from '../types';

// Initial pre-configured Agent Passports
export const INITIAL_PASSPORTS: Record<string, AgentPassport> = {
  'agent-credit-underwriter-01': {
    id: 'agent-credit-underwriter-01',
    name: 'Credit Line Underwriting Agent',
    category: 'UNDERWRITING_CREDIT',
    modelLineage: 'Claude 3.5 Sonnet / Custom AmEx Model',
    trustScore: 94,
    baseTrustScore: 95,
    decayRate: 5,
    cleanStreak: 142,
    probationStatus: false,
    dailyRiskBudgetRemaining: 250000,
    dailyRiskBudgetMax: 500000,
    capabilities: ['read_credit_bureau', 'calculate_dti', 'propose_credit_line_increase', 'flag_underwriting_exception'],
    publicKey: '0x0482B71A9F4C...',
    issueTimestamp: '2026-01-15T08:00:00Z',
    lastActive: new Date().toISOString(),
    totalDecisions: 1450,
    incidentCount: 1
  },
  'agent-dispute-refund-02': {
    id: 'agent-dispute-refund-02',
    name: 'Merchant & Dispute Resolution Agent',
    category: 'REFUND_DISPUTE',
    modelLineage: 'GPT-4o / AmEx Dispute Fine-Tune',
    trustScore: 82,
    baseTrustScore: 88,
    decayRate: 8,
    cleanStreak: 28,
    probationStatus: false,
    dailyRiskBudgetRemaining: 35000,
    dailyRiskBudgetMax: 100000,
    capabilities: ['fetch_charge_details', 'initiate_merchant_inquiry', 'issue_provisional_credit', 'process_dispute_refund'],
    publicKey: '0x04C99A2D8E1F...',
    issueTimestamp: '2026-02-01T10:00:00Z',
    lastActive: new Date().toISOString(),
    totalDecisions: 890,
    incidentCount: 3
  },
  'agent-expense-verifier-03': {
    id: 'agent-expense-verifier-03',
    name: 'Corporate Expense Policy Agent',
    category: 'EXPENSE_AUTOMATION',
    modelLineage: 'Claude 3.5 Haiku',
    trustScore: 98,
    baseTrustScore: 98,
    decayRate: 3,
    cleanStreak: 512,
    probationStatus: false,
    dailyRiskBudgetRemaining: 180000,
    dailyRiskBudgetMax: 200000,
    capabilities: ['parse_receipt_ocr', 'check_expense_policy', 'approve_employee_reimbursement', 'flag_policy_violation'],
    publicKey: '0x04EE110298AA...',
    issueTimestamp: '2025-11-10T12:00:00Z',
    lastActive: new Date().toISOString(),
    totalDecisions: 3400,
    incidentCount: 0
  },
  'agent-dining-companion-04': {
    id: 'agent-dining-companion-04',
    name: 'AmEx Dining Companion (Resy)',
    category: 'DINING_CONCIERGE',
    modelLineage: 'Claude 3.5 Sonnet',
    trustScore: 71,
    baseTrustScore: 80,
    decayRate: 10,
    cleanStreak: 8,
    probationStatus: true,
    dailyRiskBudgetRemaining: 8000,
    dailyRiskBudgetMax: 25000,
    capabilities: ['search_resy_inventory', 'hold_table_reservation', 'charge_cancellation_fee', 'send_dining_invite'],
    publicKey: '0x04118F3A22BD...',
    issueTimestamp: '2026-03-20T14:30:00Z',
    lastActive: new Date().toISOString(),
    totalDecisions: 430,
    incidentCount: 5
  }
};

/**
 * Calculates current decayed trust score given clean streak, time elapsed, and recent incidents
 * Concept #5: Trust Decay & Probation Engine
 */
export function calculateDecayedTrustScore(passport: AgentPassport, isIncident: boolean = false): {
  newScore: number;
  inProbation: boolean;
  scoreDelta: number;
} {
  let score = passport.trustScore;

  if (isIncident) {
    // Sharp drop on policy violation or prompt injection failure
    score = Math.max(20, score - passport.decayRate * 4);
  } else {
    // Gradual recovery with clean decisions
    const streakBonus = Math.min(10, passport.cleanStreak * 0.1);
    score = Math.min(100, passport.baseTrustScore + streakBonus);
  }

  const inProbation = score < 75 || passport.incidentCount > 3;
  const scoreDelta = score - passport.trustScore;

  return {
    newScore: Math.round(score),
    inProbation,
    scoreDelta: Math.round(scoreDelta)
  };
}
