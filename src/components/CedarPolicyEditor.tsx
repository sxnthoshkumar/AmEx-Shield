import React from 'react';
import { DEFAULT_POLICIES } from '../services/cedarPolicyEngine';
import { FileText } from 'lucide-react';

export const CedarPolicyEditor: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>CEDAR & OPA DYNAMIC AUTHORIZATION ENGINE</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Machine-Readable Policy Rules Library
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Declarative, versioned Cedar policies evaluated at every tool call. The model proposes actions; these deterministic Cedar rules dictate whether the action is permitted, forbidden, or routed to HITL.
        </p>
      </div>

      <div className="space-y-4">
        {DEFAULT_POLICIES.map((rule) => (
          <div key={rule.id} className="glass-card rounded-2xl p-7 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/20">
                  {rule.id}
                </span>
                <span className="text-xs text-slate-400">Category: {rule.category}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                rule.decision === 'PERMIT' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' :
                rule.decision === 'FORBID' ? 'bg-red-950/60 text-red-400 border-red-500/30' : 'bg-sky-950/60 text-sky-300 border-sky-500/30'
              }`}>
                DEFAULT: {rule.decision}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">{rule.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{rule.conditionDescription}</p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-cyan-300 overflow-x-auto">
              <code>{rule.cedarExpression}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
