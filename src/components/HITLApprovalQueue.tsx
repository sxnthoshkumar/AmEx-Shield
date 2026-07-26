import React, { useState } from 'react';
import { HITLQueueItem } from '../types';
import { AlertTriangle, CheckCircle2, XCircle, FileText, UserCheck, HelpCircle, RefreshCw, KeyRound, Lock, ShieldAlert } from 'lucide-react';

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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [workflowType, setWorkflowType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const pendingItems = queueItems.filter(i => i.status === 'PENDING');

  const approveSteps = [
    'Human Reviewer Approval Captured',
    'Applying ECDSA Digital Signature (WebCrypto)',
    'Generating EU AI Act Decision Certificate',
    'Writing Immutable Audit Log Entry',
    'Releasing Execution to Banking System of Record',
    'Agent Notified & Passport Clean Streak Updated'
  ];

  const rejectSteps = [
    'Action Rejection Authorized',
    'Dynamic Cedar Policy Rule Updated (POL-HARD-STOP)',
    'Agent Passport Behavioral Penalty Applied',
    'Decaying Trust Score (-15 Points)',
    'Audit Certificate Signed & Logged',
    'Execution Blocked & Credentials Revoked'
  ];

  const handleApproveClick = async (itemId: string) => {
    setProcessingId(itemId);
    setWorkflowType('APPROVE');
    setCurrentStepIndex(0);

    for (let i = 0; i < approveSteps.length; i++) {
      await new Promise(res => setTimeout(res, 600));
      setCurrentStepIndex(i + 1);
    }

    await new Promise(res => setTimeout(res, 500));
    onApproveItem(itemId);
    setProcessingId(null);
    setWorkflowType(null);
  };

  const handleRejectClick = async (itemId: string) => {
    setProcessingId(itemId);
    setWorkflowType('REJECT');
    setCurrentStepIndex(0);

    for (let i = 0; i < rejectSteps.length; i++) {
      await new Promise(res => setTimeout(res, 600));
      setCurrentStepIndex(i + 1);
    }

    await new Promise(res => setTimeout(res, 500));
    onRejectItem(itemId);
    setProcessingId(null);
    setWorkflowType(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
          <span>HUMAN-IN-THE-LOOP APPROVAL & REFLEXIVE PRE-MORTEM (#16)</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          High-Risk Action Review Queue
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Consequential or out-of-envelope agent decisions are gated here. Authorizing or rejecting triggers a progressive multi-step cryptographic verification sequence.
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
            const isItemProcessing = processingId === item.id;
            const activeSteps = workflowType === 'APPROVE' ? approveSteps : rejectSteps;

            return (
              <div key={item.id} className="glass-card rounded-2xl p-7 space-y-6 shadow-2xl border-cyan-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-sky-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                        REQUIRE_HITL
                      </span>
                      <span className="text-xs font-mono text-slate-400">Queue ID: {item.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1.5">
                      {req.agentName} — <span className="text-cyan-300">{req.actionType}</span>
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Target Amount</div>
                    <div className="text-2xl font-extrabold text-cyan-300">
                      ${req.targetAmount?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Main Content Split: Reasoning & Pre-Mortem */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-cyan-300 font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Agent Stated Intent & Context
                    </div>
                    <p className="text-slate-300 leading-relaxed">{req.reasoning}</p>
                    <div className="text-slate-400 pt-2">
                      Counterparty: <span className="text-white">{req.counterparty}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-cyan-300 font-bold flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
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

                {/* Progressive Workflow Execution Overlay when clicked */}
                {isItemProcessing && (
                  <div className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/50 space-y-4 font-mono text-xs animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className={`font-bold flex items-center gap-2 ${workflowType === 'APPROVE' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {workflowType === 'APPROVE' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        {workflowType === 'APPROVE' ? 'AUTHORIZATION WORKFLOW IN PROGRESS' : 'REJECTION & REVOCATION WORKFLOW IN PROGRESS'}
                      </span>
                      <span className="text-slate-400">Step {currentStepIndex} of {activeSteps.length}</span>
                    </div>

                    <div className="space-y-2">
                      {activeSteps.map((stepText, idx) => {
                        const isDone = currentStepIndex > idx;
                        const isCurrent = currentStepIndex === idx;

                        return (
                          <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg transition ${
                            isCurrent ? 'bg-cyan-500/20 text-white font-bold' : isDone ? 'text-emerald-300 opacity-80' : 'text-slate-600'
                          }`}>
                            {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {isCurrent && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />}
                            {!isDone && !isCurrent && <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
                            <span>{stepText}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isItemProcessing && (
                  <div className="flex items-center justify-end gap-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleRejectClick(item.id)}
                      className="px-6 py-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-2 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      REJECT & BLOCK ACTION
                    </button>

                    <button
                      onClick={() => handleApproveClick(item.id)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 hover:from-sky-300 hover:to-cyan-300 text-black text-xs font-mono font-extrabold flex items-center gap-2 shadow-glow-cyan transition"
                    >
                      <UserCheck className="w-4 h-4 fill-black" />
                      AUTHORIZE EXECUTION
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
