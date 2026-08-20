"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementAgent = void 0;
const base_js_1 = require("./base.js");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
class ProcurementAgent extends base_js_1.BaseAgent {
    constructor() {
        super('procurement-agent', 'Procurement & Alternative Routing Agent');
    }
    async evaluate(scenario, onProgress) {
        onProgress?.(this.createLog('thought', `Scanning global crude export terminals and charter availability for scenario: "${scenario.name}"`));
        await this.sleep(400);
        onProgress?.(this.createLog('tool_call', 'Computing freight parity matrix, API gravity compatibility, and spot availability...'));
        await this.sleep(500);
        const alternatives = JSON.parse(JSON.stringify(mockDatabase_js_1.ALTERNATIVE_SUPPLIERS));
        const recommendedAllocations = [];
        const reasoning = [];
        if (scenario.id === 'hormuz_closed') {
            // Prioritize Atlantic Basin & Red Sea Bypass
            recommendedAllocations.push({ supplier: 'Saudi East-West Petroline Bypass (Yanbu Hub)', volumeBpd: 3500000, priority: 1, rationale: 'Immediate pipeline bypass to Red Sea terminal avoiding Hormuz chokepoint.' }, { supplier: 'US Gulf Coast Export Hubs', volumeBpd: 2400000, priority: 2, rationale: 'Surge VLCC exports of WTI Midland from Corpus Christi/LOOP deepwater ports.' }, { supplier: 'West African Producers (Nigeria/Angola)', volumeBpd: 1100000, priority: 3, rationale: 'Light sweet crude substitution for Asian and European refineries.' }, { supplier: 'Petrobras Offshore Santos Basin', volumeBpd: 950000, priority: 4, rationale: 'Medium sweet grade substitution with term contract flexibility.' });
            reasoning.push('Maximized crude redirection through Saudi East-West Petroline (5.0M bpd theoretical capacity).');
            reasoning.push('Surged US Gulf Coast crude loadings to peak capacity; VLCC freight rates projected at WS 140.');
            reasoning.push('Procurement gap remains at ~9.55M bpd, requiring coordinated SPR releases.');
        }
        else if (scenario.id === 'red_sea_crisis') {
            recommendedAllocations.push({ supplier: 'West African Producers (Nigeria/Angola)', volumeBpd: 1100000, priority: 1, rationale: 'Direct Atlantic voyage to Europe without Suez/Red Sea exposure.' }, { supplier: 'North Sea Offshore Cluster', volumeBpd: 650000, priority: 2, rationale: 'Short haul (6 days lead time) to mitigate floating inventory delay.' }, { supplier: 'US Gulf Coast Export Hubs', volumeBpd: 2000000, priority: 3, rationale: 'Transatlantic clean and crude delivery bypasses all conflict zones.' });
            reasoning.push('Swapped Middle East crude contracts with Atlantic basin barrels to eliminate 14-day Cape detour for Northwest European refineries.');
            reasoning.push('Landed cost differential averages +$2.10/bbl, primarily driven by bunker surcharges.');
        }
        else {
            recommendedAllocations.push({ supplier: 'US Gulf Coast Export Hubs', volumeBpd: 1500000, priority: 1, rationale: 'High reliability spot market liquidity.' }, { supplier: 'West African Producers (Nigeria/Angola)', volumeBpd: 800000, priority: 2, rationale: 'Flexible delivery terms.' });
            reasoning.push('Procurement matrix optimized to balance lead-time delta against freight arbitrage premiums.');
        }
        const totalAllocatedBpd = recommendedAllocations.reduce((sum, a) => sum + a.volumeBpd, 0);
        const deficit = scenario.estimatedBpdDeficit || 1;
        const supplyReplacementCoveragePercent = Math.min(100, Number(((totalAllocatedBpd / deficit) * 100).toFixed(1)));
        onProgress?.(this.createLog('tool_result', `Alternative procurement matrix resolved. Replaced ${(totalAllocatedBpd / 1_000_000).toFixed(2)}M bpd (${supplyReplacementCoveragePercent}% coverage).`));
        await this.sleep(400);
        const output = {
            rankedAlternatives: alternatives,
            recommendedAllocations,
            averageLandedCostIncrease: 2.15,
            supplyReplacementCoveragePercent,
            reasoning,
            confidenceScore: 95
        };
        onProgress?.(this.createLog('recommendation', `Procurement plan generated: Top recommended source is "${recommendedAllocations[0]?.supplier}" with ${recommendedAllocations[0]?.volumeBpd.toLocaleString()} bpd allocation.`));
        return output;
    }
}
exports.ProcurementAgent = ProcurementAgent;
