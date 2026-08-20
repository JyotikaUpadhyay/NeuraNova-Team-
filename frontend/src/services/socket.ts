import { io, Socket } from 'socket.io-client';
import { AggregatedScenarioResult, AgentThoughtLog } from '../types/index.js';

let socket: Socket | null = null;

export const initSocket = (
  onThoughtLog: (log: AgentThoughtLog) => void,
  onScenarioCompleted: (result: AggregatedScenarioResult) => void,
  onConnectionChange: (connected: boolean) => void
): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(window.location.origin, {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server');
    onConnectionChange(true);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
    onConnectionChange(false);
  });

  socket.on('agent:thought', (log: AgentThoughtLog) => {
    onThoughtLog(log);
  });

  socket.on('scenario:completed', (result: AggregatedScenarioResult) => {
    onScenarioCompleted(result);
  });

  socket.on('scenario:latest', (result: AggregatedScenarioResult) => {
    onScenarioCompleted(result);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
