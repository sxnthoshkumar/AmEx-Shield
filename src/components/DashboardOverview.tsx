import React from 'react';
import { AgentPassport, ShieldEvaluationResult } from '../types';
import { Shield, Lock, AlertTriangle, CheckCircle2, Zap, ArrowUpRight, Activity, Award, ChevronRight } from 'lucide-react';

interface DashboardOverviewProps {
  passports: AgentPassport[];
  evaluations: ShieldEvaluationResult[];
  onSelectAgent: (agentId: string) => void;
  onLaunchSimulator: () => void;
  pendingHitlCount: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  passports,
  evaluations,
  onSelectAgent,
  onLaunchSimulator,
  pendingHitlCount
}) => {
  const totalDecisions = evaluations.length + passports.reduce((sum, p) => sum + p.totalDecisions, 0);
  const avgTrustScore = Math.round(passports.reduce((sum, p) => sum + p.trustScore, 0) / passports.length);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-gold-card p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono tracking-wider">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>THE LIVING TRUST FABRIC • AMEX ENTERPRISE GOVERNANCE</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Autonomous Financial Agent Control Plane
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              Continuous, deterministic runtime governance for non-human financial actors. Enforcing Least Agency, Intent-Bound Cryptographic Capsules, Counterfactual Shadow Twins, and EU AI Act Article 12 compliance in real time.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onLaunchSimulator}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-sm tracking-wide shadow-glow-gold transition flex items-center gap-2.5"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>LAUNCH AGENT SANDBOX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacious Executive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono tracking-wider">
            <span>GOVERNED DECISIONS</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalDecisions.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <span>100% Policy Verified</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono tracking-wider">
            <span>AVERAGE TRUST SCORE</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">
            {avgTrustScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-slate-400">
            Time-Decaying Reputation Engine (#5)
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono tracking-wider">
            <span>HITL APPROVALS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">{pendingHitlCount}</div>
          <div className="text-xs text-slate-400">
            Reflexive Pre-Mortem Gated (#16)
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono tracking-wider">
            <span>REGULATORY STATUS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">EU AI ACT & DORA</div>
          <div className="text-xs text-slate-400">
            Article 12 Auto-Logged
          </div>
        </div>
      </div>

      {/* Main Split: Passports & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Governance Passports Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-amber-400" />
              Active Governance Passports (#1)
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 Registered Agents</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {passports.map((passport) => {
              const scoreColor = passport.trustScore >= 90 ? 'text-emerald-400' : passport.trustScore >= 75 ? 'text-amber-400' : 'text-red-400';
              const progressBg = passport.trustScore >= 90 ? 'bg-emerald-500' : passport.trustScore >= 75 ? 'bg-amber-500' : 'bg-red-500';

              return (
                <div
                  key={passport.id}
                  onClick={() => onSelectAgent(passport.id)}
                  className="glass-card rounded-2xl p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/20">
                        {passport.category}
                      </span>
                      <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition">
                        {passport.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className={`text-2xl font-extrabold font-mono ${scoreColor}`}>
                        {passport.trustScore}
                      </div>
                      <div className="text-[10px] text-slate-400">TRUST SCORE</div>
                    </div>
                  </div>

                  {/* Clean Trust Progress */}
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div className={`h-full ${progressBg} transition-all duration-500`} style={{ width: `${passport.trustScore}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t border-white/5">
                    <div>
                      <span className="text-slate-400 text-[10px] block">CLEAN STREAK</span>
                      <span className="font-semibold text-emerald-400">{passport.cleanStreak} decisions</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">RISK BUDGET</span>
                      <span className="font-semibold text-amber-300">${passport.dailyRiskBudgetRemaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Activity Feed Column */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-amber-400" />
              Evaluation Activity (#10)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Decision Receipts</span>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-4 max-h-[540px] overflow-y-auto">
            {evaluations.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Shield className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">No evaluations recorded yet.</p>
                <button
                  onClick={onLaunchSimulator}
                  className="px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-mono font-bold"
                >
                  Run Agent Sandbox
                </button>
              </div>
            ) : (
              evaluations.map((item) => {
                const isPermit = item.decision === 'PERMIT';
                const isForbid = item.decision === 'FORBID';
                const badgeStyle = isPermit
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  : isForbid
                  ? 'bg-red-950/60 text-red-400 border-red-500/30'
                  : 'bg-amber-950/60 text-amber-400 border-amber-500/30';

                return (
                  <div key={item.evaluationId} className="p-4 rounded-xl bg-slate-950/50 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeStyle}`}>
                        {item.decision}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white">
                      {item.request.agentName}
                    </div>
                    <div className="text-xs font-mono text-amber-200">
                      {item.request.actionType} {item.request.targetAmount ? `($${item.request.targetAmount.toLocaleString()})` : ''}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
