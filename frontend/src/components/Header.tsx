import React from 'react';
import { Shield, Radio, Activity, Cpu, Sparkles, AlertTriangle, GitCompare } from 'lucide-react';
import { AggregatedScenarioResult } from '../types/index.js';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  result: AggregatedScenarioResult | null;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  result,
  isConnected
}) => {
  const tabs = [
    { id: 'overview', label: 'Executive Dashboard', icon: Activity },
    { id: 'map', label: 'Maritime Map', icon: Shield },
    { id: 'agents', label: '5-Agent Console', icon: Cpu },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'Live' },
    { id: 'simulator', label: 'Crisis Simulator', icon: AlertTriangle },
    { id: 'compare', label: 'Compare Scenarios', icon: GitCompare, badge: 'New' },
    { id: 'procurement', label: 'Procurement & SPR', icon: Radio },
  ];

  const severityColor = result?.geoRisk?.threatLevel === 'CRITICAL'
    ? 'bg-red-500/20 text-red-400 border-red-500/30'
    : result?.geoRisk?.threatLevel === 'HIGH'
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

  return (
    <header className="bg-[#0b1120] border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  NEURA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">NOVA</span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                  v2.4 Multi-Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Energy Resilience & Supply Chain Intelligence Engine</p>
            </div>
          </div>

          {/* Real-time Status Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Active Scenario */}
            {result && (
              <div className={`px-3 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${severityColor}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span>{result.scenarioName}</span>
                <span className="opacity-60 text-[10px]">({result.geoRisk?.threatLevel})</span>
              </div>
            )}

            {/* Model Engine */}
            <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{result?.modelUsed || 'Claude 3.5 / Simulation'}</span>
            </div>

            {/* WebSocket Connection */}
            <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500'}`} />
              <span className="text-slate-300 font-mono">{isConnected ? 'LIVE STREAM' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 border-t border-slate-800/60 pt-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 rounded font-bold ${
                    tab.badge === 'New'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
