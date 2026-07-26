import { AgentActionRequest, ShieldEvaluationResult, AgentPassport } from '../types';
import { evaluateCedarPolicy } from './cedarPolicyEngine';
import { calculateActionRiskScore } from './riskBudgetEngine';
import { runCounterfactualShadowExecution } from './shadowExecution';
import { validateRedTeamThreat } from './redTeamEngine';
import { mintDecisionCertificate } from './cryptoService';
import { calculateDecayedTrustScore } from './passportEngine';

/**
 * AMEX SHIELD CORE ORCHESTRATION
 * Evaluates an agent action request against the entire Living Trust Fabric:
 * 1. AI Firewall & Red-Team Sanitizer (#7)
 * 2. Governance Passport & Trust Decay Engine (#1, #5)
 * 3. Cedar / OPA Policy Authorization Engine
 * 4. Economic Circuit Breaker & Risk Scoring (#8)
 * 5. Counterfactual Shadow Execution & Digital Twin (#3, #12)
 * 6. Intent-Bound Cryptographic Decision Provenance Minter (#10, #15)
 */
export async function evaluateAgentActionWithShield(
  request: AgentActionRequest,
  passport: AgentPassport
): Promise<{
  result: ShieldEvaluationResult;
  updatedPassport: AgentPassport;
}> {
  const timestamp = new Date().toISOString();
  const evalId = `EVAL-${timestamp.replace(/[^0-9]/g, '').slice(0, 14)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Red-Team & AI Firewall Threat Validation
  const redTeamRes = validateRedTeamThreat(request.reasoning, request.payload);
  const promptInjectionDetected = !redTeamRes.passedSanitizer || request.promptInjectionDetected === true;
  request.promptInjectionDetected = promptInjectionDetected;

  // 2. Cedar Policy Authorization Engine
  const cedarRes = evaluateCedarPolicy(request, passport);

  // 3. Risk Engine & Economic Circuit Breaker (#8)
  const riskRes = calculateActionRiskScore(request, passport);

  // 4. Counterfactual Shadow Execution (#3, #12)
  const shadowRes = runCounterfactualShadowExecution(request);

  // Determine final composite decision
  let finalDecision = cedarRes.decision;
  let denialReason: string | undefined = cedarRes.reason;
  let hitlReason: string | undefined = undefined;

  if (promptInjectionDetected) {
    finalDecision = 'FORBID';
    denialReason = redTeamRes.attackVectorDetails || 'AI Firewall: Intercepted prompt injection attempt.';
  } else if (riskRes.budgetExhausted) {
    finalDecision = 'REQUIRE_HITL';
    hitlReason = `Economic Circuit Breaker: Agent risk budget exhausted for today.`;
  } else if (!shadowRes.twinExpectedEnvelopeMatch) {
    finalDecision = 'REQUIRE_HITL';
    hitlReason = `Digital Twin Anomaly: Counterfactual state deviated from historical customer spend envelope (${(shadowRes.historicalDeviationscore * 100).toFixed(0)}% deviation).`;
  } else if (riskRes.riskScore > 75 && finalDecision === 'PERMIT') {
    finalDecision = 'REQUIRE_HITL';
    hitlReason = `High Composite Risk Score (${riskRes.riskScore}/100) requires manual approval.`;
  }

  // 5. Passport & Trust Decay updates (#1, #5)
  const isIncident = finalDecision === 'FORBID' || promptInjectionDetected;
  const decayRes = calculateDecayedTrustScore(passport, isIncident);

  const updatedPassport: AgentPassport = {
    ...passport,
    trustScore: decayRes.newScore,
    probationStatus: decayRes.inProbation,
    cleanStreak: isIncident ? 0 : passport.cleanStreak + 1,
    totalDecisions: passport.totalDecisions + 1,
    incidentCount: isIncident ? passport.incidentCount + 1 : passport.incidentCount,
    dailyRiskBudgetRemaining: Math.max(0, passport.dailyRiskBudgetRemaining - riskRes.budgetCost),
    lastActive: timestamp
  };

  // 6. Decision Certificate Minting (#10)
  const cert = await mintDecisionCertificate(
    passport.id,
    request.actionType,
    finalDecision,
    request.reasoning,
    request.payload
  );

  const result: ShieldEvaluationResult = {
    evaluationId: evalId,
    timestamp,
    request,
    decision: finalDecision,
    riskScore: riskRes.riskScore,
    decayedTrustScore: decayRes.newScore,
    riskBudgetConsumed: riskRes.budgetCost,
    matchingPolicyRuleId: cedarRes.matchingRule?.id,
    matchingPolicyName: cedarRes.matchingRule?.name,
    denialReason,
    hitlRequiredReason: hitlReason,
    counterfactual: shadowRes,
    redTeam: redTeamRes,
    certificate: cert,
    euAiActArticle: 'Article 12 (Automatic Audit Logging & Traceability)',
    doraArticle: 'Article 18 (ICT Operational Resilience Testing)'
  };

  return { result, updatedPassport };
}
