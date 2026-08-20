"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOrchestrator = void 0;
const geoRiskAgent_js_1 = require("../agents/geoRiskAgent.js");
const disruptionImpactAgent_js_1 = require("../agents/disruptionImpactAgent.js");
const procurementAgent_js_1 = require("../agents/procurementAgent.js");
const reservesAgent_js_1 = require("../agents/reservesAgent.js");
const digitalTwinAgent_js_1 = require("../agents/digitalTwinAgent.js");
const chatCopilotAgent_js_1 = require("../agents/chatCopilotAgent.js");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
class AgentOrchestrator {
    io = null;
    geoRiskAgent;
    disruptionImpactAgent;
    procurementAgent;
    reservesAgent;
    digitalTwinAgent;
    chatCopilotAgent;
    latestResult = null;
    isRunning = false;
    constructor() {
        this.geoRiskAgent = new geoRiskAgent_js_1.GeoRiskAgent();
        this.disruptionImpactAgent = new disruptionImpactAgent_js_1.DisruptionImpactAgent();
        this.procurementAgent = new procurementAgent_js_1.ProcurementAgent();
        this.reservesAgent = new reservesAgent_js_1.ReservesAgent();
        this.digitalTwinAgent = new digitalTwinAgent_js_1.DigitalTwinAgent();
        this.chatCopilotAgent = new chatCopilotAgent_js_1.ChatCopilotAgent();
    }
    setSocketServer(io) {
        this.io = io;
    }
    getLatestResult() {
        return this.latestResult;
    }
    getCopilotAgent() {
        return this.chatCopilotAgent;
    }
    getAgentMetadata() {
        return [
            this.geoRiskAgent.getAgentMetadata(),
            this.disruptionImpactAgent.getAgentMetadata(),
            this.procurementAgent.getAgentMetadata(),
            this.reservesAgent.getAgentMetadata(),
            this.digitalTwinAgent.getAgentMetadata(),
            this.chatCopilotAgent.getAgentMetadata()
        ];
    }
    async runScenario(scenario) {
        const startTime = Date.now();
        this.isRunning = true;
        this.emitEvent('scenario:started', {
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            timestamp: new Date().toISOString()
        });
        const handleLog = (log) => {
            this.emitEvent('agent:thought', log);
        };
        try {
            // Execute all 5 specialized agents in parallel
            const [geoRisk, disruptionImpact, procurement, reserves, digitalTwin] = await Promise.all([
                this.geoRiskAgent.evaluate(scenario, handleLog),
                this.disruptionImpactAgent.evaluate(scenario, handleLog),
                this.procurementAgent.evaluate(scenario, handleLog),
                this.reservesAgent.evaluate(scenario, handleLog),
                this.digitalTwinAgent.evaluate(scenario, handleLog)
            ]);
            const executionDurationMs = Date.now() - startTime;
            const isClaude = this.geoRiskAgent.isClaudeAvailable();
            // Synthesize Cross-Agent Executive Summary & Key Action Items
            const executiveSummary = `Comprehensive multi-agent analysis for "${scenario.name}". Supply chain threat level evaluated as ${geoRisk.threatLevel} with global risk score of ${geoRisk.overallRiskScore}/100. Net supply deficit is ${(disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(1)}M bpd, resulting in projected peak Brent price of $${disruptionImpact.priceShocks[0]?.projectedPeak}/bbl (+${disruptionImpact.priceShocks[0]?.changePercent}%). Recommended emergency response includes a ${reserves.recommendedDrawdownRateMbblDay} MMbbl/day SPR drawdown and alternative procurement of ${(procurement.recommendedAllocations.reduce((s, a) => s + a.volumeBpd, 0) / 1_000_000).toFixed(1)}M bpd from Atlantic Basin and bypass terminals.`;
            const keyActionItems = [
                `Immediate SPR Authorization: Deploy ${reserves.recommendedDrawdownRateMbblDay} MMbbl/d to cushion refinery feedstock shortfalls.`,
                `Procurement Priority: Execute spot supply tenders for ${procurement.recommendedAllocations[0]?.supplier || 'US Gulf Coast'}.`,
                `Maritime Diversion: Re-route vessel fleet via ${geoRisk.reroutingSummary.slice(0, 80)}...`,
                `Network Load-Balancing: Divert ${digitalTwin.recommendedFlowAdjustments[0]?.divertedVolumeBpd.toLocaleString()} bpd across domestic pipeline bypasses.`
            ];
            const aggregatedResult = {
                scenarioId: scenario.id,
                scenarioName: scenario.name,
                timestamp: new Date().toISOString(),
                executionDurationMs,
                isSimulated: !isClaude,
                modelUsed: isClaude ? 'Claude 3.5 Sonnet (Live)' : 'Energy Multi-Agent Simulation Engine',
                geoRisk,
                disruptionImpact,
                procurement,
                reserves,
                digitalTwin,
                executiveSummary,
                keyActionItems
            };
            this.latestResult = aggregatedResult;
            this.isRunning = false;
            this.emitEvent('scenario:completed', aggregatedResult);
            return aggregatedResult;
        }
        catch (err) {
            this.isRunning = false;
            console.error('Scenario execution error:', err);
            this.emitEvent('scenario:error', { error: err.message });
            throw err;
        }
    }
    async runScenarioById(scenarioId) {
        const preset = mockDatabase_js_1.PRESET_SCENARIOS.find(s => s.id === scenarioId);
        if (!preset) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        return this.runScenario(preset);
    }
    emitEvent(eventName, data) {
        if (this.io) {
            this.io.emit(eventName, data);
        }
    }
}
exports.AgentOrchestrator = AgentOrchestrator;
