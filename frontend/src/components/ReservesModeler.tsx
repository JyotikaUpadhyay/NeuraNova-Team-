import React, { useState } from 'react';
import {
  Database,
  Sliders,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Download,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ReservesOutput } from '../types/index.js';

interface ReservesModelerProps {
  reserves: ReservesOutput | null;
}

interface TrajectoryPoint {
  day: string;
  dayNum: number;
  stockMbbl: number;
  daysCover: number;
}

export const ReservesModeler: React.FC<ReservesModelerProps> = ({ reserves }) => {
  if (!reserves) {
    return <div className="p-8 text-center text-slate-400">Loading SPR models...</div>;
  }

  const [simulatedRate, setSimulatedRate] = useState(reserves.recommendedDrawdownRateMbblDay);
  const [isEmergencyAuthorized, setIsEmergencyAuthorized] = useState(reserves.emergencyReleaseRecommended);

  // Compute dynamic trajectory based on the user's interactive slider
  const dynamicTrajectory: TrajectoryPoint[] = [];
  let currentStock = reserves.currentSprStockpileMbbl;
  for (let day = 0; day <= 90; day += 5) {
    if (day > 0) {
      currentStock = Math.max(80, currentStock - (isEmergencyAuthorized ? simulatedRate : 0.5) * 5);
    }
    const daysCover = Math.round((currentStock / 20.2) * 30);
    dynamicTrajectory.push({
      day: `Day ${day}`,
      dayNum: day,
      stockMbbl: Number(currentStock.toFixed(1)),
      daysCover
    });
  }

  const exportTrajectoryCsv = () => {
    let csv = "Day,Remaining_SPR_MMbbl,Buffer_Days_Cover\n";
    dynamicTrajectory.forEach(t => {
      csv += `${t.dayNum},${t.stockMbbl},${t.daysCover}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPR_Drawdown_Trajectory_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Strategic Petroleum Reserve (SPR) Depletion & Drawdown Modeler
          </h2>
          <p className="text-xs text-slate-400">
            IEA treaty compliance, salt dome pump-out trajectories, and market stabilization refill triggers
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Current SPR Inventory</span>
            <span className="font-extrabold text-blue-400">{reserves.currentSprStockpileMbbl} MMbbl</span>
          </div>
          <button
            onClick={() => setIsEmergencyAuthorized(!isEmergencyAuthorized)}
            className={`p-2.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
              isEmergencyAuthorized
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{isEmergencyAuthorized ? 'EMERGENCY DRAWDOWN ON' : 'STANDBY MODE'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Drawdown Slider Control */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Simulated Daily Release Rate: <span className="text-cyan-300 text-sm font-extrabold">{simulatedRate.toFixed(2)} MMbbl / day</span>
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Physical Max: 2.50 MMbbl/d</span>
            <button
              onClick={exportTrajectoryCsv}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0.2"
          max="2.5"
          step="0.1"
          value={simulatedRate}
          onChange={(e) => setSimulatedRate(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Day 30 Remaining</span>
            <span className="text-base font-extrabold text-white">
              {dynamicTrajectory[6]?.stockMbbl} MMbbl
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Day 60 Remaining</span>
            <span className="text-base font-extrabold text-white">
              {dynamicTrajectory[12]?.stockMbbl} MMbbl
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Day 90 Cover Cushion</span>
            <span className="text-base font-extrabold text-blue-400">
              {dynamicTrajectory[18]?.daysCover} Days
            </span>
          </div>
        </div>
      </div>

      {/* 90-Day Depletion Trajectory Chart */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-blue-400" />
          90-Day SPR Depletion Curve (Million Barrels)
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicTrajectory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="sprGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[80, 400]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="stockMbbl"
                name="Remaining SPR (MMbbl)"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#sprGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Replenishment Policy & Caverns Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Replenishment Alert */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Automatic Stockpile Replenishment Policy
          </h3>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs space-y-2">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-300">Prompt Buy Trigger:</span>
              <span className="text-cyan-300 font-extrabold">${reserves.replenishmentTriggers.triggerPriceUsd.toFixed(2)}/bbl</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-300">Target Infill Rate:</span>
              <span className="text-cyan-300 font-extrabold">{reserves.replenishmentTriggers.recommendedRefillRateMbblDay} MMbbl/d</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
              {reserves.replenishmentTriggers.notes}
            </p>
          </div>
        </div>

        {/* Cavern Facility Status */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-400" />
            Active US Salt Dome Caverns
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Bryan Mound Salt Dome (TX)', capacity: '135 / 247 MMbbl', rate: '1.5 MMbbl/d max' },
              { name: 'Big Hill Facility (TX)', capacity: '95 / 170 MMbbl', rate: '1.1 MMbbl/d max' },
              { name: 'West Hackberry Dome (LA)', capacity: '105 / 220 MMbbl', rate: '1.3 MMbbl/d max' },
              { name: 'Bayou Choctaw Caverns (LA)', capacity: '40 / 76 MMbbl', rate: '0.5 MMbbl/d max' }
            ].map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-bold">{c.name}</span>
                <span className="text-blue-400 font-bold">{c.capacity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
