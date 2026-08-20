"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalTwinAgent = void 0;
const base_js_1 = require("./base.js");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
class DigitalTwinAgent extends base_js_1.BaseAgent {
    constructor() {
        super('digital-twin-agent', 'Digital Twin & Bottleneck Detection Agent');
    }
    async evaluate(scenario, onProgress) {
        onProgress?.(this.createLog('thought', `Running Monte Carlo flow simulation across global node-edge supply chain topology for: "${scenario.name}"`));
        await this.sleep(400);
        onProgress?.(this.createLog('tool_call', 'Constructing topological graph of 45 crude shipping lanes, 18 pipeline corridors, and 12 refining clusters...'));
        await this.sleep(550);
        const nodes = JSON.parse(JSON.stringify(mockDatabase_js_1.NETWORK_NODES));
        const bottleneckPaths = [];
        const recommendedFlowAdjustments = [];
        const reasoning = [];
        let supplyChainVulnerabilityScore = 32;
        let networkResilienceIndex = 88;
        if (scenario.id === 'hormuz_closed') {
            supplyChainVulnerabilityScore = 92;
            networkResilienceIndex = 28;
            // Update node statuses
            const rasTanura = nodes.find(n => n.id === 'ras_tanura_terminal');
            if (rasTanura) {
                rasTanura.status = 'COMPROMISED';
                rasTanura.currentThroughputBpd = 500000;
                rasTanura.utilizationPercent = 10;
            }
            bottleneckPaths.push({ id: 'bp-1', source: 'Ghawar / Ras Tanura', chokepoint: 'Strait of Hormuz', destination: 'Asia-Pacific / Tokyo Bay', capacityUtilizationPercent: 100, riskWeight: 0.98, status: 'CRITICAL' }, { id: 'bp-2', source: 'Upper Zakum / Fujairah', chokepoint: 'Habshan-Fujairah Pipeline', destination: 'Indian Ocean', capacityUtilizationPercent: 98, riskWeight: 0.85, status: 'STRESSED' }, { id: 'bp-3', source: 'Abqaiq / Yanbu', chokepoint: 'East-West Petroline', destination: 'Red Sea Export Terminal', capacityUtilizationPercent: 99, riskWeight: 0.88, status: 'STRESSED' });
            recommendedFlowAdjustments.push({ routeId: 'adj-1', action: 'REROUTE', from: 'Eastern Province Fields', to: 'Yanbu Red Sea Terminal', divertedVolumeBpd: 3500000, details: 'Maximize Petroline throughput to full nameplate 5.0M bpd.' }, { routeId: 'adj-2', action: 'SURGE', from: 'US Gulf Permian Basin', to: 'Rotterdam & Asia Refineries', divertedVolumeBpd: 2200000, details: 'Surge export dock utilization at Corpus Christi and Nederland.' }, { routeId: 'adj-3', action: 'INVENTORY_BUFFER', from: 'Domestic Storage', to: 'Jamnagar & Jurong Hubs', divertedVolumeBpd: 1200000, details: 'Tap on-site storage tanks while replacement cargoes are in transit.' });
            reasoning.push('Detected single-point-of-failure cascade in Middle Eastern export terminals.');
            reasoning.push('Fujairah and Yanbu pipeline bypasses are operating at 98%+ surge utilization capacity.');
            reasoning.push('Downstream Asian refining clusters (Jamnagar, Jurong) face crude starvation within 14 days without rerouting.');
        }
        else if (scenario.id === 'red_sea_crisis') {
            supplyChainVulnerabilityScore = 74;
            networkResilienceIndex = 62;
            bottleneckPaths.push({ id: 'bp-1', source: 'Middle East Terminals', chokepoint: 'Bab el-Mandeb / Suez', destination: 'Rotterdam Energy Hub', capacityUtilizationPercent: 94, riskWeight: 0.88, status: 'CRITICAL' }, { id: 'bp-2', source: 'West Africa / Americas', chokepoint: 'Cape of Good Hope Corridor', destination: 'Northwest Europe', capacityUtilizationPercent: 92, riskWeight: 0.65, status: 'STRESSED' });
            recommendedFlowAdjustments.push({ routeId: 'adj-1', action: 'REROUTE', from: 'Yanbu / Persian Gulf', to: 'Rotterdam via Cape of Good Hope', divertedVolumeBpd: 4200000, details: 'Shift all Suez-bound VLCC and Suezmax fixtures to Southern Africa route.' });
            reasoning.push('Transit latency increased by +12 to +14 days; global maritime fleet utilization stressed by 8.4%.');
            reasoning.push('Cape Town and Durban bunker replenishment hubs experiencing 40% surge in vessel calls.');
        }
        else {
            bottleneckPaths.push({ id: 'bp-1', source: 'Permian Basin', chokepoint: 'Gulf Coast Export Hub', destination: 'Global Markets', capacityUtilizationPercent: 88, riskWeight: 0.45, status: 'OPTIMAL' });
            recommendedFlowAdjustments.push({ routeId: 'adj-1', action: 'THROTTLE', from: 'Stressed Corridors', to: 'Alternative Tank Farms', divertedVolumeBpd: 500000, details: 'Smooth flow rates to prevent terminal bottlenecks.' });
            reasoning.push('Network topology is stable with localized capacity buffering active.');
        }
        onProgress?.(this.createLog('tool_result', `Digital Twin graph solved. Vulnerability index: ${supplyChainVulnerabilityScore}/100. Resilience score: ${networkResilienceIndex}/100.`));
        await this.sleep(400);
        const output = {
            supplyChainVulnerabilityScore,
            networkResilienceIndex,
            bottleneckPaths,
            nodes,
            recommendedFlowAdjustments,
            reasoning,
            confidenceScore: 93
        };
        onProgress?.(this.createLog('recommendation', `Digital Twin synthesis complete: Identified ${bottleneckPaths.length} critical bottlenecks, executed ${recommendedFlowAdjustments.length} dynamic flow adjustments.`));
        return output;
    }
}
exports.DigitalTwinAgent = DigitalTwinAgent;
