import { Router, Request, Response } from 'express';

interface ChatOrchestrator {
  getLatestResult(): any;
  getCopilotAgent(): {
    chat(
      message: string,
      history: ChatMessage[],
      activeResult: any
    ): Promise<{
      message: ChatMessage;
      actionTaken?: any;
    }>;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

export function createChatRouter(orchestrator: ChatOrchestrator) {
  const router = Router();

  const chatHistory: ChatMessage[] = [];

  // Initial welcome message
  chatHistory.push({
    id: 'init-1',
    role: 'assistant',
    content: `### 👋 Welcome to NeuraNova Energy Resilience Intelligence Copilot

I am your autonomous **Supply Chain Resilience Copilot**, powered by specialized AI agents analyzing global energy supply-chain disruptions.

You can ask questions such as:

- "Simulate a complete blockade of the Strait of Hormuz"
- "What is our current SPR buffer?"
- "Compare alternative crude suppliers"
- "Generate an executive resilience briefing"`,
    timestamp: new Date().toISOString(),
    suggestedActions: [
      'Trigger Strait of Hormuz Blockade',
      'Simulate Red Sea Missile Escalation',
      'Show Strategic Petroleum Reserve status',
      'Find alternative crude suppliers'
    ]
  });

  // Get chat history
  router.get('/history', (_req: Request, res: Response) => {
    res.json({
      success: true,
      messages: chatHistory
    });
  });

  // Send chat message
  router.post('/', async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Message text is required'
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    chatHistory.push(userMessage);

    try {
      const activeResult = orchestrator.getLatestResult();
      const copilot = orchestrator.getCopilotAgent();

      const result = await copilot.chat(
        message,
        chatHistory,
        activeResult
      );

      const reply = result.message;
      const actionTaken = result.actionTaken;

      chatHistory.push(reply as ChatMessage);

      res.json({
        success: true,
        message: reply,
        actionTaken
      });
    } catch (error: unknown) {
      console.error('Chat copilot error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown chat copilot error';

      res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  });

  // Clear chat history
  router.post('/clear', (_req: Request, res: Response) => {
    chatHistory.splice(0, chatHistory.length);

    res.json({
      success: true
    });
  });

  return router;
}

export default createChatRouter;