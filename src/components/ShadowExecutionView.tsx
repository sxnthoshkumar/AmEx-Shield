import React, { useState, useEffect } from 'react';
import { CounterfactualResult } from '../types';
import { Zap, AlertTriangle, CheckCircle2, RefreshCw, Activity, ArrowRight, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

interface ShadowExecutionViewProps {
  lastShadowResult?: CounterfactualResult;
}

export const ShadowExecutionView: React.FC<ShadowExecutionViewProps> = ({ lastShadowResult }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const defaultResult: CounterfactualResult = {
    simulatedStateValid: false,
    predictedLossDelta: 480,
    historicalDeviationscore: 0.68,
    twinExpectedEnvelopeMatch: false,
    shadowAccountState: {
      preBalance: 12500,
      postBalance: 32500,
      anomalyFlag: 'DEBT_TO_INCOME_RATIO_ELEVATED'
    }
  };

  const result = lastShadowResult || defaultResult;

  const steps = [
    { id: 1, label: 'Current Real State', desc: 'Fetching live cardmember account balance & envelope baseline' },
    { id: 2, label: 'Agent Proposed Action', desc: 'Intercepting proposed $20,000 credit line extension request' },
    { id: 3, label: 'Shadow Simulation Running', desc: 'Executing action against digital twin sandbox in parallel' },
    { id: 4, label: 'Predicted Shadow State', desc: 'Calculating post-action balance ($32,500) & debt ratio' },
    { id: 5, label: 'Risk Delta Analysis', desc: `Expected credit loss risk delta calculated: +$${result.predictedLossDelta}` },
    { id: 6, label: 'Envelope Comparison', desc: `Customer historical spend deviation score: ${(result.historicalDeviationscore * 100).toFixed(0)}%` },
    { id: 7, label: 'Final Recommendation', desc: result.twinExpectedEnvelopeMatch ? 'Enforce PERMIT' : 'Gate to Mandatory HITL Review' }
  ];

  const runSimulationTimeline = () => {
    setIsSimulating(true);
    setActiveStep(1);

    let current = 1;
    const interval = setInterval(() => {
      current++;
      if (current <= steps.length) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 600);
  };

  useEffect(() => {
    // Run initial animation on page mount
    runSimulationTimeline();
  }, [lastShadowResult]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>INVENTION CONCEPTS #3 & #12 • COUNTERFACTUAL SHADOW EXECUTION</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Per-Customer Digital Twin Simulation Timeline
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl">
              Before committing real system-of-record writes, proposed agent actions are applied to a parallel digital twin. Watch the live 7-step counterfactual simulation sequence below.
            </p>
          </div>

          <button
            onClick={runSimulationTimeline}
            disabled={isSimulating}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 hover:from-sky-300 hover:to-cyan-300 text-black font-extrabold text-xs font-mono tracking-wider shadow-glow-cyan transition flex items-center gap-2 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>RE-RUN SHADOW SIMULATION</span>
          </button>
        </div>
      </div>

      {/* 7-Step Simulation Progress Timeline */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between border-b border-white/10 pb-4">
          <span className="flex items-center gap-2 text-cyan-300 font-bold">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            SIMULATION TIMELINE PROGRESSION
          </span>
          <span className="text-xs font-mono text-slate-400">Step {activeStep} of {steps.length}</span>
        </div>

        {/* Step Indicator Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {steps.map((step) => {
            const isCompleted = activeStep > step.id;
            const isCurrent = activeStep === step.id;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan ring-1 ring-cyan-400 scale-105'
                    : isCompleted
                    ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/40 border-white/5 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold">STEP {step.id}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isCurrent && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                </div>
                <div className="font-bold truncate text-[11px]">{step.label}</div>
              </div>
            );
          })}
        </div>

        {/* Active Step Status Detail Banner */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">Active Timeline Execution:</span>
            <span className="text-cyan-300 font-bold">{steps[activeStep - 1]?.desc || 'Simulation Ready'}</span>
          </div>
          {isSimulating && <span className="text-emerald-400 animate-pulse">Running Digital Twin...</span>}
        </div>
      </div>

      {/* Visual State Comparison: Real vs Shadow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real Current State */}
        <div className="glass-card rounded-2xl p-8 space-y-5">
          <div className="text-xs font-mono text-slate-400 border-b border-white/10 pb-3 flex items-center justify-between">
            <span>REAL ACCOUNT BASELINE STATE</span>
            <span className="text-emerald-400 font-bold">LIVE PRODUCTION</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-slate-400 block">Current Account Balance</span>
              <div className="text-4xl font-extrabold font-mono text-white mt-1">
                ${result.shadowAccountState.preBalance?.toLocaleString() || '12,500'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Historical Velocity Envelope:</span>
                <span className="text-emerald-400 font-bold">NORMAL (0.12)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[15%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Predicted Shadow State */}
        <div className={`glass-card rounded-2xl p-8 space-y-5 border ${
          result.twinExpectedEnvelopeMatch
            ? 'border-emerald-500/30'
            : 'border-red-500/50 shadow-glow-red'
        }`}>
          <div className="text-xs font-mono border-b border-white/10 pb-3 flex items-center justify-between">
            <span className="text-cyan-300 font-bold">PREDICTED COUNTERFACTUAL SHADOW STATE</span>
            <span className={`font-extrabold text-xs px-2.5 py-0.5 rounded ${result.twinExpectedEnvelopeMatch ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/50 animate-pulse'}`}>
              {result.twinExpectedEnvelopeMatch ? 'ENVELOPE MATCH' : 'DEVIATION DETECTED'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-slate-400 block">Post-Action Predicted Balance</span>
              <div className="text-4xl font-extrabold font-mono text-cyan-300 mt-1 flex items-center gap-3">
                ${result.shadowAccountState.postBalance?.toLocaleString() || '32,500'}
                <span className="text-xs font-bold text-red-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-0.5" />
                  +${((result.shadowAccountState.postBalance || 32500) - (result.shadowAccountState.preBalance || 12500)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Abnormal Behavioral Envelope Visual Gauge */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Customer Envelope Deviation Score:</span>
                <span className={`font-extrabold ${result.historicalDeviationscore > 0.4 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {(result.historicalDeviationscore * 100).toFixed(0)}% DEVIATION
                </span>
              </div>

              {/* Animated Gauge Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${result.historicalDeviationscore > 0.4 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(100, result.historicalDeviationscore * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Perfect Match)</span>
                <span>50% (Warning Threshold)</span>
                <span>100% (High Risk)</span>
              </div>
            </div>

            {/* Anomaly Callout Banner */}
            {!result.twinExpectedEnvelopeMatch && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-xs font-mono text-red-200 flex items-center gap-3 animate-pulse">
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <div className="font-bold text-red-300">Digital Twin Anomaly Detected!</div>
                  <div className="text-[11px] text-red-200/90 mt-0.5">
                    Flag: {result.shadowAccountState.anomalyFlag || 'DEBT_TO_INCOME_RATIO_ELEVATED'}. Action exceeds historical customer spend envelope. Gated to HITL review.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
