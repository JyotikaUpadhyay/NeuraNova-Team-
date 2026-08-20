"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCopilotAgent = void 0;
const base_js_1 = require("./base.js");
class ChatCopilotAgent extends base_js_1.BaseAgent {
    constructor() {
        super('chat-copilot-agent', 'Energy Intelligence AI Copilot');
    }
    async chat(userMessage, history, activeResult, onStreamChunk) {
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const lower = userMessage.toLowerCase();
        let actionTaken = undefined;
        let toolCalls = [];
        const thoughtProcess = [];
        let content = '';
        let suggestedActions = [];
        thoughtProcess.push('Analyzing query intent and domain context...');
        // 1. Hormuz Blockade Intent
        if (lower.includes('hormuz') && (lower.includes('trigger') || lower.includes('simulate') || lower.includes('run') || lower.includes('blockade') || lower.includes('close') || lower.includes('what if') || lower.includes('closed') || lower.includes('attack'))) {
            thoughtProcess.push('Detected intent: Trigger Strait of Hormuz Blockade scenario');
            thoughtProcess.push('Invoking Agent Orchestrator for 5 parallel AI agents...');
            toolCalls.push({
                toolName: 'orchestrator.triggerScenario',
                params: { scenarioId: 'hormuz_closed' },
                resultSummary: 'Initiated 5 AI agents for 17.5M bpd Hormuz crisis.'
            });
            actionTaken = {
                type: 'TRIGGER_SCENARIO',
                payload: { scenarioId: 'hormuz_closed' }
            };
            content = `### 🚨 Hormuz Blockade Scenario Triggered

I have initiated a full multi-agent simulation for the **Strait of Hormuz Total Blockade**. 

#### **Key Impacts Forecasted:**
* **Net Supply Loss:** **17.5 Million bpd** (~17.2% of global supply)
* **Brent Price Projection:** Spikes from **$82.50** to **$138.00/bbl (+67.3%)**
* **SPR Strategy:** Authorizing **2.5 MMbbl/day emergency drawdown** across US Gulf Coast salt dome caverns.
* **Top Alternative Routing:** Surge crude flows through the **Saudi East-West Petroline (Yanbu Hub)** at 3.5M bpd and **US Gulf Coast VLCC loadings**.

Check the **Live Map** and **5-Agent Command Center** to inspect the real-time telemetry streams!`;
            suggestedActions = [
                'How many days of SPR reserves do we have remaining?',
                'What are the alternative crude sourcing options?',
                'Generate an Executive Incident Report for leadership'
            ];
        }
        // 2. Red Sea / Bab el-Mandeb Intent
        else if ((lower.includes('red sea') || lower.includes('bab el-mandeb') || lower.includes('houthi') || lower.includes('suez')) && (lower.includes('trigger') || lower.includes('simulate') || lower.includes('run') || lower.includes('missile') || lower.includes('drone') || lower.includes('crisis'))) {
            thoughtProcess.push('Detected intent: Trigger Red Sea Missile Escalation scenario');
            toolCalls.push({
                toolName: 'orchestrator.triggerScenario',
                params: { scenarioId: 'red_sea_crisis' },
                resultSummary: 'Initiated 5 AI agents for 4.8M bpd Red Sea diversion.'
            });
            actionTaken = {
                type: 'TRIGGER_SCENARIO',
                payload: { scenarioId: 'red_sea_crisis' }
            };
            content = `### 🌊 Red Sea Missile Escalation Scenario Triggered

I have triggered the multi-agent resilience model for the **Red Sea Missile Escalation & Tanker Boycott**.

#### **Key Impacts Forecasted:**
* **Chokepoint Status:** Bab el-Mandeb **RESTRICTED (-82% flow)**
* **Maritime Diversion:** 90% of Europe-bound tankers taking the **Cape of Good Hope route** (+12-14 transit days).
* **Freight Surcharge:** **+$3.50 to +$4.50 / bbl** bunker & war risk premium.
* **Sourcing Shift:** Pivot European refiners to **West African (Bonny Light)** and **US WTI Midland** to mitigate floating inventory delay.`;
            suggestedActions = [
                'Compare shipping costs for Cape vs Suez route',
                'Show impacted refineries in the Mediterranean',
                'Check SPR buffer cover days'
            ];
        }
        // 3. Cyberattack / Colonial Pipeline Intent
        else if (lower.includes('cyber') || lower.includes('pipeline') || lower.includes('colonial') || lower.includes('ransomware')) {
            thoughtProcess.push('Detected intent: Critical Pipeline Cyberattack scenario');
            toolCalls.push({
                toolName: 'orchestrator.triggerScenario',
                params: { scenarioId: 'colonial_cyberattack' },
                resultSummary: 'Initiated 5 AI agents for 2.5M bpd SCADA ransomware disruption.'
            });
            actionTaken = {
                type: 'TRIGGER_SCENARIO',
                payload: { scenarioId: 'colonial_cyberattack' }
            };
            content = `### 💻 Pipeline Cyberattack Scenario Triggered

I have activated the resilience protocol for the **Critical Pipeline Ransomware Outage**.

#### **Key Impacts Forecasted:**
* **Throughput Deficit:** **2.5 Million bpd** refined products (Gasoline & ULSD) halted across East Coast.
* **Refining Impact:** Port Arthur and Bayway refineries operating under localized dispatch constraints.
* **Crack Spread Volatility:** Ultra-low sulfur diesel crack spreads spike by **+50.0%**.
* **Mitigation Protocol:** Surging coastal Jones Act clean product tanker fixtures and releasing Northeast Gasoline Supply Reserves.`;
            suggestedActions = [
                'What are the alternative supply options for East Coast?',
                'Trigger North Sea Severe Storm Outage',
                'Show Network Bottlenecks Graph'
            ];
        }
        // 4. North Sea Severe Weather Intent
        else if (lower.includes('north sea') || lower.includes('storm') || lower.includes('arctic') || lower.includes('ekofisk')) {
            thoughtProcess.push('Detected intent: North Sea Severe Weather Outage scenario');
            toolCalls.push({
                toolName: 'orchestrator.triggerScenario',
                params: { scenarioId: 'north_sea_outage' },
                resultSummary: 'Initiated 5 AI agents for 1.8M bpd North Sea offshore outage.'
            });
            actionTaken = {
                type: 'TRIGGER_SCENARIO',
                payload: { scenarioId: 'north_sea_outage' }
            };
            content = `### ❄️ North Sea Severe Storm Scenario Triggered

I have launched the multi-agent analysis for the **North Sea Severe Storm & Offshore Terminal Failure**.

#### **Key Impacts Forecasted:**
* **Net Supply Loss:** **1.8 Million bpd** North Sea crude (Forties & Ekofisk blends).
* **Projected Duration:** 21 days for platform riser structural repairs.
* **Price Volatility:** TTF European Natural Gas jumps **+42.6%**; Brent crude surges to **$92.00/bbl**.
* **Refinery Response:** Rotterdam and Mongstad refineries pivot to US WTI Midland and West African imports.`;
            suggestedActions = [
                'Rank replacement suppliers for European refineries',
                'Check SPR drawdown recommendation',
                'Simulate Panama Canal Drought'
            ];
        }
        // 5. Panama Canal Drought Intent
        else if (lower.includes('panama') || lower.includes('drought') || lower.includes('gatun')) {
            thoughtProcess.push('Detected intent: Panama Canal Drought scenario');
            toolCalls.push({
                toolName: 'orchestrator.triggerScenario',
                params: { scenarioId: 'panama_canal_drought' },
                resultSummary: 'Initiated 5 AI agents for 1.2M bpd Panama transit halving.'
            });
            actionTaken = {
                type: 'TRIGGER_SCENARIO',
                payload: { scenarioId: 'panama_canal_drought' }
            };
            content = `### ☀️ Panama Canal Drought Scenario Triggered

I have engaged the simulation model for the **Panama Canal Severe Drought Transit Halving**.

#### **Key Impacts Forecasted:**
* **Chokepoint Status:** Panama Canal **CONGESTED (-55% flow)**.
* **Vessel Impact:** Neo-Panamax booking slots reduced from 36 to 18 daily transits.
* **LNG Rerouting:** US Gulf LNG exports to East Asia diverted via Suez Eastbound or Cape of Good Hope (+18 extra transit days).
* **Logistics Delta:** Adds $1.80/MMBtu in voyage shipping freight costs.`;
            suggestedActions = [
                'Show alternative LNG shipping corridors',
                'Trigger Strait of Hormuz Total Blockade',
                'Generate Executive Resilience Briefing'
            ];
        }
        // 6. SPR & Reserves Inquiry
        else if (lower.includes('spr') || lower.includes('reserve') || lower.includes('stockpile') || lower.includes('drawdown') || lower.includes('days of cover')) {
            thoughtProcess.push('Querying Strategic Petroleum Reserve (SPR) models and inventory metrics...');
            toolCalls.push({
                toolName: 'reservesAgent.calculateDrawdownCurve',
                params: { targetDays: 90 },
                resultSummary: 'Current SPR: 375M bbl. Max drawdown rate: 2.5M bpd.'
            });
            const bufferDays = activeResult ? activeResult.reserves.postDisruptionBufferDays : 185;
            const rate = activeResult ? activeResult.reserves.recommendedDrawdownRateMbblDay : 1.0;
            content = `### 🛢️ Strategic Petroleum Reserve (SPR) Intelligence

* **Current US SPR Inventory:** **375.0 Million Barrels**
* **Baseline Coverage:** ~557 Net Import Days (or ~185 Gross Days at current demand)
* **Post-Disruption Buffer:** **${bufferDays} Days**
* **Recommended Drawdown Rate:** **${rate} MMbbl / day**

#### **Drawdown Strategy & Trigger Matrix:**
1. **Phase 1 (Days 1–30):** Surge release at **${rate} MMbbl/d** across Bryan Mound, Big Hill, and West Hackberry salt domes.
2. **Phase 2 (Days 31–90):** Step-down release to **1.0 MMbbl/d** as replacement Atlantic Basin cargoes arrive.
3. **Refill Mandate:** Automatic buy-back contracts initiate when prompt WTI drops below **$72.00/bbl**.`;
            suggestedActions = [
                'What happens if the crisis lasts 180 days?',
                'Show SPR Drawdown Trajectory Chart',
                'Trigger Hormuz Total Blockade simulation'
            ];
        }
        // 7. Procurement & Sourcing Inquiry
        else if (lower.includes('procurement') || lower.includes('alternative') || lower.includes('supplier') || lower.includes('source') || lower.includes('cargo') || lower.includes('wti')) {
            thoughtProcess.push('Analyzing alternative supply arbitrage and freight matrix...');
            toolCalls.push({
                toolName: 'procurementAgent.rankSuppliers',
                params: { maxLeadTimeDays: 25 },
                resultSummary: 'Ranked 5 alternative supply hubs by landed cost.'
            });
            content = `### 🚢 Alternative Supply & Procurement Matrix

Here are the top replacement crude sources ranked by feasibility and landed cost differential:

| Supplier Hub | Grade | Available (bpd) | Lead Time | Landed Cost | Feasibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US Gulf Coast** | WTI Midland | 2,400,000 | 14 days | $84.50/bbl | **94%** |
| **Saudi Petroline (Yanbu)** | Arab Light | 3,500,000 | 12 days | $83.90/bbl | **91%** |
| **West Africa (Nigeria/Angola)** | Bonny Light | 1,100,000 | 18 days | $86.20/bbl | **88%** |
| **Petrobras (Brazil Santos)** | Búzios / Tupi | 950,000 | 22 days | $85.10/bbl | **86%** |
| **North Sea Cluster** | Forties / Ekofisk | 650,000 | 6 days | $88.40/bbl | **82%** |

**Recommended Action:** Secure prompt fixtures from **US Gulf Coast** and **Saudi Yanbu Red Sea Bypass** to replace lost Persian Gulf maritime volumes.`;
            suggestedActions = [
                'Calculate total landed cost for 500,000 bpd US Gulf order',
                'Which crude grade matches Middle Eastern Heavy?',
                'Export Procurement Allocation Sheet'
            ];
        }
        // 8. Executive Report Inquiry
        else if (lower.includes('report') || lower.includes('brief') || lower.includes('summary') || lower.includes('executive')) {
            thoughtProcess.push('Compiling cross-agent Executive Resilience Brief...');
            toolCalls.push({
                toolName: 'reportGenerator.compileExecutiveBrief',
                params: { format: 'markdown' },
                resultSummary: 'Compiled 5-agent intelligence briefing.'
            });
            actionTaken = { type: 'GENERATE_REPORT' };
            content = `### 📋 Executive Briefing: Global Energy Supply Chain Resilience

**Status:** ${activeResult ? activeResult.geoRisk.threatLevel : 'ELEVATED MONITORING'}  
**Active Scenario:** ${activeResult ? activeResult.scenarioName : 'Baseline Global Telemetry'}  
**System Risk Index:** ${activeResult ? activeResult.geoRisk.overallRiskScore : 38}/100

---

#### **1. Maritime & Geopolitical Posture**
* **Chokepoint Vulnerability:** ${activeResult ? activeResult.geoRisk.reroutingSummary : '6 major global maritime chokepoints monitored; Red Sea/Bab el-Mandeb in restricted status.'}
* **Fleet Congestion:** **${activeResult ? activeResult.geoRisk.vesselCongestionIndex : 45}%** fleet capacity currently under transit delay.

#### **2. Refining & Commodity Pricing Impact**
* **Projected Peak Brent:** **$${activeResult ? activeResult.disruptionImpact.priceShocks[0]?.projectedPeak : 86.50}/bbl** (${activeResult ? '+' + activeResult.disruptionImpact.priceShocks[0]?.changePercent + '%' : '+4.8%'})
* **Supply Deficit:** **${activeResult ? (activeResult.disruptionImpact.crudeDeficitBpd / 1_000_000).toFixed(1) : '0.0'}M bpd**

#### **3. Strategic Recommendations**
1. **Supply Replacement:** Execute spot tenders for **2.4M bpd** from US Gulf Coast and West Africa.
2. **Buffer Inventory:** Maintain minimum **${activeResult ? activeResult.reserves.postDisruptionBufferDays : 185} days** of strategic cover.
3. **Logistics Optimization:** Re-route Asia-bound cargoes to bypass congested maritime straits.`;
            suggestedActions = [
                'What are the immediate next steps for the trading desk?',
                'Simulate Colonial Pipeline Cyberattack',
                'Show Network Bottlenecks Graph'
            ];
        }
        // Default Helpful Assistant
        else {
            thoughtProcess.push('Synthesizing conversational response across energy resilience knowledge base...');
            content = `Hello! I am your **Energy Supply Chain AI Copilot**, connected to 5 specialized intelligence agents:

1. **🌐 Geopolitical & Maritime Risk Agent** (AIS tracking, chokepoints, war-risk zones)
2. **💥 Disruption Impact Agent** (Refinery outages, throughput deficits, price shock projections)
3. **🚢 Procurement & Sourcing Agent** (Alternative suppliers, freight parity, landed costs)
4. **🛢️ Strategic Reserves (SPR) Agent** (Drawdown schedules, buffer days, refill triggers)
5. **🕸️ Digital Twin Network Agent** (Supply chain topology, bottleneck identification)

**You can command me to simulate scenarios or analyze data:**
* *"Trigger the Strait of Hormuz Blockade"*
* *"Simulate the Red Sea missile crisis"*
* *"Simulate Colonial Pipeline cyberattack"*
* *"What is our current SPR buffer days?"*
* *"Show alternative crude suppliers and lead times"*
* *"Generate an executive resilience briefing"*`;
            suggestedActions = [
                'Trigger Strait of Hormuz Blockade',
                'Simulate Red Sea Missile Escalation',
                'What is our current SPR buffer days?',
                'Show Alternative Procurement Matrix'
            ];
        }
        if (this.isClaudeAvailable()) {
            try {
                const systemPrompt = `You are an elite Energy Supply Chain AI Copilot (like ChatGPT, but specialized in energy economics, crude oil logistics, maritime chokepoints, refining, and SPR resilience).
Active Scenario: ${activeResult ? JSON.stringify(activeResult.scenarioName) : 'None'}
Respond with authoritative, concise, structured markdown including tables and bold figures where helpful.`;
                const llmAnswer = await this.queryClaude(systemPrompt, userMessage);
                if (llmAnswer && llmAnswer.trim().length > 30) {
                    content = llmAnswer;
                }
            }
            catch (err) {
                console.warn('Claude chat error, using expert rule engine response:', err);
            }
        }
        const outputMessage = {
            id: messageId,
            role: 'assistant',
            content,
            timestamp: new Date().toISOString(),
            thoughtProcess,
            toolCalls,
            suggestedActions,
            activeScenarioContext: activeResult?.scenarioId
        };
        return {
            message: outputMessage,
            actionTaken
        };
    }
}
exports.ChatCopilotAgent = ChatCopilotAgent;
