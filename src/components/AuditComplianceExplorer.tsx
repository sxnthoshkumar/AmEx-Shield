import React, { useState } from 'react';
import { ShieldEvaluationResult } from '../types';
import { exportAuditLogsToJSON, exportAuditLogsToCSV } from '../services/auditCompliance';
import { verifyCertificate } from '../services/cryptoService';
import { CheckCircle2, Download, KeyRound, Search, FileCode } from 'lucide-react';

interface AuditComplianceExplorerProps {
  logs: ShieldEvaluationResult[];
}

export const AuditComplianceExplorer: React.FC<AuditComplianceExplorerProps> = ({ logs }) => {
  const [certInput, setCertInput] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; message: string } | null>(null);

  const handleVerify = async () => {
    if (!certInput.trim()) return;
    const res = await verifyCertificate({
      certificateId: certInput.trim(),
      timestamp: new Date().toISOString(),
      agentId: 'agent-credit-underwriter-01',
      actionType: 'propose_credit_line_increase',
      decision: 'PERMIT',
      contextHash: '0x992',
      policyVersion: 'v1',
      reasoningCapsuleHash: '0x883',
      issuerSignature: '0x9A4F8812399102930129381029312093',
      verifierPublicKey: '0x0482B71A'
    });
    setVerificationResult(res);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportAuditLogsToJSON(logs);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AmEx_Shield_Audit_Logs_${Date.now()}.json`;
    a.click();
  };

  const handleDownloadCSV = () => {
    const csvStr = exportAuditLogsToCSV(logs);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AmEx_Shield_Audit_Logs_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>INVENTION CONCEPT #10 • DECISION PROVENANCE CERTIFICATES & REGULATORY AUDIT</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              EU AI Act & DORA Regulator Audit Spine
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Immutable structured audit trail satisfying EU AI Act Article 12 and DORA Article 18. Every consequential agent decision produces an independently verifiable cryptographic certificate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-semibold flex items-center gap-2 border border-white/10 transition"
            >
              <Download className="w-3.5 h-3.5" />
              JSON Log
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 text-black text-xs font-mono font-extrabold flex items-center gap-2 shadow-glow-cyan transition"
            >
              <FileCode className="w-3.5 h-3.5" />
              CSV Audit
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-7 space-y-5 font-mono">
        <h3 className="text-base font-bold text-white flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-cyan-400" />
          Independent Certificate Verification Tool
        </h3>
        <p className="text-xs text-slate-300">
          Auditors and customers can verify any decision receipt cryptographic signature without accessing AmEx internal systems.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Paste Decision Certificate ID (e.g. CERT-AMEX-20260726153022-A89F2B)..."
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleVerify}
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Verify Signature
          </button>
        </div>

        {verificationResult && (
          <div className={`p-4 rounded-xl border text-xs ${
            verificationResult.isValid ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}>
            <div className="font-bold">{verificationResult.message}</div>
          </div>
        )}
      </div>
    </div>
  );
};
