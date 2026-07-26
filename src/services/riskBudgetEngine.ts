import { AgentActionRequest, AgentPassport } from '../types';

/**
 * Concept #8: Economic Circuit Breaker (Risk-Budget Market)
 * Calculates composite risk score and debits the agent's spendable risk budget
 */
export function calculateActionRiskScore(
  request: AgentActionRequest,
  passport: AgentPassport
): {
  riskScore: number; // 0 - 100
  budgetCost: number; // loss units ($)
  budgetExhausted: boolean;
  riskFactors: string[];
} {
  let score = 15; // baseline low risk
  const riskFactors: string[] = [];
  const amount = request.targetAmount || 0;

  // Amount scaling
  if (amount > 50000) {
    score += 45;
    riskFactors.push('High transaction value (> $50k)');
  } else if (amount > 10000) {
    score += 30;
    riskFactors.push('Significant transaction value (> $10k)');
  } else if (amount > 1000) {
    score += 15;
    riskFactors.push('Moderate transaction value (> $1k)');
  }

  // Counterparty novelty
  if (request.counterparty && !['AmEx Resy Partner', 'Standard Supplier Inc.', 'Verified Merchant', 'Internal HR System'].includes(request.counterparty)) {
    score += 20;
    riskFactors.push('First-time / unverified counterparty');
  }

  // Agent Trust Level inverse
  const trustDeficit = Math.max(0, 95 - passport.trustScore);
  if (trustDeficit > 0) {
    score += trustDeficit * 0.5;
    riskFactors.push(`Agent trust score deficit (-${trustDeficit.toFixed(0)} pts)`);
  }

  // Prompt injection bonus
  if (request.promptInjectionDetected) {
    score = 99;
    riskFactors.push('CRITICAL: Prompt injection payload detected in tool input');
  }

  const finalRiskScore = Math.min(100, Math.max(1, Math.round(score)));

  // Risk budget cost formula: Amount * (RiskScore / 100)
  const budgetCost = Math.round(amount * (finalRiskScore / 100) + 100);
  const budgetExhausted = passport.dailyRiskBudgetRemaining < budgetCost;

  if (budgetExhausted) {
    riskFactors.push(`Economic Circuit Breaker: Daily risk budget exhausted (Available: $${passport.dailyRiskBudgetRemaining.toLocaleString()}, Required: $${budgetCost.toLocaleString()})`);
  }

  return {
    riskScore: finalRiskScore,
    budgetCost,
    budgetExhausted,
    riskFactors
  };
}
