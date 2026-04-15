import type { AnalysisResponse } from '@/lib/types';

const riskFromName = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('night') || lower.includes('rain') || lower.includes('city')) return 'HIGH' as const;
  if (lower.includes('traffic') || lower.includes('ped')) return 'MEDIUM' as const;
  return 'LOW' as const;
};

export function buildDemoAnalysis(sourceName: string): AnalysisResponse {
  const collisionRisk = riskFromName(sourceName);

  return {
    mode: 'demo',
    message:
      'This deployment is Vercel-safe and returns a deterministic demo analysis unless ADAS_BACKEND_URL is configured.',
    sourceName,
    summary: {
      pedestrians: collisionRisk === 'HIGH' ? 4 : collisionRisk === 'MEDIUM' ? 2 : 1,
      roadDamage: collisionRisk === 'HIGH' ? 3 : 1,
      laneConfidence: collisionRisk === 'HIGH' ? 0.64 : 0.82,
      speedProxyKph: collisionRisk === 'HIGH' ? 51 : 37,
      collisionRisk
    },
    insights: [
      { timestamp: '00:03', note: 'Lane geometry stabilized after initial horizon lock.' },
      { timestamp: '00:08', note: 'Foreground pedestrian cluster increased time-to-collision pressure.' },
      { timestamp: '00:14', note: 'Surface anomaly confidence crossed reporting threshold.' }
    ],
    warnings: [
      'This is not running the original YOLO/OpenCV pipeline inside Vercel.',
      'For real inference, point ADAS_BACKEND_URL to a GPU-capable backend such as Railway, Fly.io, Render, Modal, Runpod, or a custom VM.'
    ]
  };
}
