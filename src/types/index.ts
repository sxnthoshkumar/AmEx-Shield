export type AgentCategory = 
  | 'UNDERWRITING_CREDIT'
  | 'REFUND_DISPUTE'
  | 'EXPENSE_AUTOMATION'
  | 'DINING_CONCIERGE'
  | 'PORTFOLIO_SERVICING';

export type DecisionOutcome = 'PERMIT' | 'FORBID' | 'REQUIRE_HITL';

export interface AgentPassport {
  id: string;
  name: string;
  category: AgentCategory;
  modelLineage: string;
  trustScore: number; // 0 - 100
  baseTrustScore: number;
  decayRate: number; // rate per incident / hour
  cleanStreak: number; // consecutive compliant decisions
  probationStatus: boolean;
  dailyRiskBudgetRemaining: number; // in loss units ($)
  dailyRiskBudgetMax: number;
  capabilities: string[];
  publicKey: string;
  issueTimestamp: string;
  lastActive: string;
  totalDecisions: number;
  incidentCount: number;
}

export interface PolicyRule {
  id: string;
  name: string;
  category: AgentCategory | 'GLOBAL';
  targetAction: string;
  conditionDescription: string;
  cedarExpression: string;
  decision: DecisionOutcome;
  maxAmountThreshold?: number;
  requireCounterpartyVerification: boolean;
  enabled: boolean;
}

export interface AgentActionRequest {
  id: string;
  agentId: string;
  agentName: string;
  category: AgentCategory;
  actionType: string;
  targetAmount?: number;
  counterparty?: string;
  reasoning: string;
  reasoningHash?: string;
  intentMandateId: string;
  delegationChain: string[];
  payload: Record<string, any>;
  promptInjectionDetected?: boolean;
}

export interface CounterfactualResult {
  simulatedStateValid: boolean;
  predictedLossDelta: number;
  historicalDeviationscore: number; // 0 - 1.0
  twinExpectedEnvelopeMatch: boolean;
  shadowAccountState: {
    preBalance?: number;
    postBalance?: number;
    anomalyFlag?: string;
  };
}

export interface RedTeamValidation {
  attackType?: string;
  passedSanitizer: boolean;
  promptInjectionScore: number; // 0 - 1.0
  blockedAtBoundary: boolean;
  attackVectorDetails?: string;
}

export interface DecisionCertificate {
  certificateId: string;
  timestamp: string;
  agentId: string;
  actionType: string;
  decision: DecisionOutcome;
  contextHash: string;
  policyVersion: string;
  reasoningCapsuleHash: string;
  issuerSignature: string;
  verifierPublicKey: string;
}

export interface ShieldEvaluationResult {
  evaluationId: string;
  timestamp: string;
  request: AgentActionRequest;
  decision: DecisionOutcome;
  riskScore: number; // 0 - 100
  decayedTrustScore: number;
  riskBudgetConsumed: number;
  matchingPolicyRuleId?: string;
  matchingPolicyName?: string;
  denialReason?: string;
  counterfactual: CounterfactualResult;
  redTeam: RedTeamValidation;
  certificate: DecisionCertificate;
  hitlRequiredReason?: string;
  euAiActArticle: string; // e.g. "Article 12: Automated Logging"
  doraArticle: string;   // e.g. "Article 18: ICT Incident Reporting"
}

export interface GovernanceNode {
  id: string;
  label: string;
  type: 'HUMAN_MANDATE' | 'PRIMARY_AGENT' | 'SUB_AGENT' | 'TOOL_CALL';
  category?: AgentCategory;
  riskScore: number;
  parentId?: string;
  childrenIds: string[];
  anomalyFlag?: string;
  status: 'AUTHORIZED' | 'ESCALATED' | 'BLOCKED';
}

export interface RedTeamAttackScenario {
  id: string;
  title: string;
  threatCategory: 'OWASP_ASI01_PROMPT_INJECTION' | 'OWASP_ASI03_PRIVILEGE_ABUSE' | 'MCP_RCE_EXPLOIT' | 'GOAL_DRIFT';
  description: string;
  injectedPayload: string;
  targetAgentId: string;
  targetAction: string;
  expectedResult: DecisionOutcome;
  remediationNote: string;
}

export interface HITLQueueItem {
  id: string;
  timestamp: string;
  evaluationResult: ShieldEvaluationResult;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  preMortemAnalysis: {
    failureModes: string[];
    statedConfidence: number;
    dismissedCounterEvidence: string;
  };
  reviewedBy?: string;
  reviewedAt?: string;
}
