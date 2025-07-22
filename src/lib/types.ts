export type MovementPoint = {
  lat: number;
  lng: number;
  timestamp: number;
};

export type Metadata = {
  name: string;
  type: 'drone' | 'vehicle' | 'person';
  tags: string[];
};

export type AnomalyInterpretation = {
  interpretation: string;
  confidence: number;
};

export type NumericalID = {
  id: string;
  metadata: Metadata;
  movementHistory: MovementPoint[];
  currentPosition: MovementPoint;
  anomaly?: AnomalyInterpretation;
  alert: boolean;
  isProcessingAnomaly: boolean;
};

export const ALL_TAGS = ['critical', 'asset', 'high-velocity', 'restricted-zone'];
