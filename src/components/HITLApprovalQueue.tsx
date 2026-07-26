import React from 'react';
import { HITLQueueItem } from '../types';
import { AlertTriangle, CheckCircle2, XCircle, FileText, UserCheck, HelpCircle } from 'lucide-react';

interface HITLApprovalQueueProps {
  queueItems: HITLQueueItem[];
  onApproveItem: (id: string) => void;
  onRejectItem: (id: string) => void;
}

export const HITLApprovalQueue: React.FC<HITLApprovalQueueProps> = ({
  queueItems,
  onApproveItem,
  onRejectItem
}) => {
  const pendingItems = queueItems.filter(i => i.status === 'PENDING');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>HUMAN-IN-THE-LOOP APPROVAL & REFLEXIVE PRE-MORTEM (#16)</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          High-Risk Action Review Queue
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Consequential or out-of-envelope agent decisions are gated here. Review the agent's falsifiable self-audit pre-mortem, intent-diff score, and digital twin simulation before authorizing execution.
        </p>
      </div>

      {pendingItems.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-2xl space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">HITL Review Queue Empty</h3>
          <p className="text-slate-400 text-xs font-mono max-w-md mx-auto">
            All agent action requests are within Cedar policy thresholds or have been processed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingItems.map((item) => {
            const req = item.evaluationResult.request;

            return (
              <div key={item.id} className="glass-card rounded-2xl p-7 space-y-6 shadow-2xl border-amber-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        REQUIRE_HITL
                      </span>
                      <span className="text-xs font-mono text-slate-400">Queue ID: {item.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1.5">
                      {req.agentName} — <span className="text-amber-300">{req.actionType}</span>
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Target Amount</div>
                    <div className="text-2xl font-extrabold text-amber-300">
                      ${req.targetAmount?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-amber-300 font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      Agent Stated Intent & Context
                    </div>
                    <p className="text-slate-300 leading-relaxed">{req.reasoning}</p>
                    <div className="text-slate-400 pt-2">
                      Counterparty: <span className="text-white">{req.counterparty}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-amber-300 font-bold flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      Reflexive Pre-Mortem Self-Audit (#16)
                    </div>
                    <div className="text-slate-300">
                      Self-Confidence: <span className="font-bold text-emerald-400">{(item.preMortemAnalysis.statedConfidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-slate-400 text-[10px] block">POTENTIAL FAILURE MODES:</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {item.preMortemAnalysis.failureModes.map((fm, idx) => (
                          <li key={idx}>{fm}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-3 border-t border-white/10">
                  <button
                    onClick={() => onRejectItem(item.id)}
                    className="px-6 py-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-2 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    REJECT & BLOCK ACTION
                  </button>

                  <button
                    onClick={() => onApproveItem(item.id)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-black text-xs font-mono font-extrabold flex items-center gap-2 shadow-glow-gold transition"
                  >
                    <UserCheck className="w-4 h-4 fill-black" />
                    AUTHORIZE EXECUTION
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
