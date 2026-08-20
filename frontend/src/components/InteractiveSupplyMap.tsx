import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Shield, Anchor, AlertTriangle, Navigation, Play, Zap } from 'lucide-react';
import { ChokepointData, NetworkNode } from '../types/index.js';
import { api } from '../services/api.js';

// Custom pulsing icons for chokepoints
const createChokepointIcon = (status: string, riskScore: number) => {
  const color =
    status === 'BLOCKED' ? '#ef4444' :
    status === 'RESTRICTED' ? '#f59e0b' :
    status === 'CONGESTED' ? '#eab308' : '#10b981';

  return L.divIcon({
    className: 'custom-chokepoint-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 22px; height: 22px; border-radius: 50%; background-color: ${color}; border: 2.5px solid #0b1120; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${color};">
          <span style="color: white; font-size: 8px; font-weight: bold; font-family: monospace;">${riskScore}</span>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

interface InteractiveSupplyMapProps {
  chokepoints?: ChokepointData[];
  onSimulateChokepoint?: (chokepointId: string) => void;
}

export const InteractiveSupplyMap: React.FC<InteractiveSupplyMapProps> = ({
  chokepoints: propChokepoints,
  onSimulateChokepoint
}) => {
  const [chokepoints, setChokepoints] = useState<ChokepointData[]>(propChokepoints || []);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [selectedChokepoint, setSelectedChokepoint] = useState<ChokepointData | null>(null);

  useEffect(() => {
    if (propChokepoints && propChokepoints.length > 0) {
      setChokepoints(propChokepoints);
    } else {
      api.getChokepoints().then(setChokepoints).catch(console.error);
    }

    api.getNetwork().then(data => setNodes(data.nodes)).catch(console.error);
  }, [propChokepoints]);

  // Coordinates for major shipping corridors
  const suezCorridor: [number, number][] = [
    [26.5667, 56.25], // Hormuz
    [12.5833, 43.3333], // Bab el-Mandeb
    [30.5852, 32.2654], // Suez
    [36.0, 15.0], // Mediterranean
    [36.14, -5.35], // Gibraltar
    [51.9244, 4.4777] // Rotterdam
  ];

  const capeCorridor: [number, number][] = [
    [26.5667, 56.25], // Hormuz
    [0.0, 52.0], // Indian Ocean
    [-34.3568, 18.474], // Cape of Good Hope
    [0.0, -10.0], // Atlantic
    [36.14, -5.35], // Gibraltar
    [51.9244, 4.4777] // Rotterdam
  ];

  const asiaCorridor: [number, number][] = [
    [26.5667, 56.25], // Hormuz
    [6.0, 80.0], // Sri Lanka south
    [4.2105, 100.9925], // Malacca
    [1.2667, 103.7167], // Singapore
    [35.5333, 139.7833] // Tokyo Bay
  ];

  const transatlanticCorridor: [number, number][] = [
    [27.8006, -97.3964], // Corpus Christi
    [29.7355, -95.1265], // Houston
    [25.0, -80.0], // Florida Straits
    [45.0, -30.0], // Mid-Atlantic
    [51.9244, 4.4777] // Rotterdam
  ];

  return (
    <div className="space-y-4">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#111827] border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-400" />
            Global Maritime Energy Corridors & Chokepoint Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Real-time transit status, vessel flow drops, and Cape of Good Hope rerouting corridors
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-slate-300">Blocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Restricted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-amber-400 border-dashed" />
            <span className="text-slate-300">Cape Reroute</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[560px] bg-[#0c1222]">
        <MapContainer
          center={[22.0, 35.0]}
          zoom={3}
          minZoom={2}
          maxZoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Dark-themed Basemap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Shipping Corridors */}
          <Polyline
            positions={suezCorridor}
            pathOptions={{ color: '#3b82f6', weight: 2.5, opacity: 0.75, dashArray: '6, 6' }}
          />

          <Polyline
            positions={capeCorridor}
            pathOptions={{ color: '#f59e0b', weight: 3, opacity: 0.85 }}
          />

          <Polyline
            positions={asiaCorridor}
            pathOptions={{ color: '#06b6d4', weight: 2, opacity: 0.7 }}
          />

          <Polyline
            positions={transatlanticCorridor}
            pathOptions={{ color: '#10b981', weight: 2.5, opacity: 0.8 }}
          />

          {/* Chokepoints Markers */}
          {chokepoints.map((cp) => (
            <Marker
              key={cp.id}
              position={[cp.lat, cp.lng]}
              icon={createChokepointIcon(cp.status, cp.riskScore)}
              eventHandlers={{
                click: () => setSelectedChokepoint(cp)
              }}
            >
              <Popup>
                <div className="p-2 space-y-2 min-w-[260px]">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <h4 className="font-bold text-sm text-white">{cp.name}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        cp.status === 'BLOCKED' ? 'bg-red-500/20 text-red-400' :
                        cp.status === 'RESTRICTED' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {cp.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Daily Flow</span>
                      <span className="font-bold text-white font-mono">{cp.dailyFlowMbpd} MMbpd</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Global Share</span>
                      <span className="font-bold text-white font-mono">{cp.globalSharePercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Flow Drop</span>
                      <span className="font-bold text-red-400 font-mono">-{cp.transitFlowDropPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Risk Score</span>
                      <span className="font-bold text-amber-400 font-mono">{cp.riskScore}/100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                    {cp.incidentSummary}
                  </p>

                  <div className="text-[11px] bg-slate-800 p-1.5 rounded text-cyan-300 font-medium">
                    ↳ Bypass: {cp.alternateRoute} (+{cp.extraTransitDays} days)
                  </div>

                  {onSimulateChokepoint && (
                    <button
                      onClick={() => onSimulateChokepoint(cp.id)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Simulate Threat at {cp.name.split(' ')[0]}</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Infrastructure & Refinery Nodes */}
          {nodes.map((node) => (
            <CircleMarker
              key={node.id}
              center={[node.lat, node.lng]}
              radius={node.type === 'REFINERY' ? 6 : 4}
              pathOptions={{
                color: node.type === 'REFINERY' ? '#8b5cf6' : '#38bdf8',
                fillColor: node.type === 'REFINERY' ? '#a78bfa' : '#7dd3fc',
                fillOpacity: 0.8,
                weight: 1.5
              }}
            >
              <Popup>
                <div className="p-1.5 space-y-1 text-xs min-w-[180px]">
                  <div className="font-bold text-white">{node.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Type: {node.type}</div>
                  <div className="text-slate-300 font-mono">Capacity: {(node.capacityBpd / 1_000_000).toFixed(2)}M bpd</div>
                  <div className="text-slate-300 font-mono">Utilization: {node.utilizationPercent}%</div>
                  <div className="text-emerald-400 font-bold text-[10px]">{node.status}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Selected Chokepoint Floating Detail Card */}
        {selectedChokepoint && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-[#111827]/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 max-w-sm shadow-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-400" />
                {selectedChokepoint.name}
              </h3>
              <button
                onClick={() => setSelectedChokepoint(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300 leading-snug">{selectedChokepoint.incidentSummary}</p>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-cyan-300">
              <strong>Bypass:</strong> {selectedChokepoint.alternateRoute} (+{selectedChokepoint.extraTransitDays} days shipping time)
            </div>
            {onSimulateChokepoint && (
              <button
                onClick={() => onSimulateChokepoint(selectedChokepoint.id)}
                className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center gap-1 text-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Threat</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
