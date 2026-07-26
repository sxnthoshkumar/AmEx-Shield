import React, { useState } from 'react';
import { BENCHMARK_ATTACK_SCENARIOS } from '../services/redTeamEngine';
import { Shield, Bug, AlertTriangle, CheckCircle2, Play, Terminal, ShieldAlert, KeyRound, Activity } from 'lucide-react';

interface RedTeamPlaygroundProps {
  onRunAttackScenario: (scenarioId: string) => void;
}

export const RedTeamPlayground: React.FC<RedTeamPlaygroundProps> = ({ onRunAttackScenario }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(BENCHMARK_ATTACK_SCENARIOS[0].id);
  const [simulationLogs, setSimulationLogs] = useState<{ step: string; level: 'red' | 'yellow' | 'green' | 'blue'; time: string }[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [attackCompleted, setAttackCompleted] = useState<boolean>(false);

  const activeScenario = BENCHMARK_ATTACK_SCENARIOS.find(s => s.id === activeScenarioId) || BENCHMARK_ATTACK_SCENARIOS[0];

  const handleLaunchScenario = async () => {
    setIsRunning(true);
    setAttackCompleted(false);
    setSimulationLogs([]);

    const now = () => new Date().toLocaleTimeString();

    const traceSteps: { step: string; level: 'red' | 'yellow' | 'green' | 'blue'; delay: number }[] = [
      { step: `[1/8] Attack Scenario Loaded: ${activeScenario.title}`, level: 'blue', delay: 300 },
      { step: `[2/8] Prompt Injection Attempt: Injected Payload "${activeScenario.injectedPayload.slice(0, 45)}..."`, level: 'red', delay: 800 },
      { step: `[3/8] Tool Call Intercepted at MCP Gateway Boundary`, level: 'yellow', delay: 1300 },
      { step: `[4/8] Intent Mandate Comparison: Divergence score 0.94 (Divergent from AP2 Signed Mandate)`, level: 'yellow', delay: 1800 },
      { step: `[5/8] Cedar Policy Evaluation: Rule POL-AMEX-005 Hard Stop Triggered`, level: 'red', delay: 2300 },
      { step: `[6/8] Threat Classification: ${activeScenario.threatCategory} Confirmed`, level: 'red', delay: 2800 },
      { step: `[7/8] Execution Blocked & Credentials Revoked for Agent Session`, level: 'green', delay: 3300 },
      { step: `[8/8] Decision Provenance Certificate Generated: CERT-AMEX-REDTEAM-${Date.now().toString().slice(-6)}`, level: 'green', delay: 3800 }
    ];

    for (const item of traceSteps) {
      await new Promise(resolve => setTimeout(resolve, item.delay));
      setSimulationLogs(prev => [...prev, { step: item.step, level: item.level, time: now() }]);
    }

    onRunAttackScenario(activeScenario.id);
    setIsRunning(false);
    setAttackCompleted(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
          <Bug className="w-3.5 h-3.5 text-red-400" />
          <span>INVENTION CONCEPT #7 • ADVERSARIAL SELF-RED-TEAMING TWIN</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Live SOC (Security Operations Center) Attack Console
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Watch adversarial jailbreak scenarios execute in real time against the Shield AI Firewall. Progressive step trace illustrates prompt injection interception at the tool boundary.
        </p>
      </div>

      {/* Main Grid: Attack Vectors vs Live SOC Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Benchmark Attack Scenarios */}
        <div className="glass-card rounded-2xl p-7 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/10 pb-4">
            <span className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-red-400" />
              OWASP Benchmark Attack Vectors
            </span>
            <span className="text-xs font-mono text-slate-400">3 Scenarios Ready</span>
          </h3>

          <div className="space-y-3">
            {BENCHMARK_ATTACK_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setActiveScenarioId(scenario.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  activeScenarioId === scenario.id
                    ? 'bg-red-950/40 border-red-500/60 text-white shadow-glow-red ring-1 ring-red-500/50'
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30">
                    {scenario.threatCategory}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{scenario.id}</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-2">{scenario.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{scenario.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleLaunchScenario}
            disabled={isRunning}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs font-mono shadow-glow-red transition flex items-center justify-center gap-2.5"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin" />
                EXPLOIT SIMULATION IN PROGRESS...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>RUN SHADOW ATTACK SCENARIO</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Live Terminal SOC Console */}
        <div className="rounded-2xl bg-[#030611] border border-red-500/30 p-7 space-y-5 font-mono shadow-2xl relative overflow-hidden">
          {/* Top SOC Console Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
            <span className="flex items-center gap-2 text-slate-300 font-bold">
              <Terminal className="w-4 h-4 text-red-400" />
              SOC THREAT INTERCEPTION LOG
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs text-emerald-400 font-bold">AttestMCP Interceptor Active</span>
            </div>
          </div>

          {/* Real-time Trace Log Body */}
          <div className="space-y-3 text-xs min-h-[340px] max-h-[400px] overflow-y-auto pr-2">
            {simulationLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-28 space-y-2">
                <ShieldAlert className="w-10 h-10 mx-auto text-slate-700" />
                <p>Click "RUN SHADOW ATTACK SCENARIO" to watch the real-time attack trace execute.</p>
              </div>
            ) : (
              simulationLogs.map((item, idx) => {
                const textColor = item.level === 'red'
                  ? 'text-red-400 font-bold'
                  : item.level === 'yellow'
                  ? 'text-amber-300 font-semibold'
                  : item.level === 'green'
                  ? 'text-emerald-400 font-bold'
                  : 'text-cyan-300';

                return (
                  <div key={idx} className="flex items-start gap-3 animate-fadeIn leading-relaxed">
                    <span className="text-[10px] text-slate-500 shrink-0 pt-0.5">[{item.time}]</span>
                    <span className={textColor}>{item.step}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Generated Certificate Badge Footer */}
          {attackCompleted && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ATTACK INTERCEPTED & MITIGATED
              </span>
              <span className="text-[10px] text-cyan-300 flex items-center gap-1 font-mono">
                <KeyRound className="w-3.5 h-3.5" />
                Signed Receipt Issued
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
