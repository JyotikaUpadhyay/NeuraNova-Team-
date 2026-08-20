"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
class BaseAgent {
    agentId;
    agentName;
    anthropicClient = null;
    isUsingClaude = false;
    constructor(agentId, agentName) {
        this.agentId = agentId;
        this.agentName = agentName;
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_api_key')) {
            try {
                this.anthropicClient = new sdk_1.default({ apiKey });
                this.isUsingClaude = true;
            }
            catch (err) {
                console.warn(`[${agentName}] Failed to initialize Anthropic client:`, err);
                this.anthropicClient = null;
                this.isUsingClaude = false;
            }
        }
    }
    isClaudeAvailable() {
        return this.isUsingClaude && this.anthropicClient !== null;
    }
    getAgentMetadata() {
        return {
            agentId: this.agentId,
            agentName: this.agentName,
            isUsingClaude: this.isClaudeAvailable(),
            model: this.isClaudeAvailable() ? 'claude-3-5-sonnet-20241022' : 'neuranova-sim-v2'
        };
    }
    createLog(type, content, metadata) {
        return {
            id: `${this.agentId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: new Date().toISOString(),
            agentId: this.agentId,
            agentName: this.agentName,
            type,
            content,
            metadata
        };
    }
    async queryClaude(systemPrompt, userPrompt) {
        if (!this.anthropicClient) {
            throw new Error('Anthropic client is not initialized');
        }
        const response = await this.anthropicClient.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            temperature: 0.2,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
        });
        const textBlocks = response.content.filter(block => block.type === 'text');
        return textBlocks.map(b => b.text).join('\n');
    }
    parseJsonFromLlm(text, fallback) {
        try {
            // Find JSON markdown fence or raw JSON
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                return JSON.parse(jsonStr);
            }
            return JSON.parse(text);
        }
        catch (err) {
            console.warn(`[${this.agentName}] JSON parse failure, falling back to simulation data:`, err);
            return fallback;
        }
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.BaseAgent = BaseAgent;
