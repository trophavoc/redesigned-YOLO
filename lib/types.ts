export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DetectionSummary = {
  pedestrians: number;
  roadDamage: number;
  laneConfidence: number;
  speedProxyKph: number;
  collisionRisk: RiskLevel;
};

export type FrameInsight = {
  timestamp: string;
  note: string;
};

export type AnalysisResponse = {
  mode: 'demo' | 'remote';
  message: string;
  sourceName: string;
  summary: DetectionSummary;
  insights: FrameInsight[];
  warnings: string[];
};
