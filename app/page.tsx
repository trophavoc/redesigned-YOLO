import { AnalysisClient } from '@/components/AnalysisClient';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Vercel-ready adaptation</div>
        <h1>ML ADAS Pilot on Vercel.</h1>
        <p className="lead">
          The original repository is a Python/OpenCV/YOLO dashcam pipeline. This adaptation gives you a deployable Next.js interface, a serverless API wrapper, and a controlled upgrade path to a real GPU backend without pretending Vercel can natively run heavy video inference at production scale.
        </p>
      </section>

      <AnalysisClient />

      <section className="card stack" style={{ marginTop: 20 }}>
        <h2>Deployment model</h2>
        <ul className="list">
          <li>
            <strong>Immediate Vercel deploy:</strong> frontend + demo-safe API route.
          </li>
          <li>
            <strong>Real inference later:</strong> set <span className="code">ADAS_BACKEND_URL</span> to a separate backend that runs the original Python pipeline.
          </li>
          <li>
            <strong>Why this split exists:</strong> the upstream project depends on OpenCV, PyTorch, Ultralytics YOLO, and video processing workflows that are generally outside Vercel serverless comfort limits for sustained inference.
          </li>
        </ul>
      </section>
    </main>
  );
}
