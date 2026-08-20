import React from 'react';
import {
  Share2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { BottleneckPath, NetworkFlowAdjustment, NetworkNode } from '../types/index.js';

interface NetworkGraphViewProps {
  nodes: NetworkNode[];
  bottlenecks: BottleneckPath[];
  adjustments: NetworkFlowAdjustment[];
  vulnerabilityScore: number;
  resilienceIndex: number;
}

export const NetworkGraphView: React.FC<NetworkGraphViewProps> = ({
  nodes,
  bottlenecks,
  adjustments,
  vulnerabilityScore,
  resilienceIndex
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Supply Chain Digital Twin & Topological Graph
          </h2>
          <p className="text-xs text-slate-400">
            Nodal flow capacity utilization, bottleneck paths, and automated rerouting adjustments
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Vulnerability Index</span>
            <span className="font-extrabold text-amber-400">{vulnerabilityScore}/100</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Network Resilience</span>
            <span className="font-extrabold text-purple-400">{resilienceIndex}/100</span>
          </div>
        </div>
      </div>

      {/* Topological Flow Stages */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-purple-400" />
          End-to-End Nodal Flow Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Stage 1: Extraction Fields */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">1. Extraction Fields</div>
            {nodes.filter(n => n.type === 'FIELD').map(n => (
              <div key={n.id} className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="font-bold text-white text-[11px]">{n.name}</div>
                <div className="text-[10px] text-slate-400">Flow: {(n.currentThroughputBpd / 1_000_000).toFixed(1)}M / {(n.capacityBpd / 1_000_000).toFixed(1)}M bpd</div>
                <div className="w-full bg-slate-700 h-1 rounded mt-1 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${n.utilizationPercent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stage 2: Export Terminals */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">2. Export Terminals</div>
            {nodes.filter(n => n.type === 'TERMINAL').map(n => (
              <div key={n.id} className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="font-bold text-white text-[11px]">{n.name}</div>
                <div className="text-[10px] text-slate-400">Throughput: {(n.currentThroughputBpd / 1_000_000).toFixed(1)}M bpd</div>
                <div className="w-full bg-slate-700 h-1 rounded mt-1 overflow-hidden">
                  <div className={`h-full ${n.status === 'COMPROMISED' ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${n.utilizationPercent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stage 3: Refineries */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">3. Refining Clusters</div>
            {nodes.filter(n => n.type === 'REFINERY').map(n => (
              <div key={n.id} className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="font-bold text-white text-[11px]">{n.name}</div>
                <div className="text-[10px] text-slate-400">Capacity: {(n.capacityBpd / 1_000_000).toFixed(1)}M bpd</div>
                <div className="w-full bg-slate-700 h-1 rounded mt-1 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${n.utilizationPercent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stage 4: Consumer Hubs */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">4. Demand Centers</div>
            {nodes.filter(n => n.type === 'CONSUMER_HUB').map(n => (
              <div key={n.id} className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="font-bold text-white text-[11px]">{n.name}</div>
                <div className="text-[10px] text-slate-400">Demand: {(n.currentThroughputBpd / 1_000_000).toFixed(1)}M bpd</div>
                <div className="w-full bg-slate-700 h-1 rounded mt-1 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${n.utilizationPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottlenecks & Flow Adjustments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Critical Bottleneck Corridors */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detected Critical Bottlenecks
          </h3>

          <div className="space-y-2 text-xs">
            {bottlenecks.map((bp) => (
              <div
                key={bp.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{bp.chokepoint}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                      bp.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      bp.status === 'STRESSED' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {bp.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <span>{bp.source}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{bp.destination}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>Capacity Load: {bp.capacityUtilizationPercent}%</span>
                  <span>Risk Weight: {(bp.riskWeight * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Flow Adjustments */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            Dynamic Network Flow Adjustments
          </h3>

          <div className="space-y-2 text-xs">
            {adjustments.map((adj) => (
              <div
                key={adj.routeId}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold">
                    {adj.action}
                  </span>
                  <span className="font-mono text-cyan-300 font-bold text-[11px]">
                    {adj.divertedVolumeBpd.toLocaleString()} bpd
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug pt-1">
                  {adj.details}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  {adj.from} ➔ {adj.to}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
