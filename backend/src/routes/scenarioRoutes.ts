"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScenarioRouter = createScenarioRouter;
const express_1 = require("express");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
function createScenarioRouter(orchestrator) {
    const router = (0, express_1.Router)();
    // Get all preset scenarios
    router.get('/', (_req, res) => {
        res.json({
            success: true,
            scenarios: mockDatabase_js_1.PRESET_SCENARIOS
        });
    });
    // Get latest scenario run results
    router.get('/latest', async (_req, res) => {
        let latest = orchestrator.getLatestResult();
        if (!latest) {
            // Default to running the baseline or Hormuz scenario to seed data
            try {
                latest = await orchestrator.runScenarioById('hormuz_closed');
            }
            catch (err) {
                console.error('Failed to initialize default scenario:', err);
            }
        }
        res.json({
            success: true,
            data: latest
        });
    });
    // Run scenario by ID
    router.post('/run/:id', async (req, res) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        try {
            const result = await orchestrator.runScenarioById(id);
            res.json({
                success: true,
                data: result
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    });
    // Run custom scenario
    router.post('/run-custom', async (req, res) => {
        try {
            const customScenario = {
                id: `custom-${Date.now()}`,
                name: req.body.name || 'Custom Energy Disruption Scenario',
                category: req.body.category || 'GEOPOLITICAL',
                description: req.body.description || 'User-defined energy crisis simulation.',
                region: req.body.region || 'Global',
                severity: req.body.severity || 'HIGH',
                disruptedChokepoints: req.body.disruptedChokepoints || [],
                disruptedRefineries: req.body.disruptedRefineries || [],
                estimatedBpdDeficit: Number(req.body.estimatedBpdDeficit) || 3000000,
                projectedDurationDays: Number(req.body.projectedDurationDays) || 30
            };
            const result = await orchestrator.runScenario(customScenario);
            res.json({
                success: true,
                data: result
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    });
    return router;
}
