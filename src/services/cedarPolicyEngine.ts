import { PolicyRule, AgentActionRequest, DecisionOutcome, AgentPassport } from '../types';

export const DEFAULT_POLICIES: PolicyRule[] = [
  {
    id: 'POL-AMEX-001',
    name: 'Hard Credit Line Ceiling & Mandatory Underwriting HITL',
    category: 'UNDERWRITING_CREDIT',
    targetAction: 'propose_credit_line_increase',
    conditionDescription: 'Credit line increases over $15,000 or for accounts with probation status require mandatory HITL approval.',
    cedarExpression: `permit(principal, action == Action::"propose_credit_line_increase", resource) when { principal.trustScore >= 80 && resource.amount <= 15000 && !principal.probationStatus };`,
    decision: 'REQUIRE_HITL',
    maxAmountThreshold: 15000,
    requireCounterpartyVerification: true,
    enabled: true
  },
  {
    id: 'POL-AMEX-002',
    name: 'Provisional Dispute Refund Threshold',
    category: 'REFUND_DISPUTE',
    targetAction: 'process_dispute_refund',
    conditionDescription: 'Automated refunds permitted up to $500 for clean-streak agents. Refunds > $500 require HITL.',
    cedarExpression: `permit(principal, action == Action::"process_dispute_refund", resource) when { resource.amount <= 500 && principal.cleanStreak > 20 };`,
    decision: 'REQUIRE_HITL',
    maxAmountThreshold: 500,
    requireCounterpartyVerification: false,
    enabled: true
  },
  {
    id: 'POL-AMEX-003',
    name: 'Corporate Expense Receipt Verification & Cap',
    category: 'EXPENSE_AUTOMATION',
    targetAction: 'approve_employee_reimbursement',
    conditionDescription: 'Expense reimbursements <= $2,500 with verified receipt OCR automatically permitted.',
    cedarExpression: `permit(principal, action == Action::"approve_employee_reimbursement", resource) when { resource.amount <= 2500 };`,
    decision: 'PERMIT',
    maxAmountThreshold: 2500,
    requireCounterpartyVerification: false,
    enabled: true
  },
  {
    id: 'POL-AMEX-004',
    name: 'Unverified Counterparty High-Risk Block',
    category: 'GLOBAL',
    targetAction: '*',
    conditionDescription: 'Forbid any agent transaction with high-risk unverified counterparties or flagged fraud lists.',
    cedarExpression: `forbid(principal, action, resource) when { resource.counterpartyIsFlagged == true };`,
    decision: 'FORBID',
    requireCounterpartyVerification: true,
    enabled: true
  },
  {
    id: 'POL-AMEX-005',
    name: 'Prompt Injection & Goal Drift Hard Stop',
    category: 'GLOBAL',
    targetAction: '*',
    conditionDescription: 'Immediately forbid and revoke credentials if prompt injection score > 0.65 or goal drift detected.',
    cedarExpression: `forbid(principal, action, resource) when { context.promptInjectionDetected == true };`,
    decision: 'FORBID',
    requireCounterpartyVerification: false,
    enabled: true
  }
];

export function evaluateCedarPolicy(
  request: AgentActionRequest,
  passport: AgentPassport,
  policies: PolicyRule[] = DEFAULT_POLICIES
): {
  decision: DecisionOutcome;
  matchingRule?: PolicyRule;
  reason: string;
} {
  // 1. Check prompt injection override first
  if (request.promptInjectionDetected) {
    const Rule5 = policies.find(p => p.id === 'POL-AMEX-005');
    return {
      decision: 'FORBID',
      matchingRule: Rule5,
      reason: 'AI Firewall: OWASP ASI01 Prompt Injection / Goal Hijack attack payload intercepted.'
    };
  }

  // 2. Check unverified / flagged counterparty
  if (request.counterparty && (request.counterparty.includes('SUSPICIOUS') || request.counterparty.includes('UNVERIFIED_OFFSHORE'))) {
    const Rule4 = policies.find(p => p.id === 'POL-AMEX-004');
    return {
      decision: 'FORBID',
      matchingRule: Rule4,
      reason: `Blocked by Policy POL-AMEX-004: Counterparty '${request.counterparty}' is flagged on internal risk watchlists.`
    };
  }

  // 3. Category matching policy check
  const matchingRules = policies.filter(
    p => p.enabled && (p.category === request.category || p.category === 'GLOBAL') && (p.targetAction === request.actionType || p.targetAction === '*')
  );

  for (const rule of matchingRules) {
    if (rule.maxAmountThreshold && request.targetAmount && request.targetAmount > rule.maxAmountThreshold) {
      return {
        decision: rule.decision,
        matchingRule: rule,
        reason: `Target amount ($${request.targetAmount.toLocaleString()}) exceeds automated ceiling ($${rule.maxAmountThreshold.toLocaleString()}) defined in ${rule.id}. Escalated to HITL queue.`
      };
    }
  }

  // 4. Passport probation status check
  if (passport.probationStatus) {
    return {
      decision: 'REQUIRE_HITL',
      reason: `Agent '${passport.name}' is currently in probation mode (Trust Score: ${passport.trustScore}/100). Action requires manual verification.`
    };
  }

  // 5. Default Permit if all clear
  return {
    decision: 'PERMIT',
    reason: 'Policy Evaluation Clean: Action satisfies all active Cedar/OPA authorization conditions & least agency constraints.'
  };
}
