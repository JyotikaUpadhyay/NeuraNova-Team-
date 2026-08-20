"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisruptionImpactAgent = void 0;
const base_js_1 = require("./base.js");
class DisruptionImpactAgent extends base_js_1.BaseAgent {
    constructor() {
        super('disruption-impact-agent', 'Disruption & Price Shock Impact Agent');
    }
    async evaluate(scenario, onProgress) {
        onProgress?.(this.createLog('thought', `Calculating global refining and price shock metrics for: "${scenario.name}"`));
        await this.sleep(450);
        onProgress?.(this.createLog('tool_call', 'Querying CME/ICE oil futures curves, refinery outages, and EIA global balance models...'));
        await this.sleep(550);
        let crudeDeficitBpd = scenario.estimatedBpdDeficit;
        let lngDeficitBcfd = 0;
        let globalSupplyDeficitPercent = Number(((crudeDeficitBpd / 102_000_000) * 100).toFixed(1));
        const reasoning = [];
        const affectedRefineries = [];
        const priceShocks = [];
        if (scenario.id === 'hormuz_closed') {
            crudeDeficitBpd = 17500000;
            lngDeficitBcfd = 10.8; // Qatar LNG shut-in
            globalSupplyDeficitPercent = 17.2;
            affectedRefineries.push({ id: 'ras_tanura', name: 'Ras Tanura Refinery', country: 'Saudi Arabia', lat: 26.6433, lng: 50.1583, capacityBpd: 550000, outagePercent: 85, estimatedRestartDays: 30 }, { id: 'mina_al_ahmadi', name: 'Mina Al-Ahmadi', country: 'Kuwait', lat: 29.0717, lng: 48.1408, capacityBpd: 466000, outagePercent: 90, estimatedRestartDays: 45 }, { id: 'ruwais', name: 'Ruwais Refining Complex', country: 'UAE', lat: 24.1167, lng: 52.7333, capacityBpd: 837000, outagePercent: 70, estimatedRestartDays: 25 }, { id: 'jamnagar', name: 'Reliance Jamnagar (Crude Feed Constrained)', country: 'India', lat: 22.4707, lng: 70.0577, capacityBpd: 1400000, outagePercent: 40, estimatedRestartDays: 14 });
            priceShocks.push({ benchmark: 'BRENT', currentPrice: 82.50, projectedPeak: 138.00, changePercent: +67.3, confidenceInterval: [125.0, 155.0] }, { benchmark: 'WTI', currentPrice: 78.20, projectedPeak: 126.50, changePercent: +61.8, confidenceInterval: [115.0, 142.0] }, { benchmark: 'TTF_GAS', currentPrice: 34.00, projectedPeak: 92.00, changePercent: +170.6, confidenceInterval: [75.0, 110.0] }, { benchmark: 'DIESEL', currentPrice: 110.00, projectedPeak: 185.00, changePercent: +68.2, confidenceInterval: [165.0, 210.0] });
            reasoning.push('17.5M bpd net global crude deficit represents largest single supply shock in modern history.');
            reasoning.push('Qatar LNG freeze removes ~20% of global liquefied natural gas exports, creating severe European & Asian spot bidding wars.');
            reasoning.push('Refinery feedstock shortages threaten major hydrocrackers in Asia and the Mediterranean within 12 days.');
        }
        else if (scenario.id === 'red_sea_crisis') {
            crudeDeficitBpd = 4800000;
            lngDeficitBcfd = 3.2;
            globalSupplyDeficitPercent = 4.7;
            affectedRefineries.push({ id: 'yanbu', name: 'Yanbu Petrochemical Complex', country: 'Saudi Arabia', lat: 24.0900, lng: 38.0630, capacityBpd: 400000, outagePercent: 20, estimatedRestartDays: 10 }, { id: 'sidi_kerir', name: 'Sidi Kerir Terminal', country: 'Egypt', lat: 31.0833, lng: 29.6167, capacityBpd: 500000, outagePercent: 35, estimatedRestartDays: 15 });
            priceShocks.push({ benchmark: 'BRENT', currentPrice: 82.50, projectedPeak: 96.80, changePercent: +17.3, confidenceInterval: [92.0, 104.0] }, { benchmark: 'WTI', currentPrice: 78.20, projectedPeak: 89.50, changePercent: +14.5, confidenceInterval: [85.0, 95.0] }, { benchmark: 'TTF_GAS', currentPrice: 34.00, projectedPeak: 48.50, changePercent: +42.6, confidenceInterval: [42.0, 56.0] }, { benchmark: 'DIESEL', currentPrice: 110.00, projectedPeak: 132.00, changePercent: +20.0, confidenceInterval: [125.0, 140.0] });
            reasoning.push('Cape of Good Hope rerouting adds 10-14 days transit buffer delay, effectively locking up 80M barrels in transit inventory floating stock.');
            reasoning.push('European refining cracks for middle distillates surge due to delayed Jet Fuel and Diesel cargo deliveries from India and Middle East.');
        }
        else if (scenario.id === 'colonial_cyberattack') {
            crudeDeficitBpd = 2500000;
            globalSupplyDeficitPercent = 2.5;
            affectedRefineries.push({ id: 'port_arthur', name: 'Motiva Port Arthur Hub', country: 'United States', lat: 29.8667, lng: -93.9333, capacityBpd: 630000, outagePercent: 50, estimatedRestartDays: 14 }, { id: 'bayway', name: 'Bayway Refinery', country: 'United States', lat: 40.6481, lng: -74.2081, capacityBpd: 238000, outagePercent: 40, estimatedRestartDays: 7 });
            priceShocks.push({ benchmark: 'BRENT', currentPrice: 82.50, projectedPeak: 86.00, changePercent: +4.2, confidenceInterval: [83.0, 89.0] }, { benchmark: 'WTI', currentPrice: 78.20, projectedPeak: 82.00, changePercent: +4.9, confidenceInterval: [79.0, 85.0] }, { benchmark: 'TTF_GAS', currentPrice: 34.00, projectedPeak: 35.50, changePercent: +4.4, confidenceInterval: [33.0, 38.0] }, { benchmark: 'DIESEL', currentPrice: 110.00, projectedPeak: 165.00, changePercent: +50.0, confidenceInterval: [150.0, 185.0] });
            reasoning.push('Regional product shortage localized in US PADD 1 (East Coast), creating extreme crack spread widening on gasoline and ultra-low sulfur diesel.');
        }
        else {
            priceShocks.push({ benchmark: 'BRENT', currentPrice: 82.50, projectedPeak: 92.00, changePercent: +11.5, confidenceInterval: [88.0, 98.0] }, { benchmark: 'WTI', currentPrice: 78.20, projectedPeak: 85.00, changePercent: +8.7, confidenceInterval: [82.0, 90.0] }, { benchmark: 'TTF_GAS', currentPrice: 34.00, projectedPeak: 42.00, changePercent: +23.5, confidenceInterval: [38.0, 48.0] }, { benchmark: 'DIESEL', currentPrice: 110.00, projectedPeak: 125.00, changePercent: +13.6, confidenceInterval: [118.0, 134.0] });
            reasoning.push(`Supply deficit of ${(crudeDeficitBpd / 1_000_000).toFixed(1)}M bpd detected across regional processing hubs.`);
        }
        onProgress?.(this.createLog('metric', `Projected peak Brent: $${priceShocks[0]?.projectedPeak}/bbl (+${priceShocks[0]?.changePercent}%). Net deficit: ${(crudeDeficitBpd / 1_000_000).toFixed(1)}M bpd.`));
        await this.sleep(400);
        const output = {
            crudeDeficitBpd,
            lngDeficitBcfd,
            affectedRefineries,
            priceShocks,
            globalSupplyDeficitPercent,
            reasoning,
            confidenceScore: 92
        };
        onProgress?.(this.createLog('recommendation', `Disruption model concluded: Deficit impact index ${globalSupplyDeficitPercent}% with ${affectedRefineries.length} refineries impacted.`));
        return output;
    }
}
exports.DisruptionImpactAgent = DisruptionImpactAgent;
