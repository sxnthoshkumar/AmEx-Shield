import React from 'react';
import { GovernanceNode } from '../types';
import { Zap, AlertTriangle, GitCommit, UserCheck } from 'lucide-react';

interface GovernanceGraphViewProps {
  nodes: GovernanceNode[];
}

export const GovernanceGraphView: React.FC<GovernanceGraphViewProps> = ({ nodes }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>INVENTION CONCEPT #6 • GOVERNANCE GRAPH (AUTHORITY PROVENANCE DAG)</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Multi-Hop Authority Provenance Visualizer
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Models every grant of authority — human mandate → agent → sub-agent → MCP tool call — as a hash-linked directed acyclic graph. Structural graph analysis continuously detects authority laundering and unanchored delegation hops.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-8 min-h-[420px]">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between border-b border-white/10 pb-4">
          <span>LIVE DELEGATION TRAJECTORY DAG</span>
          <span className="text-cyan-300">AP2 Intent Mandate Rooted</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
          {nodes.map((node, idx) => {
            const isHuman = node.type === 'HUMAN_MANDATE';
            const isAgent = node.type === 'PRIMARY_AGENT';
            const isBlocked = node.status === 'BLOCKED';
            const isEscalated = node.status === 'ESCALATED';

            const cardBorder = isBlocked
              ? 'border-red-500/50 bg-red-950/30 text-red-200'
              : isEscalated
              ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200'
              : 'border-white/10 bg-slate-950/60 text-white';

            return (
              <React.Fragment key={node.id}>
                <div className={`w-full md:w-80 p-6 rounded-2xl border ${cardBorder} shadow-xl space-y-4 relative transition hover:scale-105`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/20 text-[10px]">
                      {node.type}
                    </span>
                    <span className={`font-bold ${isBlocked ? 'text-red-400' : isEscalated ? 'text-cyan-400' : 'text-emerald-400'}`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/5 shrink-0">
                      {isHuman ? (
                        <UserCheck className="w-5 h-5 text-cyan-400" />
                      ) : isAgent ? (
                        <Zap className="w-5 h-5 text-sky-400" />
                      ) : (
                        <GitCommit className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{node.label}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {node.id}</p>
                    </div>
                  </div>

                  {node.anomalyFlag && (
                    <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/40 text-[10px] font-mono text-red-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{node.anomalyFlag}</span>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-3 border-t border-white/5">
                    <span>Risk Score: {node.riskScore}/100</span>
                    <span>Hash Verified</span>
                  </div>
                </div>

                {idx < nodes.length - 1 && (
                  <div className="hidden md:flex flex-col items-center text-cyan-400 font-mono text-xs">
                    <div className="w-14 h-[2px] bg-gradient-to-r from-sky-400 to-cyan-400" />
                    <span className="text-[10px] text-slate-400 mt-1.5">Delegates</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
