export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ChokepointStatus = 'OPEN' | 'CONGESTED' | 'RESTRICTED' | 'BLOCKED';

export interface ChokepointData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dailyFlowMbpd: number;
  globalSharePercent: number;
  status: ChokepointStatus;
  transitFlowDropPercent: number;
  riskScore: number;
  incidentSummary: string;
  alternateRoute: string;
  extraTransitDays: number;
}

export interface Scenario {
  id: string;
  name: string;
  category: 'GEOPOLITICAL' | 'MILITARY' | 'WEATHER' | 'CYBER' | 'INFRASTRUCTURE';
  description: string;
  region: string;
  severity: ThreatLevel;
  disruptedChokepoints: string[];
  disruptedRefineries: string[];
  estimatedBpdDeficit: number;
  projectedDurationDays: number;
}

export interface AgentThoughtLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'thought' | 'tool_call' | 'tool_result' | 'metric' | 'warning' | 'recommendation';
  content: string;
  metadata?: Record<string, any>;
}

export interface GeoRiskOutput {
  overallRiskScore: number;
  threatLevel: ThreatLevel;
  chokepoints: ChokepointData[];
  vesselCongestionIndex: number;
  reroutingSummary: string;
  reasoning: string[];
  confidenceScore: number;
}

export interface RefineryDisruption {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  capacityBpd: number;
  outagePercent: number;
  estimatedRestartDays: number;
}

export interface PriceShock {
  benchmark: 'BRENT' | 'WTI' | 'TTF_GAS' | 'DIESEL';
  currentPrice: number;
  projectedPeak: number;
  changePercent: number;
  confidenceInterval: [number, number];
}

export interface DisruptionImpactOutput {
  crudeDeficitBpd: number;
  lngDeficitBcfd: number;
  affectedRefineries: RefineryDisruption[];
  priceShocks: PriceShock[];
  globalSupplyDeficitPercent: number;
  reasoning: string[];
  confidenceScore: number;
}

export interface SupplierAlternative {
  id: string;
  supplier: string;
  originCountry: string;
  originPort: string;
  lat: number;
  lng: number;
  crudeGrade: string;
  availableCapacityBpd: number;
  leadTimeDays: number;
  deltaLeadTimeDays: number;
  freightCostDeltaPerBbl: number;
  totalLandedCostPerBbl: number;
  feasibilityScore: number;
  contractFlexibility: 'SPOT' | 'SHORT_TERM' | 'TERM';
}

export interface RecommendedAllocation {
  supplier: string;
  volumeBpd: number;
  priority: number;
  rationale: string;
}

export interface ProcurementOutput {
  rankedAlternatives: SupplierAlternative[];
  recommendedAllocations: RecommendedAllocation[];
  averageLandedCostIncrease: number;
  supplyReplacementCoveragePercent: number;
  reasoning: string[];
  confidenceScore: number;
}

export interface SprTrajectoryPoint {
  day: number;
  remainingSprMbbl: number;
  bufferDaysCover: number;
  marketPriceEstimate: number;
}

export interface ReplenishmentTrigger {
  triggerPriceUsd: number;
  recommendedRefillRateMbblDay: number;
  targetBufferDays: number;
  notes: string;
}

export interface ReservesOutput {
  currentSprStockpileMbbl: number;
  baselineDaysCover: number;
  postDisruptionBufferDays: number;
  recommendedDrawdownRateMbblDay: number;
  projectedTrajectory: SprTrajectoryPoint[];
  replenishmentTriggers: ReplenishmentTrigger;
  emergencyReleaseRecommended: boolean;
  reasoning: string[];
  confidenceScore: number;
}

export interface BottleneckPath {
  id: string;
  source: string;
  chokepoint: string;
  destination: string;
  capacityUtilizationPercent: number;
  riskWeight: number;
  status: 'OPTIMAL' | 'STRESSED' | 'CRITICAL';
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'FIELD' | 'CHOKEPOINT' | 'TERMINAL' | 'REFINERY' | 'CONSUMER_HUB';
  lat: number;
  lng: number;
  capacityBpd: number;
  currentThroughputBpd: number;
  utilizationPercent: number;
  status: 'HEALTHY' | 'WARNING' | 'COMPROMISED';
}

export interface NetworkFlowAdjustment {
  routeId: string;
  action: 'REROUTE' | 'THROTTLE' | 'SURGE' | 'INVENTORY_BUFFER';
  from: string;
  to: string;
  divertedVolumeBpd: number;
  details: string;
}

export interface DigitalTwinOutput {
  supplyChainVulnerabilityScore: number;
  networkResilienceIndex: number;
  bottleneckPaths: BottleneckPath[];
  nodes: NetworkNode[];
  recommendedFlowAdjustments: NetworkFlowAdjustment[];
  reasoning: string[];
  confidenceScore: number;
}

export interface AggregatedScenarioResult {
  scenarioId: string;
  scenarioName: string;
  timestamp: string;
  executionDurationMs: number;
  isSimulated: boolean;
  modelUsed: string;
  geoRisk: GeoRiskOutput;
  disruptionImpact: DisruptionImpactOutput;
  procurement: ProcurementOutput;
  reserves: ReservesOutput;
  digitalTwin: DigitalTwinOutput;
  executiveSummary: string;
  keyActionItems: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thoughtProcess?: string[];
  toolCalls?: {
    toolName: string;
    params?: any;
    resultSummary?: string;
  }[];
  suggestedActions?: string[];
  activeScenarioContext?: string;
}
