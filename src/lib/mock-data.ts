import type { NumericalID } from '@/lib/types';

const generatePath = (startLat: number, startLng: number, points: number, drift: number) => {
  const path = [];
  let lat = startLat;
  let lng = startLng;
  const now = Date.now();
  for (let i = 0; i < points; i++) {
    lat += (Math.random() - 0.5) * drift;
    lng += (Math.random() - 0.5) * drift;
    path.push({ lat, lng, timestamp: now - (points - i) * 60000 });
  }
  return path;
};

export const MOCK_IDs: NumericalID[] = [
  {
    id: 'ID-734-ALPHA',
    metadata: {
      name: 'Asset Alpha',
      type: 'vehicle',
      tags: ['critical', 'asset'],
    },
    movementHistory: generatePath(48.8584, 2.2945, 50, 0.005),
    currentPosition: { lat: 48.8584, lng: 2.2945, timestamp: Date.now() },
    alert: false,
    isProcessingAnomaly: false,
  },
  {
    id: 'ID-112-BRAVO',
    metadata: {
      name: 'Drone Bravo',
      type: 'drone',
      tags: ['high-velocity'],
    },
    movementHistory: generatePath(48.8606, 2.3376, 30, 0.01),
    currentPosition: { lat: 48.8606, lng: 2.3376, timestamp: Date.now() },
    alert: false,
    isProcessingAnomaly: false,
  },
  {
    id: 'ID-987-CHARLIE',
    metadata: {
      name: 'Agent Charlie',
      type: 'person',
      tags: ['restricted-zone'],
    },
    // This path has a sudden jump, making it a good candidate for an anomaly
    movementHistory: [
      ...generatePath(48.853, 2.349, 20, 0.001),
      ...generatePath(40.7128, -74.0060, 10, 0.001), // Sudden jump to NYC
    ],
    currentPosition: { lat: 40.7128, lng: -74.0060, timestamp: Date.now() },
    alert: true,
    anomaly: {
      interpretation: "Sudden, geographically impossible relocation detected. Potential signal hijack or device malfunction. Origin point lost in Paris, re-established in New York.",
      confidence: 0.95
    },
    isProcessingAnomaly: false,
  },
  {
    id: 'ID-404-DELTA',
    metadata: {
      name: 'Vehicle Delta',
      type: 'vehicle',
      tags: ['asset'],
    },
    movementHistory: generatePath(48.8738, 2.3522, 100, 0.002),
    currentPosition: { lat: 48.8738, lng: 2.3522, timestamp: Date.now() },
    alert: false,
    isProcessingAnomaly: false,
  },
  {
    id: 'ID-852-ECHO',
    metadata: {
      name: 'Drone Echo',
      type: 'drone',
      tags: ['high-velocity', 'critical'],
    },
    movementHistory: generatePath(48.8462, 2.3762, 70, 0.008),
    currentPosition: { lat: 48.8462, lng: 2.3762, timestamp: Date.now() },
    alert: false,
    isProcessingAnomaly: false,
  },
];
