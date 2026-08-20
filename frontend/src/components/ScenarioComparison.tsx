import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Play,
  BarChart3,
  TrendingUp,
  Shield,
  Truck,
  Database,
  Share2,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ArrowLeftRight,
  Download,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { AggregatedScenarioResult, Scenario } from '../types/index.js';
import { api } from '../services/api.js';

interface ScenarioComparisonProps {
  currentResult: AggregatedScenarioResult | null;
  scenarios: Scenario[];
  onNavigateTab?: (tab: string) => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  currentResult,
  scenarios,
  onNavigateTab
}) => {
  // Scenario IDs for comparison
  const [scenarioAId, setScenarioAId] = useState<string>('');
  const [scenarioBId, setScenarioBId] = useState<string>('');

  // Results for A and B
  const [resultA, setResultA] = useState<AggregatedScenarioResult | null>(null);
  const [resultB, setResultB] = useState<AggregatedScenarioResult | null>(null);

  // Result cache to avoid redundant API calls
  const [resultCache, setResultCache] = useState<Record<string, AggregatedScenarioResult>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize cache when currentResult changes
  useEffect(() => {
    if (currentResult) {
      setResultCache(prev => ({
        ...prev,
        [currentResult.scenarioId]: currentResult
      }));
    }
  }, [currentResult]);

  // Initialize Scenario A and Scenario B selectors
  useEffect(() => {
    if (scenarios.length === 0) return;

    // Set initial Scenario A
    if (!scenarioAId) {
      const initialA = currentResult?.scenarioId || scenarios[0]?.id || '';
      setScenarioAId(initialA);
      if (currentResult && currentResult.scenarioId === initialA) {
        setResultA(currentResult);
      }
    }

    // Set initial Scenario B (different from A)
    if (!scenarioBId) {
      const initialA = scenarioAId || currentResult?.scenarioId || scenarios[0]?.id;
      const initialB = scenarios.find(s => s.id !== initialA)?.id || scenarios[1]?.id || '';
      setScenarioBId(initialB);
    }
  }, [scenarios, currentResult, scenarioAId, scenarioBId]);

  // Keep resultA in sync if currentResult changes and matches scenarioAId
  useEffect(() => {
    if (currentResult && currentResult.scenarioId === scenarioAId) {
      setResultA(currentResult);
    }
  }, [currentResult, scenarioAId]);

  // Run or fetch comparison for both A and B
  const handleRunComparison = async (overrideAId?: string, overrideBId?: string) => {
    const targetAId = overrideAId || scenarioAId;
    const targetBId = overrideBId || scenarioBId;

    if (!targetAId || !targetBId) {
      setError('Please select both Scenario A and Scenario B.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let resA = resultCache[targetAId] || (currentResult?.scenarioId === targetAId ? currentResult : null);
      let resB = resultCache[targetBId] || (currentResult?.scenarioId === targetBId ? currentResult : null);

      const promises: Promise<void>[] = [];

      if (!resA) {
        promises.push(
          api.runScenario(targetAId).then(data => {
            resA = data;
          })
        );
      }

      if (!resB) {
        promises.push(
          api.runScenario(targetBId).then(data => {
            resB = data;
          })
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      if (resA) {
        setResultA(resA);
        setResultCache(prev => ({ ...prev, [targetAId]: resA! }));
      }
      if (resB) {
        setResultB(resB);
        setResultCache(prev => ({ ...prev, [targetBId]: resB! }));
      }
    } catch (err: any) {
      setError(`Failed to execute comparison: ${err.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Swap Scenarios A and B
  const handleSwap = () => {
    const tempId = scenarioAId;
    const tempRes = resultA;
    setScenarioAId(scenarioBId);
    setResultA(resultB);
    setScenarioBId(tempId);
    setResultB(tempRes);
  };

  // Quick Presets
  const handleSelectPreset = (aId: string, bId: string) => {
    setScenarioAId(aId);
    setScenarioBId(bId);
    handleRunComparison(aId, bId);
  };

  // Export comparison as CSV
  const handleExportCsv = () => {
    if (!resultA || !resultB) return;

    const rows = [
      ['Metric', `${resultA.scenarioName} (A)`, `${resultB.scenarioName} (B)`, 'Delta (B - A)'],
      ['Threat Level', resultA.geoRisk.threatLevel, resultB.geoRisk.threatLevel, 'N/A'],
      ['Global Risk Score', `${resultA.geoRisk.overallRiskScore}/100`, `${resultB.geoRisk.overallRiskScore}/100`, (resultB.geoRisk.overallRiskScore - resultA.geoRisk.overallRiskScore).toString()],
      ['Daily Crude Deficit (M bpd)', (resultA.disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(2), (resultB.disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(2), ((resultB.disruptionImpact.crudeDeficitBpd - resultA.disruptionImpact.crudeDeficitBpd) / 1_000_000).toFixed(2)],
      ['Global Supply Deficit %', `${resultA.disruptionImpact.globalSupplyDeficitPercent}%`, `${resultB.disruptionImpact.globalSupplyDeficitPercent}%`, (resultB.disruptionImpact.globalSupplyDeficitPercent - resultA.disruptionImpact.globalSupplyDeficitPercent).toFixed(1)],
      ['Projected Peak Brent ($/bbl)', `$${resultA.disruptionImpact.priceShocks?.[0]?.projectedPeak != null ? resultA.disruptionImpact.priceShocks[0].projectedPeak.toFixed(2) : '82.50'}`, `$${resultB.disruptionImpact.priceShocks?.[0]?.projectedPeak != null ? resultB.disruptionImpact.priceShocks[0].projectedPeak.toFixed(2) : '82.50'}`, ((resultB.disruptionImpact.priceShocks?.[0]?.projectedPeak || 82.5) - (resultA.disruptionImpact.priceShocks?.[0]?.projectedPeak || 82.5)).toFixed(2)],
      ['SPR Post-Disruption Buffer (Days)', resultA.reserves.postDisruptionBufferDays.toString(), resultB.reserves.postDisruptionBufferDays.toString(), (resultB.reserves.postDisruptionBufferDays - resultA.reserves.postDisruptionBufferDays).toString()],
      ['SPR Drawdown Rate (MMbbl/d)', resultA.reserves.recommendedDrawdownRateMbblDay.toString(), resultB.reserves.recommendedDrawdownRateMbblDay.toString(), (resultB.reserves.recommendedDrawdownRateMbblDay - resultA.reserves.recommendedDrawdownRateMbblDay).toFixed(2)],
      ['Supply Replacement Coverage %', `${resultA.procurement.supplyReplacementCoveragePercent}%`, `${resultB.procurement.supplyReplacementCoveragePercent}%`, (resultB.procurement.supplyReplacementCoveragePercent - resultA.procurement.supplyReplacementCoveragePercent).toFixed(1)],
      ['Digital Twin Resilience Index', `${resultA.digitalTwin.networkResilienceIndex}/100`, `${resultB.digitalTwin.networkResilienceIndex}/100`, (resultB.digitalTwin.networkResilienceIndex - resultA.digitalTwin.networkResilienceIndex).toString()],
      ['Vessel Congestion Index %', `${resultA.geoRisk.vesselCongestionIndex}%`, `${resultB.geoRisk.vesselCongestionIndex}%`, (resultB.geoRisk.vesselCongestionIndex - resultA.geoRisk.vesselCongestionIndex).toString()]
    ];

    const csvContent = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Scenario_Comparison_${resultA.scenarioId}_vs_${resultB.scenarioId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Build radar data safely
  const buildRadarData = (a: AggregatedScenarioResult | null, b: AggregatedScenarioResult | null) => {
    return [
      {
        metric: 'Risk Score',
        A: a?.geoRisk?.overallRiskScore ?? 0,
        B: b?.geoRisk?.overallRiskScore ?? 0,
        fullMark: 100
      },
      {
        metric: 'Price Shock',
        A: Math.max(0, Math.min(100, (a?.disruptionImpact?.priceShocks?.[0]?.changePercent ?? 0) * 1.5)),
        B: Math.max(0, Math.min(100, (b?.disruptionImpact?.priceShocks?.[0]?.changePercent ?? 0) * 1.5)),
        fullMark: 100
      },
      {
        metric: 'Supply Deficit',
        A: Math.max(0, Math.min(100, (a?.disruptionImpact?.globalSupplyDeficitPercent ?? 0) * 5)),
        B: Math.max(0, Math.min(100, (b?.disruptionImpact?.globalSupplyDeficitPercent ?? 0) * 5)),
        fullMark: 100
      },
      {
        metric: 'SPR Cover',
        A: Math.max(0, Math.min(100, ((a?.reserves?.postDisruptionBufferDays ?? 0) / 250) * 100)),
        B: Math.max(0, Math.min(100, ((b?.reserves?.postDisruptionBufferDays ?? 0) / 250) * 100)),
        fullMark: 100
      },
      {
        metric: 'Resilience',
        A: a?.digitalTwin?.networkResilienceIndex ?? 0,
        B: b?.digitalTwin?.networkResilienceIndex ?? 0,
        fullMark: 100
      },
      {
        metric: 'Replacement',
        A: Math.min(100, a?.procurement?.supplyReplacementCoveragePercent ?? 0),
        B: Math.min(100, b?.procurement?.supplyReplacementCoveragePercent ?? 0),
        fullMark: 100
      }
    ];
  };

  // Build bar chart data safely
  const buildBarData = (a: AggregatedScenarioResult | null, b: AggregatedScenarioResult | null) => {
    return [
      {
        metric: 'Risk Score',
        valA: a?.geoRisk?.overallRiskScore ?? 0,
        valB: b?.geoRisk?.overallRiskScore ?? 0
      },
      {
        metric: 'Deficit Impact %',
        valA: a?.disruptionImpact?.globalSupplyDeficitPercent ?? 0,
        valB: b?.disruptionImpact?.globalSupplyDeficitPercent ?? 0
      },
      {
        metric: 'SPR Days (÷3)',
        valA: Math.round((a?.reserves?.postDisruptionBufferDays ?? 0) / 3),
        valB: Math.round((b?.reserves?.postDisruptionBufferDays ?? 0) / 3)
      },
      {
        metric: 'Resilience Index',
        valA: a?.digitalTwin?.networkResilienceIndex ?? 0,
        valB: b?.digitalTwin?.networkResilienceIndex ?? 0
      },
      {
        metric: 'Replacement %',
        valA: a?.procurement?.supplyReplacementCoveragePercent ?? 0,
        valB: b?.procurement?.supplyReplacementCoveragePercent ?? 0
      }
    ];
  };

  const radarData = buildRadarData(resultA, resultB);
  const barData = buildBarData(resultA, resultB);

  const renderDelta = (a: number, b: number, inverseIsBetter = false, unit = '') => {
    const diff = b - a;
    const isNeutral = Math.abs(diff) < 0.01;
    if (isNeutral) {
      return <span className="flex items-center gap-0.5 text-slate-400 font-mono text-xs"><Minus className="w-3.5 h-3.5" /> 0.0</span>;
    }
    const worse = inverseIsBetter ? diff > 0 : diff < 0;
    return (
      <span className={`flex items-center gap-0.5 font-mono text-xs font-bold ${worse ? 'text-red-400' : 'text-emerald-400'}`}>
        {diff > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}{unit}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            Side-by-Side Energy Crisis Comparison Engine
          </h2>
          <p className="text-xs text-slate-400">
            Compare risk indices, supply deficits, SPR cushion, and multi-agent mitigation strategies across any two scenarios
          </p>
        </div>

        <div className="flex items-center gap-2">
          {resultA && resultB && (
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export CSV</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab?.('simulator')}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Crisis Simulator</span>
          </button>
        </div>
      </div>

      {/* Comparison Configuration Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Configure Scenario Parameters
          </h3>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[10px]">Presets:</span>
            <button
              onClick={() => handleSelectPreset('hormuz_closed', 'red_sea_crisis')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-[10px] transition"
            >
              Hormuz vs Red Sea
            </button>
            <button
              onClick={() => handleSelectPreset('hormuz_closed', 'colonial_cyberattack')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-[10px] transition"
            >
              Hormuz vs Cyber
            </button>
            <button
              onClick={() => handleSelectPreset('red_sea_crisis', 'panama_canal_drought')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-[10px] transition"
            >
              Red Sea vs Panama
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Scenario A Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-[10px] text-blue-400 uppercase font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Scenario A (Base Model)
            </label>
            <select
              value={scenarioAId}
              onChange={(e) => {
                const val = e.target.value;
                setScenarioAId(val);
                if (resultCache[val]) setResultA(resultCache[val]);
              }}
              className="w-full bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Select Scenario A --</option>
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.severity})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-0.5">
            <button
              onClick={handleSwap}
              title="Swap Scenario A and B"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scenario B Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-[10px] text-purple-400 uppercase font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Scenario B (Comparison Model)
            </label>
            <select
              value={scenarioBId}
              onChange={(e) => {
                const val = e.target.value;
                setScenarioBId(val);
                if (resultCache[val]) setResultB(resultCache[val]);
              }}
              className="w-full bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">-- Select Scenario B --</option>
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.severity})
                </option>
              ))}
            </select>
          </div>

          {/* Execute Comparison Button */}
          <div className="md:col-span-2">
            <button
              onClick={() => handleRunComparison()}
              disabled={!scenarioAId || !scenarioBId || isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold transition disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Run Compare</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {resultA && resultB ? (
        <>
          {/* Key KPI Comparison Table */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Comprehensive Cross-Agent Metric Matrix
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Evaluated across 5 parallel AI agents
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left font-mono">
                <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Metric Category</th>
                    <th className="px-4 py-3">
                      <span className="text-blue-400 font-bold">{resultA.scenarioName}</span>
                      <span className="text-slate-500 ml-1">(A)</span>
                    </th>
                    <th className="px-4 py-3">
                      <span className="text-purple-400 font-bold">{resultB.scenarioName}</span>
                      <span className="text-slate-500 ml-1">(B)</span>
                    </th>
                    <th className="px-4 py-3">Differential (B − A)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {[
                    {
                      label: 'Threat Severity Level',
                      icon: <Shield className="w-3.5 h-3.5 text-red-400" />,
                      valA: resultA.geoRisk.threatLevel,
                      valB: resultB.geoRisk.threatLevel,
                      numA: resultA.geoRisk.overallRiskScore,
                      numB: resultB.geoRisk.overallRiskScore,
                      inverseIsBetter: true
                    },
                    {
                      label: 'Systemic Risk Score',
                      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
                      valA: `${resultA.geoRisk.overallRiskScore}/100`,
                      valB: `${resultB.geoRisk.overallRiskScore}/100`,
                      numA: resultA.geoRisk.overallRiskScore,
                      numB: resultB.geoRisk.overallRiskScore,
                      inverseIsBetter: true
                    },
                    {
                      label: 'Maritime Vessel Congestion',
                      icon: <TrendingUp className="w-3.5 h-3.5 text-orange-400" />,
                      valA: `${resultA.geoRisk.vesselCongestionIndex}%`,
                      valB: `${resultB.geoRisk.vesselCongestionIndex}%`,
                      numA: resultA.geoRisk.vesselCongestionIndex,
                      numB: resultB.geoRisk.vesselCongestionIndex,
                      inverseIsBetter: true,
                      unit: '%'
                    },
                    {
                      label: 'Daily Crude Deficit',
                      icon: <TrendingUp className="w-3.5 h-3.5 text-red-400" />,
                      valA: `${(resultA.disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(1)}M bpd`,
                      valB: `${(resultB.disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(1)}M bpd`,
                      numA: resultA.disruptionImpact.crudeDeficitBpd / 1_000_000,
                      numB: resultB.disruptionImpact.crudeDeficitBpd / 1_000_000,
                      inverseIsBetter: true,
                      unit: 'M bpd'
                    },
                    {
                      label: 'Global Supply Deficit %',
                      icon: <TrendingUp className="w-3.5 h-3.5 text-red-400" />,
                      valA: `${resultA.disruptionImpact.globalSupplyDeficitPercent}%`,
                      valB: `${resultB.disruptionImpact.globalSupplyDeficitPercent}%`,
                      numA: resultA.disruptionImpact.globalSupplyDeficitPercent,
                      numB: resultB.disruptionImpact.globalSupplyDeficitPercent,
                      inverseIsBetter: true,
                      unit: '%'
                    },
                    {
                      label: 'Peak Brent Price Projection',
                      icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
                      valA: `$${resultA.disruptionImpact.priceShocks?.[0]?.projectedPeak != null ? resultA.disruptionImpact.priceShocks[0].projectedPeak.toFixed(2) : '82.50'}/bbl`,
                      valB: `$${resultB.disruptionImpact.priceShocks?.[0]?.projectedPeak != null ? resultB.disruptionImpact.priceShocks[0].projectedPeak.toFixed(2) : '82.50'}/bbl`,
                      numA: resultA.disruptionImpact.priceShocks?.[0]?.projectedPeak ?? 82.50,
                      numB: resultB.disruptionImpact.priceShocks?.[0]?.projectedPeak ?? 82.50,
                      inverseIsBetter: true,
                      unit: ' $/bbl'
                    },
                    {
                      label: 'SPR Post-Disruption Buffer',
                      icon: <Database className="w-3.5 h-3.5 text-blue-400" />,
                      valA: `${resultA.reserves.postDisruptionBufferDays} days`,
                      valB: `${resultB.reserves.postDisruptionBufferDays} days`,
                      numA: resultA.reserves.postDisruptionBufferDays,
                      numB: resultB.reserves.postDisruptionBufferDays,
                      inverseIsBetter: false,
                      unit: ' days'
                    },
                    {
                      label: 'Recommended SPR Drawdown',
                      icon: <Database className="w-3.5 h-3.5 text-cyan-400" />,
                      valA: `${resultA.reserves.recommendedDrawdownRateMbblDay} MMbbl/d`,
                      valB: `${resultB.reserves.recommendedDrawdownRateMbblDay} MMbbl/d`,
                      numA: resultA.reserves.recommendedDrawdownRateMbblDay,
                      numB: resultB.reserves.recommendedDrawdownRateMbblDay,
                      inverseIsBetter: true,
                      unit: ' MMbbl/d'
                    },
                    {
                      label: 'Alternative Supply Coverage',
                      icon: <Truck className="w-3.5 h-3.5 text-emerald-400" />,
                      valA: `${resultA.procurement.supplyReplacementCoveragePercent}%`,
                      valB: `${resultB.procurement.supplyReplacementCoveragePercent}%`,
                      numA: resultA.procurement.supplyReplacementCoveragePercent,
                      numB: resultB.procurement.supplyReplacementCoveragePercent,
                      inverseIsBetter: false,
                      unit: '%'
                    },
                    {
                      label: 'Network Resilience Index',
                      icon: <Share2 className="w-3.5 h-3.5 text-purple-400" />,
                      valA: `${resultA.digitalTwin.networkResilienceIndex}/100`,
                      valB: `${resultB.digitalTwin.networkResilienceIndex}/100`,
                      numA: resultA.digitalTwin.networkResilienceIndex,
                      numB: resultB.digitalTwin.networkResilienceIndex,
                      inverseIsBetter: false
                    }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 flex items-center gap-2 font-bold text-slate-300">
                        {row.icon} {row.label}
                      </td>
                      <td className="px-4 py-3 text-blue-300 font-bold">{row.valA}</td>
                      <td className="px-4 py-3 text-purple-300 font-bold">{row.valB}</td>
                      <td className="px-4 py-3">
                        {renderDelta(row.numA, row.numB, row.inverseIsBetter, row.unit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Dimensional Radar Chart */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Multi-Dimensional Resilience Radar
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Normalized (0 - 100)</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1f2937" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar
                      name={resultA.scenarioName}
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.25}
                    />
                    <Radar
                      name={resultB.scenarioName}
                      dataKey="B"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.25}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Direct Metric Comparison Bar Chart */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Direct Metric Magnitude Comparison
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Parallel KPIs</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
                    <Bar dataKey="valA" name={resultA.scenarioName} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="valB" name={resultB.scenarioName} fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Comparative Verdict & Breakdown */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Autonomous Multi-Agent Comparative Verdict
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scenario A Card */}
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300">{resultA.scenarioName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                    Scenario A
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-900/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Risk Score</span>
                    <span className="font-bold text-white">{resultA.geoRisk.overallRiskScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Resilience</span>
                    <span className="font-bold text-white">{resultA.digitalTwin.networkResilienceIndex}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SPR Cover</span>
                    <span className="font-bold text-blue-400">{resultA.reserves.postDisruptionBufferDays}d</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {resultA.executiveSummary}
                </p>
              </div>

              {/* Scenario B Card */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">{resultB.scenarioName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                    Scenario B
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-900/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Risk Score</span>
                    <span className="font-bold text-white">{resultB.geoRisk.overallRiskScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Resilience</span>
                    <span className="font-bold text-white">{resultB.digitalTwin.networkResilienceIndex}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SPR Cover</span>
                    <span className="font-bold text-purple-400">{resultB.reserves.postDisruptionBufferDays}d</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {resultB.executiveSummary}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center shadow-xl space-y-3">
          <GitCompare className="w-12 h-12 mx-auto text-indigo-400 opacity-50" />
          <p className="text-slate-400 font-medium">
            Select Scenario A and Scenario B from the dropdowns above and click &quot;Run Compare&quot; to generate an exhaustive comparative analysis.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleRunComparison()}
              disabled={!scenarioAId || !scenarioBId || isLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running Agents...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Comparison Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

