"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservesAgent = void 0;
const base_js_1 = require("./base.js");
class ReservesAgent extends base_js_1.BaseAgent {
    constructor() {
        super('reserves-agent', 'Strategic Reserves & SPR Optimization Agent');
    }
    async evaluate(scenario, onProgress) {
        onProgress?.(this.createLog('thought', `Assessing Strategic Petroleum Reserve (SPR) inventory levels and IEA treaty buffer thresholds for: "${scenario.name}"`));
        await this.sleep(400);
        onProgress?.(this.createLog('tool_call', 'Querying US SPR caverns (Bryan Mound, Big Hill, West Hackberry, Bayou Choctaw) & OECD commercial stock data...'));
        await this.sleep(500);
        const currentSprStockpileMbbl = 375.0; // Million barrels
        const baselineDailyConsumptionMbpd = 20.2; // US daily consumption
        const baselineDaysCover = Math.round((currentSprStockpileMbbl / baselineDailyConsumptionMbpd) * 30); // ~557 days for net imports or ~18-20 days gross
        let recommendedDrawdownRateMbblDay = 1.0;
        let emergencyReleaseRecommended = false;
        const reasoning = [];
        if (scenario.id === 'hormuz_closed') {
            recommendedDrawdownRateMbblDay = 2.5; // Max physical cavern pump-out limit
            emergencyReleaseRecommended = true;
            reasoning.push('Triggered IEA Coordinated Collective Action emergency release protocol.');
            reasoning.push('Recommended maximum physical drawdown of 2.5 MMbbl/day across Gulf Coast salt dome caverns.');
            reasoning.push('SPR inventory buffer extends domestic supply cushion by 120 days during active interdiction.');
        }
        else if (scenario.id === 'red_sea_crisis') {
            recommendedDrawdownRateMbblDay = 0.8;
            emergencyReleaseRecommended = false;
            reasoning.push('Rerouting delays do not require emergency SPR drawdown; commercial floating storage buffer is sufficient.');
            reasoning.push('Recommend targeted loan-and-exchange (exchange contracts) to refiners experiencing short-term feedstock arrival gaps.');
        }
        else if (scenario.id === 'colonial_cyberattack') {
            recommendedDrawdownRateMbblDay = 1.2;
            emergencyReleaseRecommended = true;
            reasoning.push('Recommend emergency Northeast Gasoline Supply Reserve (NGSR) product drawdowns to stabilize PADD 1 distribution.');
        }
        else {
            recommendedDrawdownRateMbblDay = 0.5;
            emergencyReleaseRecommended = false;
            reasoning.push('Buffer levels within nominal operating band; maintain standard inventory posture.');
        }
        const postDisruptionBufferDays = Math.round(currentSprStockpileMbbl / (baselineDailyConsumptionMbpd * (scenario.severity === 'CRITICAL' ? 1.4 : 1.1)) * 30);
        // Compute 90-day trajectory points
        const projectedTrajectory = [];
        let runningSpr = currentSprStockpileMbbl;
        const basePrice = scenario.severity === 'CRITICAL' ? 135 : scenario.severity === 'HIGH' ? 95 : 82;
        for (let day = 0; day <= 90; day += 5) {
            if (day > 0) {
                runningSpr = Math.max(100, runningSpr - recommendedDrawdownRateMbblDay * 5);
            }
            const daysCover = Math.round((runningSpr / baselineDailyConsumptionMbpd) * 30);
            const marketPrice = Number((basePrice - (day * 0.15) + (Math.sin(day / 10) * 3)).toFixed(2));
            projectedTrajectory.push({
                day,
                remainingSprMbbl: Number(runningSpr.toFixed(1)),
                bufferDaysCover: daysCover,
                marketPriceEstimate: marketPrice
            });
        }
        const replenishmentTriggers = {
            triggerPriceUsd: 72.00,
            recommendedRefillRateMbblDay: 0.25,
            targetBufferDays: 450,
            notes: 'Initiate forward purchase contracts when prompt crude settles below $72/bbl and market structure returns to contango.'
        };
        onProgress?.(this.createLog('tool_result', `SPR Drawdown curve calculated. Recommended release: ${recommendedDrawdownRateMbblDay} MMbbl/day. Post-disruption buffer: ${postDisruptionBufferDays} days.`));
        await this.sleep(400);
        const output = {
            currentSprStockpileMbbl,
            baselineDaysCover,
            postDisruptionBufferDays,
            recommendedDrawdownRateMbblDay,
            projectedTrajectory,
            replenishmentTriggers,
            emergencyReleaseRecommended,
            reasoning,
            confidenceScore: 96
        };
        onProgress?.(this.createLog('recommendation', `Reserves strategy formulated: ${emergencyReleaseRecommended ? 'EMERGENCY DRAWDOWN AUTHORIZED' : 'STANDARD MONITORING'} at ${recommendedDrawdownRateMbblDay} MMbbl/d.`));
        return output;
    }
}
exports.ReservesAgent = ReservesAgent;