import React, { useState } from 'react';
import {
  Truck,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  Anchor,
  Sparkles,
  Calculator,
  ArrowUpDown,
  Ship
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ProcurementOutput, SupplierAlternative } from '../types/index.js';

interface ProcurementMatrixProps {
  procurement: ProcurementOutput | null;
}

export const ProcurementMatrix: React.FC<ProcurementMatrixProps> = ({ procurement }) => {
  if (!procurement) {
    return <div className="p-8 text-center text-slate-400">Loading procurement intelligence...</div>;
  }

  const { rankedAlternatives, recommendedAllocations, averageLandedCostIncrease, supplyReplacementCoveragePercent, reasoning } = procurement;

  const [calcVolumeBpd, setCalcVolumeBpd] = useState<number>(500000);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(rankedAlternatives[0]?.id || 'us_gulf_wti');
  const [sortBy, setSortBy] = useState<'cost' | 'time' | 'feasibility' | 'capacity'>('cost');

  const selectedSupplier = rankedAlternatives.find(s => s.id === selectedSupplierId) || rankedAlternatives[0];

  // Sourcing calculation
  const totalCostPerDay = (calcVolumeBpd * (selectedSupplier?.totalLandedCostPerBbl || 84.50));
  const vlccVoyagesPerMonth = Math.ceil((calcVolumeBpd * 30) / 2000000); // VLCC ~ 2M bbl

  // Sorted list
  const sortedAlternatives = [...rankedAlternatives].sort((a, b) => {
    if (sortBy === 'cost') return a.totalLandedCostPerBbl - b.totalLandedCostPerBbl;
    if (sortBy === 'time') return a.leadTimeDays - b.leadTimeDays;
    if (sortBy === 'feasibility') return b.feasibilityScore - a.feasibilityScore;
    if (sortBy === 'capacity') return b.availableCapacityBpd - a.availableCapacityBpd;
    return 0;
  });

  const chartData = sortedAlternatives.map((alt) => ({
    name: alt.supplier.split(' ')[0],
    landedCost: alt.totalLandedCostPerBbl,
    capacityMbpd: Number((alt.availableCapacityBpd / 1_000_000).toFixed(2)),
    leadTime: alt.leadTimeDays
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Strategic Procurement & Alternative Supply Optimization
          </h2>
          <p className="text-xs text-slate-400">
            Autonomous supplier discovery, freight differential modeling, and contract volume allocation
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Avg Landed Cost Δ</span>
            <span className="font-extrabold text-emerald-400">+${averageLandedCostIncrease}/bbl</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Supply Replacement</span>
            <span className="font-extrabold text-cyan-300">{supplyReplacementCoveragePercent}% Covered</span>
          </div>
        </div>
      </div>

      {/* Interactive Sourcing Calculator & Sizing */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Interactive Spot Sourcing Calculator
            </h3>
            <p className="text-xs text-slate-400">Model total cash outflow and VLCC tanker fleet requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-400 text-[10px]">Select Alternative Supplier:</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              {rankedAlternatives.map(s => (
                <option key={s.id} value={s.id}>
                  {s.supplier} (${s.totalLandedCostPerBbl}/bbl)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-[10px]">Desired Volume: {calcVolumeBpd.toLocaleString()} bpd</label>
            <input
              type="range"
              min="100000"
              max="2500000"
              step="50000"
              value={calcVolumeBpd}
              onChange={(e) => setCalcVolumeBpd(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Total Landed / Day:</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                ${(totalCostPerDay / 1_000_000).toFixed(2)}M / day
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-slate-400">Fleet Requirement:</span>
              <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1">
                <Ship className="w-3.5 h-3.5" />
                {vlccVoyagesPerMonth} VLCCs / month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart: Landed Cost vs Availability */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Alternative Sourcing Landed Cost Benchmark ($/bbl)
          </h3>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[10px]">Sort:</span>
            <button
              onClick={() => setSortBy('cost')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${sortBy === 'cost' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Cost
            </button>
            <button
              onClick={() => setSortBy('time')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${sortBy === 'time' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Lead Time
            </button>
            <button
              onClick={() => setSortBy('feasibility')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${sortBy === 'feasibility' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Feasibility
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[70, 95]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Bar dataKey="landedCost" name="Landed Cost ($/bbl)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alternative Suppliers Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Ranked Alternative Crude Suppliers
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">{sortedAlternatives.length} Sources Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Supplier / Hub</th>
                <th className="px-4 py-3">Origin Port</th>
                <th className="px-4 py-3">Crude Grade</th>
                <th className="px-4 py-3">Available Volume</th>
                <th className="px-4 py-3">Lead Time</th>
                <th className="px-4 py-3">Freight Δ</th>
                <th className="px-4 py-3">Landed Cost</th>
                <th className="px-4 py-3">Feasibility</th>
                <th className="px-4 py-3">Contract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {sortedAlternatives.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-blue-400" />
                    <span>{alt.supplier}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{alt.originPort}</td>
                  <td className="px-4 py-3 text-slate-400">{alt.crudeGrade}</td>
                  <td className="px-4 py-3 font-bold text-cyan-300">
                    {(alt.availableCapacityBpd / 1_000_000).toFixed(2)}M bpd
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {alt.leadTimeDays}d ({alt.deltaLeadTimeDays >= 0 ? `+${alt.deltaLeadTimeDays}d` : `${alt.deltaLeadTimeDays}d`})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-amber-400">+${alt.freightCostDeltaPerBbl.toFixed(2)}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-400">${alt.totalLandedCostPerBbl.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {alt.feasibilityScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {alt.contractFlexibility}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Allocations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Optimized Spot Allocation Strategy
          </h3>
          <div className="space-y-2">
            {recommendedAllocations.map((alloc) => (
              <div
                key={alloc.priority}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono flex-shrink-0">
                  #{alloc.priority}
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{alloc.supplier}</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {alloc.volumeBpd.toLocaleString()} bpd
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug">{alloc.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Insights */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Procurement Agent Model Rationale
          </h3>
          <div className="space-y-2">
            {reasoning.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                • {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
