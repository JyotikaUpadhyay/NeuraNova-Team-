import { io, Socket } from 'socket.io-client';
import { AgentThoughtLog, AggregatedScenarioResult } from '../types/index.js';

const SOCKET_URL = 'http://localhost:5000';

export function initSocket(
  onThoughtLog: (log: AgentThoughtLog) => void,
  onScenarioResult: (result: AggregatedScenarioResult) => void,
  onConnectionChange: (connected: boolean) => void
): Socket {
  const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    onConnectionChange(true);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    onConnectionChange(false);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    onConnectionChange(false);
  });

  socket.on('agent:thought', (log: AgentThoughtLog) => {
    onThoughtLog(log);
  });

  socket.on('scenario:result', (result: AggregatedScenarioResult) => {
    onScenarioResult(result);
  });

  return socket;
}