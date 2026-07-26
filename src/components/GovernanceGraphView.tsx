import React, { useState } from 'react';
import { GovernanceNode } from '../types';
import { Zap, AlertTriangle, GitCommit, UserCheck, Shield, Clock, KeyRound, ArrowRight, Activity } from 'lucide-react';

interface GovernanceGraphViewProps {
  nodes: GovernanceNode[];
}

export const GovernanceGraphView: React.FC<GovernanceGraphViewProps> = ({ nodes }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GovernanceNode | null>(null);

  // Fallback nodes if empty
  const activeNodes: GovernanceNode[] = nodes.length > 0 ? nodes : [
    {
      id: 'MANDATE-CARDMEMBER-001',
      label: 'Signed Human Cardmember Mandate (AP2 / ACE)',
      type: 'HUMAN_MANDATE',
      riskScore: 5,
      childrenIds: ['agent-credit-underwriter-01'],
      status: 'AUTHORIZED'
    },
    {
      id: 'agent-credit-underwriter-01',
      label: 'Credit Line Underwriting Agent',
      type: 'PRIMARY_AGENT',
      category: 'UNDERWRITING_CREDIT',
      riskScore: 35,
      parentId: 'MANDATE-CARDMEMBER-001',
      childrenIds: ['tool-mcp-underwrite-exec'],
      status: 'AUTHORIZED'
    },
    {
      id: 'tool-mcp-underwrite-exec',
      label: 'MCP Tool Execution: propose_credit_line_increase',
      type: 'TOOL_CALL',
      category: 'UNDERWRITING_CREDIT',
      riskScore: 68,
      parentId: 'agent-credit-underwriter-01',
      childrenIds: [],
      status: 'ESCALATED'
    }
  ];

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(selectedNodeId === id ? null : id);
  };

  // Helper to determine if a node is in the active highlighted chain
  const isNodeHighlighted = (id: string) => {
    if (!selectedNodeId) return true;
    if (selectedNodeId === id) return true;
    const selected = activeNodes.find(n => n.id === selectedNodeId);
    if (!selected) return false;
    return selected.parentId === id || selected.childrenIds.includes(id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>INVENTION CONCEPT #6 • GOVERNANCE GRAPH (AUTHORITY PROVENANCE DAG)</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Multi-Hop Authority Provenance Visualizer
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Interactive hash-linked Directed Acyclic Graph (DAG) mapping delegation from <span className="text-cyan-300 font-bold">Human Mandate → Agent → MCP Tool Execution</span>. Click any node to isolate delegation chains.
        </p>
      </div>

      {/* Interactive Graph Canvas */}
      <div className="glass-card rounded-2xl p-8 space-y-6 relative overflow-hidden min-h-[500px]">
        {/* Graph Subheader */}
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              LIVE PROVENANCE TRAJECTORY
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Click node to inspect delegation chain</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">AP2 Cryptographically Anchored</span>
        </div>

        {/* SVG Pulse Connections Container */}
        <div className="relative py-8">
          {/* Animated SVG Delegation Pulse Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0070F3" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="redLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Nodes Chain Flex Layout */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {activeNodes.map((node, idx) => {
              const isHuman = node.type === 'HUMAN_MANDATE';
              const isAgent = node.type === 'PRIMARY_AGENT';
              const isBlocked = node.status === 'BLOCKED';
              const isEscalated = node.status === 'ESCALATED';

              const isHighlighted = isNodeHighlighted(node.id);
              const isSelected = selectedNodeId === node.id;

              const cardBorder = isBlocked
                ? 'border-red-500/80 bg-red-950/40 text-red-200 shadow-glow-red'
                : isEscalated
                ? 'border-cyan-500/80 bg-cyan-950/30 text-cyan-200 shadow-glow-cyan'
                : 'border-white/10 bg-slate-950/70 text-white';

              return (
                <React.Fragment key={node.id}>
                  {/* Node Component with Alive Floating Motion & Interactivity */}
                  <div
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`w-full lg:w-80 p-6 rounded-2xl border ${cardBorder} backdrop-blur-xl shadow-2xl relative transition-all duration-300 cursor-pointer transform ${
                      isSelected ? 'scale-105 ring-2 ring-cyan-400 shadow-glow-cyan z-30' : 'hover:scale-102'
                    } ${!isHighlighted ? 'opacity-35 grayscale-[50%]' : 'opacity-100'} animate-float-${idx}`}
                    style={{ animation: `floatNode 6s ease-in-out infinite ${idx * 0.8}s` }}
                  >
                    {/* Floating Pulse Dot */}
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold tracking-wider">
                        {node.type}
                      </span>
                      <span className={`font-bold flex items-center gap-1.5 ${isBlocked ? 'text-red-400' : isEscalated ? 'text-cyan-300' : 'text-emerald-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isBlocked ? 'bg-red-500 animate-ping' : isEscalated ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
                        {node.status}
                      </span>
                    </div>

                    {/* Content Header */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                        {isHuman ? (
                          <UserCheck className="w-5 h-5 text-cyan-400" />
                        ) : isAgent ? (
                          <Zap className="w-5 h-5 text-sky-400" />
                        ) : (
                          <GitCommit className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white leading-snug">{node.label}</h4>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {node.id}</p>
                      </div>
                    </div>

                    {/* Violation Flag */}
                    {node.anomalyFlag && (
                      <div className="mt-4 p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-[10px] font-mono text-red-300 flex items-center gap-2 animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Violation: {node.anomalyFlag}</span>
                      </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-3 mt-4 border-t border-white/10">
                      <span>Risk Score: <strong className={node.riskScore > 60 ? 'text-red-400' : 'text-emerald-400'}>{node.riskScore}/100</strong></span>
                      <span className="text-cyan-300 font-semibold">AP2 Signed</span>
                    </div>
                  </div>

                  {/* Pulsing Edge Connector Between Nodes */}
                  {idx < activeNodes.length - 1 && (
                    <div className="hidden lg:flex flex-col items-center justify-center text-cyan-400 font-mono text-xs px-2 z-20">
                      <div className="relative flex items-center">
                        {/* Glowing Line */}
                        <div className={`w-20 h-[3px] rounded-full ${node.anomalyFlag || activeNodes[idx+1]?.anomalyFlag ? 'bg-red-500 shadow-glow-red animate-pulse' : 'bg-gradient-to-r from-sky-400 to-cyan-400 shadow-glow-cyan'}`} />
                        <ArrowRight className={`w-4 h-4 -ml-2 ${node.anomalyFlag ? 'text-red-400 animate-bounce' : 'text-cyan-300'}`} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1.5 tracking-wider">
                        {node.anomalyFlag ? 'UNAUTHORIZED' : 'DELEGATES'}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Hover Metadata Tooltip Card */}
        {hoveredNode && (
          <div className="p-4 rounded-xl glass-panel border border-cyan-500/40 text-xs font-mono text-slate-200 space-y-2 animate-fadeIn max-w-lg mx-auto shadow-2xl">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                Metadata Provenance Inspector: {hoveredNode.id}
              </span>
              <span className="text-[10px] text-emerald-400">Verifiable DAG Node</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
              <div>
                <span className="text-slate-400 block">RISK SCORE:</span>
                <span className="font-bold text-white">{hoveredNode.riskScore} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 block">DELEGATED BY:</span>
                <span className="font-bold text-cyan-300">{hoveredNode.parentId || 'ROOT HUMAN MANDATE'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">TIMESTAMP:</span>
                <span className="font-bold text-slate-300">{new Date().toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">DIGITAL SIGNATURE:</span>
                <span className="font-bold text-cyan-200 truncate block">0x9A4F8812399102...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
