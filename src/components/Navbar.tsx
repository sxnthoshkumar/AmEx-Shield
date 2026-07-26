import React, { useState } from 'react';
import { AmExShieldLogo } from './AmExShieldLogo';
import { Shield, Zap, Lock, AlertTriangle, Settings, FileText, CheckCircle2, Eye, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemKilled: boolean;
  onToggleKillSwitch: () => void;
  pendingHitlCount: number;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  systemKilled,
  onToggleKillSwitch,
  pendingHitlCount,
  onOpenSettings
}) => {
  const [enginesOpen, setEnginesOpen] = useState(false);

  const primaryNav = [
    { id: 'dashboard', label: 'Control Plane', icon: Zap },
    { id: 'simulator', label: 'Agent Sandbox', icon: Shield },
    { id: 'passports', label: 'Passports', icon: Lock },
    { id: 'hitl', label: 'HITL Queue', icon: AlertTriangle, badge: pendingHitlCount },
  ];

  const engineNav = [
    { id: 'redteam', label: 'Red-Team Twin', icon: Shield },
    { id: 'graph', label: 'Authority Graph (DAG)', icon: Zap },
    { id: 'shadow', label: 'Shadow Twin', icon: Eye },
    { id: 'policies', label: 'Cedar Rules', icon: FileText },
    { id: 'audit', label: 'Audit & Certificates', icon: CheckCircle2 }
  ];

  const currentEngineTab = engineNav.find(e => e.id === activeTab);

  return (
    <header className="sticky top-0 z-50 bg-[#040711]/95 backdrop-blur-xl border-b border-white/10 px-6 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-6">
        
        {/* Left: Clean Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0 group" onClick={() => setActiveTab('dashboard')}>
          <div className="relative">
            <AmExShieldLogo size={36} className="transition-transform duration-300 group-hover:scale-105" />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#040711] ${systemKilled ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5 leading-none">
              AmEx <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 font-extrabold">SHIELD</span>
            </h1>
          </div>
        </div>

        {/* Center: Clean Primary Tabs */}
        <nav className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/25 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-400 text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-800 mx-1.5" />

          {/* Engine Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setEnginesOpen(!enginesOpen)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap border ${
                currentEngineTab
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-slate-900/60 text-slate-300 border-white/5 hover:bg-white/5'
              }`}
            >
              <span>{currentEngineTab ? currentEngineTab.label : 'Governance Engines'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${enginesOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
            </button>

            {enginesOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-56 rounded-xl glass-panel border border-white/10 p-2 space-y-1 shadow-2xl z-50 animate-fadeIn"
                onMouseLeave={() => setEnginesOpen(false)}
              >
                {engineNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setEnginesOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition"
            title="Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleKillSwitch}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold tracking-wider transition-all flex items-center gap-2 border ${
              systemKilled
                ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50 animate-pulse'
                : 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-500/30'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${systemKilled ? 'text-emerald-400' : 'text-red-400'}`} />
            <span>{systemKilled ? 'RESTORE ACCESS' : 'KILL SWITCH'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
