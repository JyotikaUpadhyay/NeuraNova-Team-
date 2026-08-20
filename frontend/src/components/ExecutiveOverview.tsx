import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Fuel,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Zap
} from 'lucide-react';
import { AggregatedScenarioResult } from '../types/index.js';

interface ExecutiveOverviewProps {
  result: AggregatedScenarioResult | null;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ result, onNavigateTab }) => {
  if (!result) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
        <span>Loading real-time resilience metrics...</span>
      </div>
    );
  }

  const { geoRisk, disruptionImpact, reserves, procurement, executiveSummary, keyActionItems } = result;
  const primaryPriceShock = disruptionImpact.priceShocks[0];

  return (
    <div className="space-y-6">
      {/* Active Crisis Alert Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-500/30 p-6 shadow-2xl">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Active Threat: {geoRisk.threatLevel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Evaluated in {(result.executionDurationMs / 1000).toFixed(2)}s
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {result.scenarioName}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {executiveSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('copilot')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Ask AI Copilot
            </button>
            <button
              onClick={() => onNavigateTab('simulator')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              Switch Scenario
            </button>
          </div>
        </div>
      </div>

      {/* 4 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global Threat Score */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Threat Index</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {geoRisk.overallRiskScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vessel Congestion {geoRisk.vesselCongestionIndex}%</span>
          </div>
          {/* Risk progress bar */}
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                geoRisk.overallRiskScore > 75
                  ? 'bg-red-500'
                  : geoRisk.overallRiskScore > 50
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${geoRisk.overallRiskScore}%` }}
            />
          </div>
        </div>

        {/* Supply Deficit (bpd) */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Supply Deficit</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {(disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(1)}M
            </span>
            <span className="text-xs text-slate-400">bpd</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
            <span>{disruptionImpact.globalSupplyDeficitPercent}% global oil supply</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, disruptionImpact.globalSupplyDeficitPercent * 5)}%` }}
            />
          </div>
        </div>

        {/* Peak Brent Price Shock */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Peak Brent Shock</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              ${primaryPriceShock?.projectedPeak != null ? primaryPriceShock.projectedPeak.toFixed(2) : '82.50'}
            </span>
            <span className="text-xs text-slate-400">/ bbl</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{primaryPriceShock?.changePercent ?? 0}% from ${primaryPriceShock?.currentPrice != null ? primaryPriceShock.currentPrice.toFixed(2) : '82.50'}</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            Range: ${primaryPriceShock?.confidenceInterval?.[0] ?? 75} - ${primaryPriceShock?.confidenceInterval?.[1] ?? 95}
          </div>
        </div>

        {/* SPR Cushion (Days of Cover) */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">SPR Buffer Cover</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {reserves.postDisruptionBufferDays}
            </span>
            <span className="text-xs text-slate-400">Days</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400">
            <span>Rate: {reserves.recommendedDrawdownRateMbblDay} MMbbl/d release</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (reserves.postDisruptionBufferDays / 300) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Items & Price Shock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Action Checklist */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Cross-Agent Action Plan</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {procurement.supplyReplacementCoveragePercent}% Replacement Found
            </span>
          </div>
          
          <div className="space-y-3">
            {keyActionItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 transition text-sm text-slate-200"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Futures Shock Board */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Futures Volatility</h3>
            <span className="text-xs text-slate-400 font-mono">ICE / CME</span>
          </div>

          <div className="space-y-3">
            {disruptionImpact.priceShocks.map((shock) => (
              <div
                key={shock.benchmark}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 font-mono">{shock.benchmark}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Spot: ${shock.currentPrice != null ? shock.currentPrice.toFixed(2) : '82.50'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-white font-mono">
                    ${shock.projectedPeak != null ? shock.projectedPeak.toFixed(2) : '82.50'}
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{shock.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
