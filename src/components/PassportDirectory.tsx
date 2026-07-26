import React from 'react';
import { AgentPassport } from '../types';
import { Lock, ShieldCheck, ShieldAlert, KeyRound, Cpu } from 'lucide-react';

interface PassportDirectoryProps {
  passports: AgentPassport[];
}

export const PassportDirectory: React.FC<PassportDirectoryProps> = ({ passports }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>INVENTION CONCEPT #1 & #5 • GOVERNANCE PASSPORTS & TRUST DECAY</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Verifiable Agent Passport Registry
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Every non-human financial actor carries a portable, cryptographically signed behavioral credential encoding a rolling clean-decision streak and time-decaying trust score.
        </p>
      </div>

      {/* Grid of Passports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {passports.map((passport) => {
          const isProbation = passport.probationStatus;
          const scoreColor = passport.trustScore >= 90 ? 'text-emerald-400' : passport.trustScore >= 75 ? 'text-amber-400' : 'text-red-400';

          return (
            <div
              key={passport.id}
              className="glass-card rounded-2xl p-7 space-y-5 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/20">
                    {passport.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {passport.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-1">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <span>{passport.modelLineage}</span>
                  </div>
                </div>

                <div className="text-center p-3.5 rounded-2xl bg-slate-950/80 border border-white/5">
                  <div className={`text-3xl font-extrabold font-mono ${scoreColor}`}>
                    {passport.trustScore}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">TRUST RATING</div>
                </div>
              </div>

              {isProbation ? (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2.5 text-xs font-mono text-red-300">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Agent is under Probation Supervision (#5). Mandatory HITL gating enforced.</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-2.5 text-xs font-mono text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Passport Standing Excellent. Operating inside Cedar policy bounds.</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">Authorized Capability Scope (Least Agency):</div>
                <div className="flex flex-wrap gap-1.5">
                  {passport.capabilities.map((cap) => (
                    <span key={cap} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-white/5">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-xs font-mono text-center">
                <div>
                  <div className="text-slate-400 text-[10px]">CLEAN STREAK</div>
                  <div className="font-bold text-emerald-400">{passport.cleanStreak}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">DECISIONS</div>
                  <div className="font-bold text-white">{passport.totalDecisions}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">INCIDENTS</div>
                  <div className="font-bold text-amber-400">{passport.incidentCount}</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  Public Key: <span className="text-slate-300">{passport.publicKey}</span>
                </span>
                <span>W3C VC</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
