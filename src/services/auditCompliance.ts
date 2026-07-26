import { ShieldEvaluationResult } from '../types';

export interface RegulatoryCitationMapping {
  euAiActArticle: string;
  euAiActDescription: string;
  doraArticle: string;
  doraDescription: string;
  pciDssControl: string;
}

export function getRegulatoryCitations(result: ShieldEvaluationResult): RegulatoryCitationMapping {
  return {
    euAiActArticle: 'Article 12 (Automatic Logging & Traceability)',
    euAiActDescription: 'High-Risk AI System continuous audit log of decision inputs, risk scores, policy parameters, and outputs.',
    doraArticle: 'Article 18 (ICT Operational Resilience & Incident Reporting)',
    doraDescription: 'Digital Operational Resilience Act log recording non-human actor execution & risk boundary checks.',
    pciDssControl: 'PCI DSS v4.0 Requirement 10.2 (Automated Audit Trails)'
  };
}

export function exportAuditLogsToJSON(logs: ShieldEvaluationResult[]): string {
  return JSON.stringify(logs, null, 2);
}

export function exportAuditLogsToCSV(logs: ShieldEvaluationResult[]): string {
  const headers = ['EvaluationID', 'Timestamp', 'AgentID', 'ActionType', 'Decision', 'RiskScore', 'CertificateID', 'EU_AI_Act', 'DORA_Art'];
  const rows = logs.map(l => [
    l.evaluationId,
    l.timestamp,
    l.request.agentId,
    l.request.actionType,
    l.decision,
    l.riskScore,
    l.certificate.certificateId,
    l.euAiActArticle,
    l.doraArticle
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
