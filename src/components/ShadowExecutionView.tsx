import React from 'react';
import { CounterfactualResult } from '../types';
import { Zap } from 'lucide-react';

interface ShadowExecutionViewProps {
  lastShadowResult?: CounterfactualResult;
}

export const ShadowExecutionView: React.FC<ShadowExecutionViewProps> = ({ lastShadowResult }) => {
  const result = lastShadowResult || {
    simulatedStateValid: true,
    predictedLossDelta: 120,
    historicalDeviationscore: 0.12,
    twinExpectedEnvelopeMatch: true,
    shadowAccountState: {
      preBalance: 12500,
      postBalance: 17500,
      anomalyFlag: 'NONE'
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>INVENTION CONCEPTS #3 & #12 • COUNTERFACTUAL SHADOW EXECUTION & DIGITAL TWINS</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Per-Customer Parallel Universe Simulation
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Before any real system of record write, the agent's proposed action is applied to a simulated digital twin of the account. The post-action state is compared against the customer's historical behavioral envelope.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-7 space-y-5">
          <div className="text-xs font-mono text-slate-400 border-b border-white/10 pb-3">
            CURRENT REAL ACCOUNT STATE
          </div>
          <div className="text-4xl font-extrabold font-mono text-white">
            ${result.shadowAccountState.preBalance?.toLocaleString() || '12,500'}
          </div>
          <p className="text-xs font-mono text-slate-400">
            Cardmember Spend Envelope: <span className="text-emerald-400">Low Volatility / Verified Patterns</span>
          </p>
        </div>

        <div className={`glass-card rounded-2xl p-7 space-y-5 border ${
          result.twinExpectedEnvelopeMatch
            ? 'border-emerald-500/30'
            : 'border-red-500/30'
        }`}>
          <div className="text-xs font-mono border-b border-white/10 pb-3 flex items-center justify-between">
            <span>PREDICTED COUNTERFACTUAL SHADOW STATE</span>
            <span className={`font-bold ${result.twinExpectedEnvelopeMatch ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.twinExpectedEnvelopeMatch ? 'ENVELOPE MATCH' : 'DEVIATION DETECTED'}
            </span>
          </div>

          <div className="text-4xl font-extrabold font-mono text-white">
            ${result.shadowAccountState.postBalance?.toLocaleString() || '17,500'}
          </div>

          <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-2">
            <div>Predicted Loss Delta: <span className="font-bold text-cyan-300">+${result.predictedLossDelta}</span></div>
            <div>Historical Deviation: <span className="font-bold text-cyan-300">{(result.historicalDeviationscore * 100).toFixed(0)}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
