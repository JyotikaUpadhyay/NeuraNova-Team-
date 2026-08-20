"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentRouter = createAgentRouter;
const express_1 = require("express");
function createAgentRouter(orchestrator) {
    const router = (0, express_1.Router)();
    // List all agent metadata and status
    router.get('/metadata', (_req, res) => {
        res.json({
            success: true,
            agents: orchestrator.getAgentMetadata()
        });
    });
    return router;
}