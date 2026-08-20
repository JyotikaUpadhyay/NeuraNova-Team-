# NeuraNova-Team-
# ⚡ NeuraNova Energy Supply Chain Resilience Platform

An autonomous, multi-agent AI command center for global energy supply chain risk monitoring, geopolitical threat simulation, disruption forecasting, alternative procurement routing, and strategic reserve (SPR) optimization.

---

## 🌟 Key Capabilities

### 1. 🤖 5 Parallel Autonomous AI Agents
- **🌐 Geopolitical & Maritime Risk Agent**: Analyzes global chokepoints (Strait of Hormuz, Bab el-Mandeb, Suez Canal, Malacca Strait, Turkish Straits, Panama Canal), AIS transponder anomalies, naval taskforces, and calculates threat indices (0–100).
- **💥 Disruption & Price Shock Agent**: Models refinery outages, net bpd supply loss, and projects ICE/CME futures price shocks (Brent, WTI, TTF Gas, Ultra-Low Sulfur Diesel).
- **🚢 Strategic Procurement & Routing Agent**: Evaluates replacement crude grades (US WTI Midland, West African Bonny Light, Brazilian Tupi, Saudi Yanbu Bypass), freight cost parity, lead-time variance, and optimal contract mix.
- **🛢️ Strategic Reserves (SPR) Agent**: Calculates post-disruption buffer days of cover, models 90-day drawdown depletion trajectories, and sets automated purchase refill triggers.
- **🕸️ Digital Twin & Bottleneck Agent**: Simulates the end-to-end global supply chain topology (Extraction Fields ➔ Export Terminals ➔ Shipping Corridors ➔ Refineries ➔ Demand Centers) and executes dynamic flow adjustments.

### 2. 💬 Intelligent AI Copilot (ChatGPT-like Interface)
- Built-in conversational AI assistant specialized in energy economics and logistics.
- Transparent **Chain of Thought** inspection.
- Autonomous **Tool Invocations** (`orchestrator.triggerScenario`, `reservesAgent.calculateDrawdown`, `procurementAgent.rankSuppliers`, `reportGenerator.compileExecutiveBrief`).
- Natural language scenario triggering and structured markdown reporting.

### 3. 🌍 Interactive Maritime World Map & Flow Topography
- Live Leaflet map with real-time chokepoint status markers (Pulsing Red for Blocked, Amber for Restricted, Green for Open).
- Visualized alternate routing paths (e.g. Cape of Good Hope rerouting adding 10-14 transit days).
- Interactive infrastructure and refining cluster telemetry.

---

## 🏗️ Architecture & Tech Stack

```
                     ┌────────────────────────────────────────────────────────┐
                     │          React 18 + TypeScript + Vite UI               │
                     │  (Tailwind, Lucide, Recharts, Interactive World Map)    │
                     └──────────────────────────┬─────────────────────────────┘
                                                │ REST API & WebSockets (Socket.io)
                                                ▼
                     ┌────────────────────────────────────────────────────────┐
                     │       Node.js / Express Backend & API Service          │
                     │  (/api/scenarios, /api/chat, /api/metrics, /api/agents) │
                     └──────────────────────────┬─────────────────────────────┘
                                                │
                                                ▼
                     ┌────────────────────────────────────────────────────────┐
                     │           Multi-Agent Orchestrator Engine              │
                     │         (Parallel Dispatch & Real-Time Sync)           │
                     └──────┬───────────┬───────────┬───────────┬─────────────┘
                            │           │           │           │             │
   ┌────────────────────────┴─┐ ┌───────┴────────┐ ┌┴───────────┴──┐ ┌────────┴───────┐ ┌┴─────────────────────┐
   │ 1. Geo Risk Agent        │ │ 2. Disruption  │ │ 3. Procurement│ │ 4. Reserves    │ │ 5. Digital Twin     │
   │ - Chokepoint status      │ │    Impact      │ │    & Routing  │ │    Optimization│ │    & Bottlenecks    │
   │ - Geopolitical tension   │ │ - Refinery bpd │ │ - Supplier alt│ │ - SPR drawdown │ │ - Flow graph        │
   │ - Risk score (0-100)     │ │ - Price shock  │ │ - Freight cost│ │ - Buffer days  │ │ - Critical paths    │
   └──────────────────────────┘ └────────────────┘ └───────────────┘ └────────────────┘ └─────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ (Node v22 / v24 recommended)
- npm v10+

### 1. One-Click Launch (Windows)
Double-click `start-all.bat` (or run `start-all.ps1` in PowerShell). This launches both the backend and frontend servers simultaneously:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### 2. Manual Startup
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Deployment

To launch the full containerized environment with PostgreSQL, TimescaleDB, Redis, Backend API, and Frontend:

```bash
docker-compose up --build
```

Access the application at [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Configuration & Live LLM Keys

The platform features a **Dual-Engine Architecture**:
1. **Live Claude 3.5 Sonnet Integration**: If you have an Anthropic API key, open `backend/.env` and set:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
2. **High-Fidelity Offline Simulation Engine**: If no API key is provided, the system seamlessly operates on its built-in deterministic simulation models with complete real-time intelligence for all scenarios and copilot chats!

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & active agent models |
| `GET` | `/api/scenarios` | List all preset crisis scenarios |
| `GET` | `/api/scenarios/latest` | Retrieve latest multi-agent aggregated result |
| `POST` | `/api/scenarios/run/:id` | Execute a specific scenario simulation |
| `POST` | `/api/scenarios/run-custom` | Execute custom parameterized scenario |
| `POST` | `/api/chat` | Query the conversational AI Copilot |
| `GET` | `/api/metrics/chokepoints` | Get real-time maritime chokepoint data |
| `GET` | `/api/metrics/suppliers` | Get alternative crude supplier rankings |
| `GET` | `/api/metrics/spr` | Get SPR inventory & drawdown curves |
| `GET` | `/api/metrics/network` | Get supply chain digital twin node topology |
