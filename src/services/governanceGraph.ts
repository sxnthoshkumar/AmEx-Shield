import { GovernanceNode, AgentActionRequest } from '../types';

export function buildAuthorityProvenanceDAG(request: AgentActionRequest, riskScore: number): GovernanceNode[] {
  const rootMandateId = request.intentMandateId || 'MANDATE-HUMAN-CARDMEMBER-001';

  const nodes: GovernanceNode[] = [
    {
      id: rootMandateId,
      label: 'Signed Human Cardmember Mandate (AP2 / ACE)',
      type: 'HUMAN_MANDATE',
      riskScore: 5,
      childrenIds: [request.agentId],
      status: 'AUTHORIZED'
    },
    {
      id: request.agentId,
      label: `${request.agentName} (${request.category})`,
      type: 'PRIMARY_AGENT',
      category: request.category,
      riskScore: Math.round(riskScore * 0.7),
      parentId: rootMandateId,
      childrenIds: ['tool-call-01'],
      status: riskScore > 75 ? 'ESCALATED' : 'AUTHORIZED'
    },
    {
      id: 'tool-call-01',
      label: `MCP Tool Execution: ${request.actionType}`,
      type: 'TOOL_CALL',
      category: request.category,
      riskScore,
      parentId: request.agentId,
      childrenIds: [],
      status: riskScore > 85 ? 'BLOCKED' : riskScore > 65 ? 'ESCALATED' : 'AUTHORIZED'
    }
  ];

  // Anomaly check: multi-hop delegation expansion
  if (request.delegationChain.length > 2) {
    nodes[1].anomalyFlag = 'MULTI_HOP_DELEGATION_DEPTH_ELEVATED';
  }
  if (request.promptInjectionDetected) {
    nodes[2].anomalyFlag = 'UNAUTHORIZED_PRIVILEGE_EXPANSION_ATTEMPT';
    nodes[2].status = 'BLOCKED';
  }

  return nodes;
}
