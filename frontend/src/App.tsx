import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { ExecutiveOverview } from './components/ExecutiveOverview.js';
import { InteractiveSupplyMap } from './components/InteractiveSupplyMap.js';
import { AgentCommandCenter } from './components/AgentCommandCenter.js';
import { AICopilotChat } from './components/AICopilotChat.js';
import { ScenarioSimulator } from './components/ScenarioSimulator.js';
import { ScenarioComparison } from './components/ScenarioComparison.js';
import { ProcurementMatrix } from './components/ProcurementMatrix.js';
import { ReservesModeler } from './components/ReservesModeler.js';
import { NetworkGraphView } from './components/NetworkGraphView.js';
import { AggregatedScenarioResult, AgentThoughtLog, Scenario } from './types/index.js';
import { api } from './services/api.js';
import { initSocket } from './services/socket.js';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [result, setResult] = useState<AggregatedScenarioResult | null>(null);
  const [thoughtLogs, setThoughtLogs] = useState<AgentThoughtLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const [allScenarios, setAllScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    // Load preset scenarios list for comparison UI
    api.getScenarios()
      .then(setAllScenarios)
      .catch((err) => console.error('Failed to fetch scenarios:', err));

    // Initial fetch of latest scenario result
    api.getLatestScenarioResult()
      .then((data) => {
        if (data) setResult(data);
      })
      .catch((err) => console.error('Failed to fetch initial scenario:', err));

    // Connect WebSocket
    const socket = initSocket(
      (log) => {
        setThoughtLogs((prev) => [log, ...prev.slice(0, 49)]);
      },
      (newResult) => {
        setResult(newResult);
        setIsRunningScenario(false);
      },
      (connected) => {
        setIsConnected(connected);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleScenarioTrigger = async (scenarioId: string) => {
    setIsRunningScenario(true);
    setActiveTab('overview');
    try {
      const newResult = await api.runScenario(scenarioId);
      setResult(newResult);
    } catch (err) {
      console.error('Failed to execute scenario:', err);
    } finally {
      setIsRunningScenario(false);
    }
  };

  const handleCustomScenarioTrigger = async (scenarioData: Partial<Scenario>) => {
    setIsRunningScenario(true);
    setActiveTab('overview');
    try {
      const newResult = await api.runCustomScenario(scenarioData);
      setResult(newResult);
      if (newResult?.scenarioId && newResult?.scenarioName) {
        setAllScenarios(prev => {
          if (prev.some(s => s.id === newResult.scenarioId)) return prev;
          return [
            ...prev,
            {
              id: newResult.scenarioId,
              name: newResult.scenarioName,
              category: (scenarioData.category as any) || 'GEOPOLITICAL',
              description: scenarioData.description || '',
              region: scenarioData.region || 'Global',
              severity: scenarioData.severity || 'HIGH',
              disruptedChokepoints: scenarioData.disruptedChokepoints || [],
              disruptedRefineries: [],
              estimatedBpdDeficit: scenarioData.estimatedBpdDeficit || 3000000,
              projectedDurationDays: scenarioData.projectedDurationDays || 30
            }
          ];
        });
      }
    } catch (err) {
      console.error('Failed to execute custom scenario:', err);
    } finally {
      setIsRunningScenario(false);
    }
  };

  const handleChokepointSimulate = (cpId: string) => {
    // Map chokepoint IDs to scenario IDs
    const cpToScenario: Record<string, string> = {
      hormuz: 'hormuz_closed',
      babelmandeb: 'red_sea_crisis',
      suez: 'hormuz_closed',
      malacca: 'red_sea_crisis',
      panama: 'panama_canal_drought',
      bosporus: 'hormuz_closed'
    };
    const scenarioId = cpToScenario[cpId] || 'hormuz_closed';
    handleScenarioTrigger(scenarioId);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        result={result}
        isConnected={isConnected}
      />

      {/* Running Indicator */}
      {isRunningScenario && (
        <div className="w-full bg-blue-600 text-white text-xs font-mono text-center py-1.5 flex items-center justify-center gap-2 animate-pulse">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Multi-agent simulation running across 5 parallel AI models...
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <ExecutiveOverview result={result} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <InteractiveSupplyMap
              chokepoints={result?.geoRisk?.chokepoints}
              onSimulateChokepoint={handleChokepointSimulate}
            />
            {result?.digitalTwin && (
              <NetworkGraphView
                nodes={result.digitalTwin.nodes}
                bottlenecks={result.digitalTwin.bottleneckPaths}
                adjustments={result.digitalTwin.recommendedFlowAdjustments}
                vulnerabilityScore={result.digitalTwin.supplyChainVulnerabilityScore}
                resilienceIndex={result.digitalTwin.networkResilienceIndex}
              />
            )}
          </div>
        )}

        {activeTab === 'agents' && (
          <AgentCommandCenter
            result={result}
            thoughtLogs={thoughtLogs}
            onRerunAgent={() => {
              if (result?.scenarioId) {
                handleScenarioTrigger(result.scenarioId);
              }
            }}
          />
        )}

        {activeTab === 'copilot' && (
          <AICopilotChat onScenarioTriggered={handleScenarioTrigger} />
        )}

        {activeTab === 'simulator' && (
          <ScenarioSimulator
            currentScenarioId={result?.scenarioId}
            onScenarioSelected={handleScenarioTrigger}
            onCustomScenarioCreated={handleCustomScenarioTrigger}
            isRunning={isRunningScenario}
          />
        )}

        {activeTab === 'compare' && (
          <ScenarioComparison
            currentResult={result}
            scenarios={allScenarios}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'procurement' && (
          <div className="space-y-8">
            <ProcurementMatrix procurement={result?.procurement || null} />
            <ReservesModeler reserves={result?.reserves || null} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>NeuraNova Energy Resilience AI • Multi-Agent Autonomous Supply Chain Defense</div>
          <div className="flex items-center gap-4">
            <span>Model: {result?.modelUsed || 'Claude 3.5 Sonnet / Multi-Agent Simulation'}</span>
            <span>•</span>
            <span className="text-emerald-400">System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
