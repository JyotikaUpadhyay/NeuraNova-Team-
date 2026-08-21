# NeuraNova-Team-
# ⚡ NeuraNova Energy Supply Chain Resilience Platform

An autonomous multi-agent AI platform for energy supply chain risk analysis, geopolitical disruption simulation, supply shock forecasting, alternative procurement routing, and strategic reserve (SPR) optimization.

NeuraNova demonstrates how specialized AI agents can work together to analyze major energy disruptions and generate coordinated resilience strategies for decision-makers.

---

## 🚀 Live Demo

🌐 **Deployed Application:**  https://neura-nova-team.vercel.app

 Experience the complete NeuraNova multi-agent energy resilience platform through the live deployed prototype.

## 🌟 Key Capabilities

### 1. 🤖 5 Parallel Autonomous AI Agents

NeuraNova uses five specialized agents coordinated through a central multi-agent orchestrator.

#### 🌐 Geopolitical & Maritime Risk Agent

- Analyzes major global energy chokepoints including:
  - Strait of Hormuz
  - Bab el-Mandeb
  - Suez Canal
  - Strait of Malacca
  - Turkish Straits
  - Panama Canal
- Evaluates maritime disruption scenarios.
- Calculates geopolitical and maritime threat scores from `0–100`.
- Identifies alternate maritime and pipeline routes.

#### 💥 Disruption & Price Shock Agent

- Estimates crude oil supply deficits in barrels per day (bpd).
- Models refinery disruptions and capacity losses.
- Calculates global supply deficit percentages.
- Simulates potential commodity price shocks for:
  - Brent
  - WTI
  - TTF Gas
  - Diesel
- Generates confidence ranges for projected prices.

#### 🚢 Strategic Procurement & Routing Agent

- Evaluates alternative energy suppliers and crude grades.
- Compares:
  - Available supply capacity
  - Lead times
  - Freight cost changes
  - Landed cost
  - Contract flexibility
  - Feasibility scores
- Generates ranked procurement alternatives.
- Recommends alternative supply allocations and routing strategies.

Example alternatives include:

- US Gulf Coast / WTI Midland
- West African crude
- Brazilian offshore supply
- Saudi East-West Pipeline bypass
- North Sea supply

#### 🛢️ Strategic Reserves (SPR) Agent

- Estimates strategic reserve requirements during disruption scenarios.
- Calculates post-disruption buffer coverage.
- Recommends emergency drawdown rates.
- Models reserve depletion trajectories.
- Generates reserve release and replenishment recommendations.

#### 🕸️ Digital Twin & Bottleneck Agent

Simulates the energy supply chain topology:

`Extraction Fields → Export Terminals → Shipping Corridors → Refineries → Demand Centers`

The agent:

- Detects stressed transportation corridors.
- Identifies critical network bottlenecks.
- Calculates network resilience.
- Recommends flow adjustments and bypass strategies.

---

## 💬 Intelligent AI Copilot

NeuraNova includes a conversational AI Copilot designed for energy economics, logistics, and disruption analysis.

Capabilities include:

- Natural-language interaction with scenario results.
- Agent reasoning summaries.
- Agent execution and event logs.
- Recommended mitigation actions.
- Scenario-based analysis.
- Structured resilience reports.
- Interaction with the multi-agent orchestration layer.

The Copilot can operate using the built-in simulation engine without requiring an external LLM API.

Optional external LLM integration can also be configured where supported.

---

## 🌍 Interactive Maritime World Map & Flow Topography

NeuraNova provides an interactive maritime visualization for major global energy corridors.

Features include:

- Interactive Leaflet-based world map.
- Scenario-driven chokepoint status indicators:
  - 🔴 Blocked
  - 🟠 Restricted
  - 🟢 Open
- Alternative maritime routing visualization.
- Additional transit-time estimates.
- Refinery and infrastructure risk telemetry.
- Supply-chain disruption visualization.

All scenario information displayed by the prototype is generated through the NeuraNova simulation engine unless an external live data source is explicitly configured.

---

## 📊 Executive Decision Dashboard

The Executive Dashboard consolidates outputs from all agents into a single decision-support interface.

Key indicators include:

- Threat Index
- Supply Deficit
- Global Supply Impact
- Projected Brent Price Shock
- Strategic Reserve Buffer
- Procurement Replacement Coverage
- Futures Volatility
- Cross-Agent Action Plan

The goal is to transform multiple independent risk signals into one coordinated resilience strategy.

---

## 🧠 Multi-Agent Orchestration

The central orchestrator executes specialized agents and aggregates their outputs into a unified scenario result.

A typical workflow is:

```text
Crisis Scenario
      │
      ▼
Multi-Agent Orchestrator
      │
      ├── Geopolitical Risk Agent
      ├── Disruption Impact Agent
      ├── Procurement Agent
      ├── Strategic Reserves Agent
      └── Digital Twin Agent
      │
      ▼
Aggregated Intelligence
      │
      ▼
Executive Dashboard + AI Copilot
```

---

## 🏗️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────┐
│              React + TypeScript + Vite UI                  │
│     Tailwind CSS • Lucide • Recharts • Leaflet Map         │
└────────────────────────────┬───────────────────────────────┘
                             │
                    REST API + Socket.io
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│              Node.js / Express Backend API                 │
│                                                            │
│ /api/scenarios  /api/chat  /api/metrics  /api/agents       │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│               Multi-Agent Orchestrator                     │
│          Parallel Dispatch & Result Aggregation            │
└──────────┬──────────┬──────────┬──────────┬────────────────┘
           │          │          │          │
           ▼          ▼          ▼          ▼          ▼
      Geo Risk   Disruption  Procurement  Reserves  Digital Twin
       Agent       Agent        Agent       Agent       Agent
           │          │          │          │          │
           └──────────┴──────────┴──────────┴──────────┘
                             │
                             ▼
                 Aggregated Scenario Result
                             │
                             ▼
               Dashboard + AI Copilot + Map
```

### Technology Stack

#### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Recharts
- Leaflet
- Socket.io Client

#### Backend

- Node.js
- Express
- TypeScript
- Socket.io
- Multi-Agent Orchestration Engine

---

## 🚨 Example Scenario: Strait of Hormuz Total Blockade

One of the included scenarios simulates a complete disruption of the Strait of Hormuz.

The system evaluates:

1. Maritime chokepoint disruption.
2. Potential crude supply loss.
3. Refinery exposure.
4. Commodity price impact.
5. Alternative crude suppliers.
6. Maritime and pipeline bypass options.
7. Strategic reserve requirements.
8. Supply-chain network bottlenecks.

The five agents analyze the scenario and generate a coordinated response plan.

Example outputs may include:

```text
Threat Index: 96 / 100
Threat Level: CRITICAL

Estimated Supply Deficit: 17.5M bpd

Projected Brent Peak:
$138 / barrel

Alternative Procurement:
Atlantic Basin + Pipeline Bypass Routes

Strategic Reserve Recommendation:
Emergency SPR Drawdown

Network Response:
Dynamic supply rerouting and bottleneck mitigation
```

> These values are simulation outputs used to demonstrate the decision-support capabilities of the prototype and should not be interpreted as live market forecasts.

---

## 🚀 Quick Start — Local Development

### Prerequisites

Make sure the following are installed:

- Node.js v18+
- npm

Node.js v22+ is recommended.

---

### 1. One-Click Launch — Windows

From the project root, run:

```bash
start-all.bat
```

Or use:

```powershell
.\start-all.ps1
```

This starts both the backend and frontend services.

After startup:

**Frontend Dashboard**

```text
http://localhost:5173
```

**Backend API**

```text
http://localhost:5000
```

**Backend Health Check**

```text
http://localhost:5000/api/health
```

---

### 2. Manual Startup

#### Backend

```bash
cd backend/src
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

#### Frontend

Open another terminal:

```bash
cd frontend/src
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🔍 Verify Installation

After starting the application, open:

```text
http://localhost:5000/api/health
```

A successful response should look similar to:

```json
{
  "status": "ok",
  "service": "NeuraNova Backend"
}
```

To inspect the latest multi-agent scenario result:

```text
http://localhost:5000/api/scenarios/latest
```

---

## ⚙️ Simulation & Optional LLM Configuration

NeuraNova is designed to work without requiring a paid external AI API.

### Built-In Simulation Engine

When no external LLM is configured, the system operates using its deterministic scenario simulation engine.

The engine provides:

- Geopolitical risk simulation
- Supply deficit estimation
- Price-shock modeling
- Procurement ranking
- Strategic reserve calculations
- Digital twin network analysis
- Scenario-based resilience recommendations

This allows the complete prototype to be demonstrated offline without an external LLM dependency.

### Optional External LLM Integration

Where an external LLM integration is configured, environment variables should be stored securely in:

```text
backend/src/.env
```

Example:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

> Never commit API keys or secrets to GitHub.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend service health |
| `GET` | `/api/scenarios` | List preset crisis scenarios |
| `GET` | `/api/scenarios/latest` | Latest aggregated multi-agent result |
| `POST` | `/api/scenarios/run/:id` | Execute a preset scenario |
| `POST` | `/api/scenarios/run-custom` | Execute a custom scenario |
| `POST` | `/api/chat` | Query the AI Copilot |
| `GET` | `/api/agents/metadata` | Agent metadata and status |
| `GET` | `/api/metrics/chokepoints` | Chokepoint simulation data |
| `GET` | `/api/metrics/suppliers` | Alternative supplier rankings |
| `GET` | `/api/metrics/spr` | Strategic reserve metrics |
| `GET` | `/api/metrics/network` | Digital twin network topology |

---

## 📁 Project Structure

```text
NeuraNova-Team-/
│
├── backend/
│   └── src/
│       ├── agents/
│       │   ├── base.ts
│       │   ├── chatCopilotAgent.ts
│       │   ├── digitalTwinAgent.ts
│       │   ├── disruptionImpactAgent.ts
│       │   ├── geoRiskAgent.ts
│       │   ├── procurementAgent.ts
│       │   └── reservesAgent.ts
│       │
│       ├── data/
│       ├── orchestrator/
│       │   └── agentOrchestrator.ts
│       │
│       ├── routes/
│       │   ├── agentRoutes.ts
│       │   ├── chatRoutes.ts
│       │   ├── metricsRoutes.ts
│       │   └── scenarioRoutes.ts
│       │
│       ├── types/
│       ├── server.ts
│       ├── package.json
│       └── tsconfig.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AgentCommandCenter.tsx
│       │   ├── AICopilotChat.tsx
│       │   ├── ExecutiveOverview.tsx
│       │   ├── Header.tsx
│       │   ├── InteractiveSupplyMap.tsx
│       │   ├── NetworkGraphView.tsx
│       │   ├── ProcurementMatrix.tsx
│       │   ├── ReservesModeler.tsx
│       │   ├── ScenarioComparison.tsx
│       │   └── ScenarioSimulator.tsx
│       │
│       ├── services/
│       ├── types/
│       └── App.tsx
│
├── start-all.bat
├── start-all.ps1
└── README.md
```

---

## 🔄 System Workflow

```text
1. User selects or creates a disruption scenario
                       ↓
2. Backend sends scenario to Multi-Agent Orchestrator
                       ↓
3. Specialized agents analyze different dimensions
                       ↓
4. Agent outputs are synchronized and aggregated
                       ↓
5. Cross-agent mitigation strategy is generated
                       ↓
6. Dashboard receives updated results
                       ↓
7. AI Copilot allows interactive exploration
```

---

## 🎯 Problem Statement

Global energy supply chains are highly vulnerable to geopolitical conflicts, maritime chokepoint disruptions, refinery outages, transportation bottlenecks, and sudden commodity price shocks.

Traditional monitoring systems often analyze these risks independently.

NeuraNova explores a different approach:

> **What if multiple specialized AI agents could analyze an energy crisis simultaneously and automatically generate a coordinated resilience strategy?**

The platform combines geopolitical risk, disruption forecasting, procurement optimization, strategic reserve planning, and digital-twin network analysis into a unified decision-support system.

---

## 💡 Proposed Solution

NeuraNova acts as an AI-powered energy resilience command center.

Instead of providing only an alert such as:

```text
"Strait of Hormuz disrupted."
```

the platform attempts to answer:

```text
What happened?
       ↓
How serious is it?
       ↓
How much supply could be affected?
       ↓
Which infrastructure is exposed?
       ↓
What could happen to commodity prices?
       ↓
Where can replacement supply come from?
       ↓
Which alternative routes are available?
       ↓
How much strategic reserve should be released?
       ↓
What coordinated action should decision-makers take?
```

This converts disruption detection into actionable resilience planning.

---

## ⚠️ Prototype & Data Disclaimer

NeuraNova is a hackathon prototype and decision-support simulation platform.

Unless explicitly connected to an external live data provider:

- Chokepoint conditions are scenario-driven.
- Commodity price projections are simulated.
- Refinery disruptions are modeled.
- Procurement recommendations are generated from prototype datasets.
- Strategic reserve calculations are simulation outputs.

The system is intended to demonstrate the architecture and potential of autonomous multi-agent decision support for energy supply-chain resilience.

---

## 🔮 Future Scope

Future versions of NeuraNova could integrate:

- Live AIS vessel tracking
- Satellite imagery
- Real-time commodity market feeds
- Refinery outage databases
- Weather and cyclone intelligence
- Port congestion data
- News and geopolitical intelligence feeds
- Machine-learning-based disruption forecasting
- Historical scenario backtesting
- Real-time optimization algorithms
- Government and enterprise alerting systems

---

## 🏆 Hackathon Prototype

**NeuraNova — Autonomous Multi-Agent Energy Supply Chain Resilience Platform**

Built to demonstrate how autonomous AI agents, simulation, digital twins, and decision-support systems can work together to improve resilience against global energy supply disruptions.

---

## 👥 Team

**NeuraNova Team**

---

## 📜 License

This project was developed as a hackathon prototype for educational, research, and demonstration purposes.
