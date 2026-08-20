"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatRouter = createChatRouter;
const express_1 = require("express");
function createChatRouter(orchestrator) {
    const router = (0, express_1.Router)();
    const chatHistory = [];
    // Seed with initial welcome message
    if (chatHistory.length === 0) {
        chatHistory.push({
            id: 'init-1',
            role: 'assistant',
            content: `### 👋 Welcome to NeuraNova Energy Resilience Intelligence Copilot

I am your autonomous **Supply Chain Resilience Copilot**, powered by 5 specialized AI agents monitoring global chokepoints, refining assets, alternative procurement, and SPR reserves.

You can speak with me naturally, for example:
* *"Simulate a complete blockade of the Strait of Hormuz"*
* *"What is our current SPR buffer and optimal drawdown trajectory?"*
* *"Compare landed costs and lead times for replacement crude suppliers"*
* *"Generate an executive resilience briefing"*`,
            timestamp: new Date().toISOString(),
            suggestedActions: [
                'Trigger Strait of Hormuz Blockade',
                'Simulate Red Sea Missile Escalation',
                'Show Strategic Petroleum Reserve (SPR) status',
                'Find alternative crude suppliers'
            ]
        });
    }
    // Get chat history
    router.get('/history', (_req, res) => {
        res.json({
            success: true,
            messages: chatHistory
        });
    });
    // Post chat message
    router.post('/', async (req, res) => {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            res.status(400).json({ success: false, error: 'Message text is required' });
            return;
        }
        const userMsg = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        chatHistory.push(userMsg);
        try {
            const activeResult = orchestrator.getLatestResult();
            const copilot = orchestrator.getCopilotAgent();
            const { message: reply, actionTaken } = await copilot.chat(message, chatHistory, activeResult);
            chatHistory.push(reply);
            res.json({
                success: true,
                message: reply,
                actionTaken
            });
        }
        catch (err) {
            console.error('Chat copilot error:', err);
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    });
    // Clear chat
    router.post('/clear', (_req, res) => {
        chatHistory.splice(0, chatHistory.length);
        res.json({ success: true });
    });
    return router;
}
