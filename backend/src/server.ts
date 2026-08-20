import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';

import { createScenarioRouter } from './routes/scenarioRoutes.js';
import { createAgentRouter } from './routes/agentRoutes.js';
import { createChatRouter } from './routes/chatRoutes.js';
import { createMetricsRouter } from './routes/metricsRoutes.js';

import { AgentOrchestrator } from './orchestrator/agentOrchestrator.js';

const app = express();
const orchestrator = new AgentOrchestrator();

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NeuraNova Backend',
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   API ROUTES
========================= */

app.use('/api/scenarios', createScenarioRouter(orchestrator));

app.use('/api/agents', createAgentRouter(orchestrator));

app.use('/api/chat', createChatRouter(orchestrator));

app.use('/api/metrics', createMetricsRouter(orchestrator));

/* =========================
   HTTP SERVER
========================= */

const httpServer = createServer(app);

/* =========================
   SOCKET.IO
========================= */

export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

orchestrator.setSocketServer(io);

io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

/* =========================
   START SERVER
========================= */

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log('==============================================');
  console.log('⚡ NeuraNova Energy Resilience AI Backend ⚡');
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Socket.io active on ws://localhost:${PORT}`);
  console.log('==============================================');
});