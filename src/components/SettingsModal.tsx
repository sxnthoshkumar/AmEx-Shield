import React, { useState } from 'react';
import { X, Key, Save, CheckCircle2, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [openaiKey, setOpenaiKey] = useState<string>(localStorage.getItem('OPENAI_API_KEY') || '');
  const [anthropicKey, setAnthropicKey] = useState<string>(localStorage.getItem('ANTHROPIC_API_KEY') || '');
  const [savedMsg, setSavedMsg] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('OPENAI_API_KEY', openaiKey);
    localStorage.setItem('ANTHROPIC_API_KEY', anthropicKey);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl glass-panel border border-cyan-500/30 p-7 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Key className="w-5 h-5 text-cyan-400" />
            AmEx Shield Settings & API Keys
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-slate-300">
            <div className="font-bold flex items-center gap-1.5 text-cyan-300">
              <Cpu className="w-4 h-4" />
              Dual-Engine Configuration
            </div>
            <p className="mt-1 text-[11px] text-slate-300 leading-relaxed font-sans">
              AmEx Shield operates with a high-fidelity local simulation engine out of the box (requiring zero API keys). Optionally provide external frontier LLM API keys below to route live model calls through the Shield control plane.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300">OpenAI API Key (Optional)</label>
            <input
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300">Anthropic API Key (Optional)</label>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono hover:bg-slate-800"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 hover:from-sky-300 hover:to-cyan-300 text-black font-extrabold text-xs font-mono flex items-center gap-2 shadow-glow-cyan"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
