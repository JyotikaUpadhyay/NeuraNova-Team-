"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetricsRouter = createMetricsRouter;
const express_1 = require("express");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
function createMetricsRouter(orchestrator) {
    const router = (0, express_1.Router)();
    // Chokepoints status
    router.get('/chokepoints', (_req, res) => {
        const latest = orchestrator.getLatestResult();
        const chokepoints = latest?.geoRisk?.chokepoints || mockDatabase_js_1.INITIAL_CHOKEPOINTS;
        res.json({
            success: true,
            data: chokepoints
        });
    });
    // Alternative suppliers
    router.get('/suppliers', (_req, res) => {
        const latest = orchestrator.getLatestResult();
        const suppliers = latest?.procurement?.rankedAlternatives || mockDatabase_js_1.ALTERNATIVE_SUPPLIERS;
        res.json({
            success: true,
            data: suppliers
        });
    });
    // Supply chain network topology
    router.get('/network', (_req, res) => {
        const latest = orchestrator.getLatestResult();
        const nodes = latest?.digitalTwin?.nodes || mockDatabase_js_1.NETWORK_NODES;
        const bottlenecks = latest?.digitalTwin?.bottleneckPaths || [];
        res.json({
            success: true,
            data: {
                nodes,
                bottlenecks,
                vulnerabilityScore: latest?.digitalTwin?.supplyChainVulnerabilityScore || 35,
                resilienceIndex: latest?.digitalTwin?.networkResilienceIndex || 85
            }
        });
    });
    // SPR Reserves trajectory
    router.get('/spr', (_req, res) => {
        const latest = orchestrator.getLatestResult();
        res.json({
            success: true,
            data: latest?.reserves || {
                currentSprStockpileMbbl: 375,
                baselineDaysCover: 557,
                postDisruptionBufferDays: 185,
                recommendedDrawdownRateMbblDay: 1.0,
                projectedTrajectory: []
            }
        });
    });
    return router;
}
