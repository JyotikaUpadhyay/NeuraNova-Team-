"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const agentOrchestrator_js_1 = require("./orchestrator/agentOrchestrator.js");
const scenarioRoutes_js_1 = require("./routes/scenarioRoutes.js");
const chatRoutes_js_1 = require("./routes/chatRoutes.js");
const metricsRoutes_js_1 = require("./routes/metricsRoutes.js");
const agentRoutes_js_1 = require("./routes/agentRoutes.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
// Initialize Orchestrator
const orchestrator = new agentOrchestrator_js_1.AgentOrchestrator();
orchestrator.setSocketServer(io);
// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    // Send latest state upon connection
    const latest = orchestrator.getLatestResult();
    if (latest) {
        socket.emit('scenario:latest', latest);
    }
    socket.on('disconnect', () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
});
// API Routes
app.use('/api/scenarios', (0, scenarioRoutes_js_1.createScenarioRouter)(orchestrator));
app.use('/api/chat', (0, chatRoutes_js_1.createChatRouter)(orchestrator));
app.use('/api/metrics', (0, metricsRoutes_js_1.createMetricsRouter)(orchestrator));
app.use('/api/agents', (0, agentRoutes_js_1.createAgentRouter)(orchestrator));
// Health Check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        claudeEnabled: orchestrator.getAgentMetadata()[0]?.isUsingClaude || false,
        agentsCount: 6
    });
});
const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  ⚡ NeuraNova Energy Resilience AI Backend ⚡       `);
    console.log(`  Server running on: http://localhost:${PORT}        `);
    console.log(`  Health Check:     http://localhost:${PORT}/api/health`);
    console.log(`  Socket.io active on ws://localhost:${PORT}        `);
    console.log(`====================================================`);
    // Seed default run in background
    orchestrator.runScenarioById('hormuz_closed').catch(err => {
        console.warn('Initial seeding scenario notice:', err.message);
    });
});
