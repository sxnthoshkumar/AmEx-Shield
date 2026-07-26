import React, { useState } from 'react';
import { BENCHMARK_ATTACK_SCENARIOS } from '../services/redTeamEngine';
import { Shield, Bug, Play } from 'lucide-react';

interface RedTeamPlaygroundProps {
  onRunAttackScenario: (scenarioId: string) => void;
}

export const RedTeamPlayground: React.FC<RedTeamPlaygroundProps> = ({ onRunAttackScenario }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(BENCHMARK_ATTACK_SCENARIOS[0].id);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const activeScenario = BENCHMARK_ATTACK_SCENARIOS.find(s => s.id === activeScenarioId) || BENCHMARK_ATTACK_SCENARIOS[0];

  const handleLaunchScenario = async () => {
    setIsRunning(true);
    setSimulationLogs([
      `[RED-TEAM TWIN] Spawning Sandboxed Shadow Session for target: ${activeScenario.targetAgentId}`,
      `[OWASP BENCHMARK] Injecting Attack Vector: ${activeScenario.threatCategory}...`,
      `[PAYLOAD ENCOUNTERED] "${activeScenario.injectedPayload}"`,
      `[AMEX SHIELD AI FIREWALL] Intercepting tool input at MCP Gateway boundary...`,
      `[SECURITY VERDICT] Threat Identified. Action FORBIDDEN. Credentials revoked for session.`,
      `[AUTO-REGRESSION] Generating benchmark regression test case in evaluation suite.`
    ]);
    onRunAttackScenario(activeScenario.id);
    setIsRunning(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
          <Bug className="w-3.5 h-3.5 text-red-400" />
          <span>INVENTION CONCEPT #7 • ADVERSARIAL SELF-RED-TEAMING TWIN</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Continuous Live Immune System & Vulnerability Scanner
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          A sandboxed shadow agent continuously attempts prompt injections (OWASP ASI01), privilege abuse (OWASP ASI03), and MCP stdio code execution exploits against live production contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-7 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Shield className="w-5 h-5 text-red-400" />
            OWASP Benchmark Attack Vectors
          </h3>

          <div className="space-y-3">
            {BENCHMARK_ATTACK_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setActiveScenarioId(scenario.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  activeScenarioId === scenario.id
                    ? 'bg-red-950/30 border-red-500/50 text-white shadow-glow-red'
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs font-mono shadow-glow-red transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RUN SHADOW ATTACK SCENARIO</span>
          </button>
        </div>

        <div className="rounded-2xl bg-[#040711] border border-white/10 p-7 space-y-5 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              RED-TEAM TWIN TRACE
            </span>
            <span className="text-emerald-400">AttestMCP Active</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 min-h-[320px]">
            {simulationLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-28">
                Click "RUN SHADOW ATTACK SCENARIO" to watch the adversarial twin execute attacks in parallel.
              </div>
            ) : (
              simulationLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed animate-fadeIn">
                  {log.includes('CRITICAL') || log.includes('FORBIDDEN') ? (
                    <span className="text-red-400 font-bold">{log}</span>
                  ) : log.includes('AI FIREWALL') || log.includes('SECURITY') ? (
                    <span className="text-amber-300">{log}</span>
                  ) : (
                    <span className="text-slate-300">{log}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
