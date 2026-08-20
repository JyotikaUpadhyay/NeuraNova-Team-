import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Play,
  Sliders,
  Flame,
  ShieldAlert,
  Clock,
  Layers,
  Check,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Scenario, ThreatLevel } from '../types/index.js';
import { api } from '../services/api.js';

interface ScenarioSimulatorProps {
  currentScenarioId?: string;
  onScenarioSelected: (scenarioId: string) => void;
  onCustomScenarioCreated?: (scenarioData: Partial<Scenario>) => void;
  isRunning: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentScenarioId,
  onScenarioSelected,
  onCustomScenarioCreated,
  isRunning
}) => {
  const [presets, setPresets] = useState<Scenario[]>([]);
  const [customName, setCustomName] = useState('Custom Supply Shock Simulation');
  const [customCategory, setCustomCategory] = useState<'GEOPOLITICAL' | 'MILITARY' | 'WEATHER' | 'CYBER'>('GEOPOLITICAL');
  const [customSeverity, setCustomSeverity] = useState<ThreatLevel>('HIGH');
  const [customDeficitMbpd, setCustomDeficitMbpd] = useState(5.0);
  const [customDurationDays, setCustomDurationDays] = useState(45);
  const [selectedChokepoints, setSelectedChokepoints] = useState<string[]>(['hormuz']);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getScenarios().then(setPresets).catch(console.error);
  }, []);

  const handleRunPreset = (id: string) => {
    setSuccessMsg(`Executing simulation for ${presets.find(p => p.id === id)?.name || id}...`);
    onScenarioSelected(id);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRunCustom = async () => {
    try {
      const customScenario: Partial<Scenario> = {
        name: customName,
        category: customCategory,
        severity: customSeverity,
        estimatedBpdDeficit: customDeficitMbpd * 1_000_000,
        projectedDurationDays: customDurationDays,
        disruptedChokepoints: selectedChokepoints,
        description: `User-configured ${customSeverity} disruption model: ${customDeficitMbpd}M bpd deficit across ${selectedChokepoints.join(', ')}.`
      };

      setSuccessMsg(`Launching Custom Multi-Agent Simulation: ${customName}...`);
      if (onCustomScenarioCreated) {
        onCustomScenarioCreated(customScenario);
      } else {
        await api.runCustomScenario(customScenario);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to run custom scenario:', err);
    }
  };

  const toggleChokepoint = (id: string) => {
    setSelectedChokepoints((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Energy Crisis & Geopolitical Stress Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Select high-impact global contingency presets or build custom multi-variable disruption models
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Preset Crisis Scenarios */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
          <Flame className="w-3.5 h-3.5 text-red-400" />
          Standard Contingency Presets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((p) => {
            const isActive = currentScenarioId === p.id;
            const severityColor =
              p.severity === 'CRITICAL' ? 'text-red-400 border-red-500/40 bg-red-500/10' :
              p.severity === 'HIGH' ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' :
              'text-blue-400 border-blue-500/40 bg-blue-500/10';

            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#141d33] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${severityColor}`}>
                      {p.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5">{p.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Supply Deficit</span>
                      <span className="font-bold text-white">{(p.estimatedBpdDeficit / 1_000_000).toFixed(1)}M bpd</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Duration</span>
                      <span className="font-bold text-cyan-300">{p.projectedDurationDays} Days</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRunPreset(p.id)}
                  disabled={isRunning}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isActive ? 'Active (Re-run)' : 'Execute Simulation'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scenario Builder */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Custom Scenario Parameter Tuner</h3>
            <p className="text-xs text-slate-400">Inject custom supply shock constraints and maritime chokepoints</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Scenario Title</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Crisis Category</label>
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="GEOPOLITICAL">Geopolitical Crisis</option>
              <option value="MILITARY">Military Conflict / Blockade</option>
              <option value="WEATHER">Severe Weather / Hurricane</option>
              <option value="CYBER">Cyberattack on Infrastructure</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Threat Severity Level</label>
            <select
              value={customSeverity}
              onChange={(e) => setCustomSeverity(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical Emergency</option>
            </select>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
          {/* Deficit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Daily Deficit Impact:</span>
              <span className="text-amber-400 font-bold">{customDeficitMbpd.toFixed(1)} Million bpd</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="22.0"
              step="0.5"
              value={customDeficitMbpd}
              onChange={(e) => setCustomDeficitMbpd(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5M bpd</span>
              <span>10M bpd</span>
              <span>22M bpd</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Projected Duration:</span>
              <span className="text-cyan-400 font-bold">{customDurationDays} Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="180"
              step="7"
              value={customDurationDays}
              onChange={(e) => setCustomDurationDays(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>7 Days</span>
              <span>90 Days</span>
              <span>180 Days</span>
            </div>
          </div>
        </div>

        {/* Chokepoint Checkboxes */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-medium text-slate-300">Disrupted Chokepoints (Select Multiple)</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'hormuz', label: 'Strait of Hormuz' },
              { id: 'babelmandeb', label: 'Bab el-Mandeb (Red Sea)' },
              { id: 'suez', label: 'Suez Canal' },
              { id: 'malacca', label: 'Strait of Malacca' },
              { id: 'panama', label: 'Panama Canal' },
              { id: 'bosporus', label: 'Turkish Straits (Bosporus)' }
            ].map((cp) => {
              const selected = selectedChokepoints.includes(cp.id);
              return (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => toggleChokepoint(cp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                    selected
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700'}`}>
                    {selected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{cp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Execute Custom Button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleRunCustom}
            disabled={isRunning}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Multi-Agent Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
