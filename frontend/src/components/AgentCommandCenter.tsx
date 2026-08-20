import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Activity,
  Truck,
  Database,
  Share2,
  Terminal,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Filter
} from 'lucide-react';
import { AggregatedScenarioResult, AgentThoughtLog } from '../types/index.js';

interface AgentCommandCenterProps {
  result: AggregatedScenarioResult | null;
  thoughtLogs: AgentThoughtLog[];
  onRerunAgent?: () => void;
}

export const AgentCommandCenter: React.FC<AgentCommandCenterProps> = ({
  result,
  thoughtLogs,
  onRerunAgent
}) => {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'tool_call' | 'thought' | 'recommendation'>('all');

  if (!result) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-pulse" />
        <p>Awaiting multi-agent telemetry stream...</p>
      </div>
    );
  }

  const { geoRisk, disruptionImpact, procurement, reserves, digitalTwin } = result;

  const agents = [
    {
      id: 'geo-risk',
      name: 'Geopolitical & Maritime Risk Agent',
      icon: Shield,
      color: 'from-red-600 to-rose-700',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      confidence: geoRisk.confidenceScore,
      status: 'COMPLETE',
      primaryMetric: `${geoRisk.overallRiskScore}/100`,
      primaryLabel: 'Threat Score',
      secondaryMetric: `${geoRisk.threatLevel}`,
      secondaryLabel: 'Alert Level',
      summary: geoRisk.reroutingSummary,
      reasoning: geoRisk.reasoning
    },
    {
      id: 'disruption-impact',
      name: 'Disruption & Price Shock Agent',
      icon: Activity,
      color: 'from-amber-600 to-orange-700',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      confidence: disruptionImpact.confidenceScore,
      status: 'COMPLETE',
      primaryMetric: `${(disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(1)}M`,
      primaryLabel: 'Daily Deficit (bpd)',
      secondaryMetric: `+${disruptionImpact.priceShocks[0]?.changePercent}%`,
      secondaryLabel: 'Brent Peak',
      summary: `${disruptionImpact.affectedRefineries.length} refining clusters impacted; ${disruptionImpact.globalSupplyDeficitPercent}% global supply deficit.`,
      reasoning: disruptionImpact.reasoning
    },
    {
      id: 'procurement',
      name: 'Procurement & Routing Agent',
      icon: Truck,
      color: 'from-emerald-600 to-teal-700',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      confidence: procurement.confidenceScore,
      status: 'COMPLETE',
      primaryMetric: `${procurement.supplyReplacementCoveragePercent}%`,
      primaryLabel: 'Replacement Coverage',
      secondaryMetric: `+$${procurement.averageLandedCostIncrease}/bbl`,
      secondaryLabel: 'Avg Landed Delta',
      summary: `Top allocation: ${procurement.recommendedAllocations[0]?.supplier || 'US Gulf Coast'} (${procurement.recommendedAllocations[0]?.volumeBpd.toLocaleString()} bpd).`,
      reasoning: procurement.reasoning
    },
    {
      id: 'reserves',
      name: 'Strategic Reserves (SPR) Agent',
      icon: Database,
      color: 'from-blue-600 to-indigo-700',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      confidence: reserves.confidenceScore,
      status: 'COMPLETE',
      primaryMetric: `${reserves.postDisruptionBufferDays} Days`,
      primaryLabel: 'Buffer Cover',
      secondaryMetric: `${reserves.recommendedDrawdownRateMbblDay}M`,
      secondaryLabel: 'Release Rate (bpd)',
      summary: `${reserves.emergencyReleaseRecommended ? 'Emergency drawdown authorized' : 'Routine inventory monitoring'} at ${reserves.recommendedDrawdownRateMbblDay} MMbbl/d.`,
      reasoning: reserves.reasoning
    },
    {
      id: 'digital-twin',
      name: 'Digital Twin & Bottleneck Agent',
      icon: Share2,
      color: 'from-purple-600 to-fuchsia-700',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      confidence: digitalTwin.confidenceScore,
      status: 'COMPLETE',
      primaryMetric: `${digitalTwin.networkResilienceIndex}/100`,
      primaryLabel: 'Resilience Index',
      secondaryMetric: `${digitalTwin.bottleneckPaths.length}`,
      secondaryLabel: 'Bottlenecks',
      summary: `Detected ${digitalTwin.bottleneckPaths.length} stressed corridors; orchestrated ${digitalTwin.recommendedFlowAdjustments.length} automated flow adjustments.`,
      reasoning: digitalTwin.reasoning
    }
  ];

  const filteredLogs = thoughtLogs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#111827] border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Parallel Autonomous Multi-Agent Orchestrator
          </h2>
          <p className="text-xs text-slate-400">
            5 specialized AI models executing concurrent threat assessment, commodity pricing, and supply rerouting
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRerunAgent && (
            <button
              onClick={onRerunAgent}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold transition flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Re-run All Agents</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>ALL 5 SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* 5 Parallel Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isExpanded = expandedAgent === agent.id;

          return (
            <div
              key={agent.id}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white leading-tight">{agent.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">Agent ID: {agent.id}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${agent.badgeColor}`}>
                    {agent.confidence}% CONF
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{agent.primaryLabel}</span>
                    <span className="text-base font-extrabold text-white">{agent.primaryMetric}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{agent.secondaryLabel}</span>
                    <span className="text-base font-extrabold text-cyan-300">{agent.secondaryMetric}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {agent.summary}
                </p>

                {/* Expanded Reasoning */}
                {isExpanded && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      Detailed Model Reasoning:
                    </div>
                    {agent.reasoning.map((r, i) => (
                      <div key={i} className="text-[11px] text-slate-300 bg-slate-800/40 p-2 rounded-lg leading-snug">
                        • {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                className="mt-3 pt-2 border-t border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-between w-full transition"
              >
                <span>{isExpanded ? 'Collapse Reasoning' : 'View Chain of Thought'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Agent Stream Console */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Live Multi-Agent Event & Reasoning Stream</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[10px]">
            <Filter className="w-3 h-3 text-slate-500" />
            {(['all', 'tool_call', 'thought', 'recommendation'] as const).map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-2 py-0.5 rounded uppercase font-bold border transition ${
                  logFilter === f
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 text-xs pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 text-xs italic py-4 text-center">
              Agent execution log buffer initialized. Trigger a scenario or ask AI Copilot to watch live reasoning.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-900/60 transition"
              >
                <span className="text-slate-500 text-[10px] whitespace-nowrap pt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase whitespace-nowrap ${
                    log.type === 'tool_call' ? 'bg-cyan-500/20 text-cyan-300' :
                    log.type === 'tool_result' ? 'bg-emerald-500/20 text-emerald-300' :
                    log.type === 'recommendation' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-slate-400 text-[11px] font-semibold text-blue-300">
                  [{log.agentName}]:
                </span>
                <span className="text-slate-200 text-[11px] leading-relaxed">
                  {log.content}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
