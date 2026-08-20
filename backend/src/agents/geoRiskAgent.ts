"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoRiskAgent = void 0;
const base_js_1 = require("./base.js");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
class GeoRiskAgent extends base_js_1.BaseAgent {
    constructor() {
        super('geo-risk-agent', 'Geopolitical & Maritime Risk Agent');
    }
    async evaluate(scenario, onProgress) {
        onProgress?.(this.createLog('thought', `Initiating geopolitical & maritime risk assessment for scenario: "${scenario.name}"`));
        await this.sleep(400);
        onProgress?.(this.createLog('tool_call', 'Querying Global AIS vessel transponder streams & naval taskforce tracking databases...'));
        await this.sleep(500);
        // Deep simulation or LLM analysis
        const updatedChokepoints = JSON.parse(JSON.stringify(mockDatabase_js_1.INITIAL_CHOKEPOINTS));
        let overallRiskScore = 35;
        let threatLevel = 'LOW';
        let reroutingSummary = 'Normal maritime transit corridors operational without critical diversions.';
        const reasoning = [];
        if (scenario.id === 'hormuz_closed' || scenario.disruptedChokepoints.includes('hormuz')) {
            const hormuz = updatedChokepoints.find(c => c.id === 'hormuz');
            if (hormuz) {
                hormuz.status = 'BLOCKED';
                hormuz.transitFlowDropPercent = 95;
                hormuz.riskScore = 98;
                hormuz.incidentSummary = 'Hostile naval interdiction and mine-laying confirmed. Tanker insurance suspended globally.';
                hormuz.extraTransitDays = 15;
            }
            overallRiskScore = 96;
            threatLevel = 'CRITICAL';
            reroutingSummary = '21M bpd maritime lane shut down. Crude diverted via East-West Petroline (5M bpd capacity max) and Fujairah bypass.';
            reasoning.push('Strait of Hormuz transit volume dropped by ~20M bpd (~20% of global oil consumption).');
            reasoning.push('VLCC and Suezmax freight war-risk insurance premiums spiked by over 450%.');
            reasoning.push('Secondary congestion detected at Fujairah and Yanbu offshore single-point mooring buoys.');
        }
        else if (scenario.id === 'red_sea_crisis' || scenario.disruptedChokepoints.includes('babelmandeb')) {
            const babelmandeb = updatedChokepoints.find(c => c.id === 'babelmandeb');
            const suez = updatedChokepoints.find(c => c.id === 'suez');
            if (babelmandeb) {
                babelmandeb.status = 'RESTRICTED';
                babelmandeb.transitFlowDropPercent = 82;
                babelmandeb.riskScore = 92;
                babelmandeb.incidentSummary = 'High-frequency drone and anti-ship missile strikes targeting energy commercial vessels.';
            }
            if (suez) {
                suez.status = 'RESTRICTED';
                suez.transitFlowDropPercent = 75;
                suez.riskScore = 85;
            }
            overallRiskScore = 84;
            threatLevel = 'HIGH';
            reroutingSummary = 'Mass tanker rerouting around Cape of Good Hope adds 10-14 transit days and $3.50/bbl in bunker/charter freight.';
            reasoning.push('Bab el-Mandeb transit dropped by 82%; 90% of Europe-bound Gulf crude taking Cape route.');
            reasoning.push('Bunker fuel consumption increased by 35% across rerouted container and tanker fleet.');
        }
        else if (scenario.id === 'colonial_cyberattack') {
            overallRiskScore = 72;
            threatLevel = 'HIGH';
            reroutingSummary = 'Domestic pipeline infrastructure paralyzed. Surging coastal Jones Act clean tanker charters to bridge deficit.';
            reasoning.push('SCADA control systems isolated across 5,500 miles of refined product pipeline.');
            reasoning.push('Gulf Coast to New York harbor product flows reduced to rail and coastal barge only.');
        }
        else if (scenario.id === 'panama_canal_drought' || scenario.disruptedChokepoints.includes('panama')) {
            const panama = updatedChokepoints.find(c => c.id === 'panama');
            if (panama) {
                panama.status = 'CONGESTED';
                panama.transitFlowDropPercent = 55;
                panama.riskScore = 68;
            }
            overallRiskScore = 58;
            threatLevel = 'MEDIUM';
            reroutingSummary = 'Neo-Panamax draft limits forcing US LNG exports destined for Asia to take Cape of Good Hope or Suez eastbound routes.';
            reasoning.push('Daily booking slots restricted from 36 to 18 vessels.');
        }
        else {
            overallRiskScore = scenario.severity === 'CRITICAL' ? 90 : scenario.severity === 'HIGH' ? 70 : 45;
            threatLevel = scenario.severity;
            reroutingSummary = `Regional disruption active across ${scenario.region}. Monitoring supply chain chokepoints.`;
            reasoning.push(`Estimated direct daily deficit: ${(scenario.estimatedBpdDeficit / 1_000_000).toFixed(1)}M bpd.`);
        }
        onProgress?.(this.createLog('tool_result', `AIS and Risk Analysis calculated. Overall risk index: ${overallRiskScore}/100 (${threatLevel})`));
        await this.sleep(400);
        // If Claude is configured, we can enrich with live generative synthesis
        if (this.isClaudeAvailable()) {
            try {
                onProgress?.(this.createLog('thought', 'Sending telemetry payload to Claude 3.5 Sonnet for deep geopolitical reasoning...'));
                const prompt = `You are the Geopolitical & Maritime Risk Agent. Analyze the energy supply chain scenario:
Name: ${scenario.name}
Description: ${scenario.description}
Region: ${scenario.region}
Severity: ${scenario.severity}
Disrupted Chokepoints: ${scenario.disruptedChokepoints.join(', ')}

Return a JSON object with:
{
  "overallRiskScore": number (0-100),
  "threatLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "reroutingSummary": string,
  "reasoning": string[] (3-4 bullet points),
  "vesselCongestionIndex": number (0-100)
}`;
                const llmResponse = await this.queryClaude('You are an expert maritime intelligence and energy geopolitical analyst.', prompt);
                const parsed = this.parseJsonFromLlm(llmResponse, {
                    overallRiskScore,
                    threatLevel,
                    reroutingSummary,
                    reasoning,
                    vesselCongestionIndex: 78
                });
                overallRiskScore = parsed.overallRiskScore || overallRiskScore;
                threatLevel = parsed.threatLevel || threatLevel;
                reroutingSummary = parsed.reroutingSummary || reroutingSummary;
                if (parsed.reasoning && parsed.reasoning.length > 0) {
                    reasoning.splice(0, reasoning.length, ...parsed.reasoning);
                }
            }
            catch (err) {
                console.warn('Claude analysis failed, continuing with deterministic model:', err);
            }
        }
        const output = {
            overallRiskScore,
            threatLevel,
            chokepoints: updatedChokepoints,
            vesselCongestionIndex: Math.min(100, Math.round(overallRiskScore * 0.9 + 10)),
            reroutingSummary,
            reasoning,
            confidenceScore: 94
        };
        onProgress?.(this.createLog('recommendation', `Geo Risk assessment finalized: Threat level ${threatLevel} with ${output.vesselCongestionIndex}% maritime congestion index.`));
        return output;
    }
}
exports.GeoRiskAgent = GeoRiskAgent;
