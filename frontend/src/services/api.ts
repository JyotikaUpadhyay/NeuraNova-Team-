import axios from 'axios';
import {
  AggregatedScenarioResult,
  ChatMessage,
  Scenario
} from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Scenarios
  getScenarios: async (): Promise<Scenario[]> => {
    const res = await axios.get(`${API_BASE}/scenarios`);
    return res.data.scenarios;
  },

  getLatestScenarioResult: async (): Promise<AggregatedScenarioResult> => {
    const res = await axios.get(`${API_BASE}/scenarios/latest`);
    return res.data.data;
  },

  runScenario: async (
    scenarioId: string
  ): Promise<AggregatedScenarioResult> => {
    const res = await axios.post(
      `${API_BASE}/scenarios/run/${scenarioId}`
    );
    return res.data.data;
  },

  runCustomScenario: async (
    scenarioData: Partial<Scenario>
  ): Promise<AggregatedScenarioResult> => {
    const res = await axios.post(
      `${API_BASE}/scenarios/run-custom`,
      scenarioData
    );
    return res.data.data;
  },

  // Copilot Chat
  getChatHistory: async (): Promise<ChatMessage[]> => {
    const res = await axios.get(`${API_BASE}/chat/history`);
    return res.data.messages;
  },

  sendMessage: async (
    message: string
  ): Promise<{
    message: ChatMessage;
    actionTaken?: any;
  }> => {
    const res = await axios.post(`${API_BASE}/chat`, {
      message
    });

    return res.data;
  },

  clearChat: async (): Promise<void> => {
    await axios.post(`${API_BASE}/chat/clear`);
  },

  // Metrics
  getChokepoints: async () => {
    const res = await axios.get(
      `${API_BASE}/metrics/chokepoints`
    );
    return res.data.data;
  },

  getSuppliers: async () => {
    const res = await axios.get(
      `${API_BASE}/metrics/suppliers`
    );
    return res.data.data;
  },

  getNetwork: async () => {
    const res = await axios.get(
      `${API_BASE}/metrics/network`
    );
    return res.data.data;
  },

  getSpr: async () => {
    const res = await axios.get(
      `${API_BASE}/metrics/spr`
    );
    return res.data.data;
  },

  getAgentMetadata: async () => {
    const res = await axios.get(
      `${API_BASE}/agents/metadata`
    );
    return res.data.agents;
  }
};