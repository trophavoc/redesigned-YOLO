'use client';

import { useMemo, useState } from 'react';
import type { AnalysisResponse } from '@/lib/types';

const initialName = 'dashcam-demo.mp4';

export function AnalysisClient() {
  const [file, setFile] = useState<File | null>(null);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResponse | null>(null);

  const sourceName = useMemo(() => {
    if (file) return file.name;
    if (remoteUrl.trim()) return remoteUrl.trim();
    return initialName;
  }, [file, remoteUrl]);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      if (file) {
        form.append('file', file);
      } else {
        form.append('sourceName', sourceName);
      }
      if (remoteUrl.trim()) form.append('remoteUrl', remoteUrl.trim());

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Analysis failed');
      }

      const json = (await response.json()) as AnalysisResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid">
      <section className="card stack">
        <div>
          <h2>Analyze a dashcam sample</h2>
          <p className="muted">
            This Vercel build ships in a safe mode. It can run immediately as a frontend/API shell, and it can forward requests to a real backend once you set <span className="code">ADAS_BACKEND_URL</span>.
          </p>
        </div>

        <div>
          <label htmlFor="file">Upload a small sample video</label>
          <input
            id="file"
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label htmlFor="remoteUrl">Or pass a remote video URL</label>
          <input
            id="remoteUrl"
            type="text"
            placeholder="https://example.com/dashcam.mp4"
            value={remoteUrl}
            onChange={(e) => setRemoteUrl(e.target.value)}
          />
        </div>

        <div className="row">
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing…' : 'Run analysis'}
          </button>
          <button
            className="secondary"
            onClick={() => {
              setFile(null);
              setRemoteUrl('');
              setData(null);
              setError(null);
            }}
            disabled={loading}
          >
            Reset
          </button>
        </div>

        <div className="muted">
          Current source: <span className="code">{sourceName}</span>
        </div>

        {error ? (
          <div className="list">
            <li style={{ borderColor: 'rgba(255,107,107,0.35)' }}>{error}</li>
          </div>
        ) : null}
      </section>

      <section className="card stack">
        <div>
          <h2>Result</h2>
          <p className="muted">You get a deployable interface now, with a clean switch to real inference later.</p>
        </div>

        {data ? (
          <>
            <div className="row">
              <span className={`badge ${data.summary.collisionRisk.toLowerCase()}`}>
                {data.summary.collisionRisk} collision risk
              </span>
              <span className="badge" style={{ background: 'rgba(112,225,255,0.12)', color: '#9beeff' }}>
                {data.mode.toUpperCase()} mode
              </span>
            </div>

            <div className="kpis">
              <div className="kpi">
                <small>Pedestrians</small>
                <strong>{data.summary.pedestrians}</strong>
              </div>
              <div className="kpi">
                <small>Road damage</small>
                <strong>{data.summary.roadDamage}</strong>
              </div>
              <div className="kpi">
                <small>Lane confidence</small>
                <strong>{Math.round(data.summary.laneConfidence * 100)}%</strong>
              </div>
              <div className="kpi">
                <small>Speed proxy</small>
                <strong>{data.summary.speedProxyKph} kph</strong>
              </div>
            </div>

            <div>
              <h3>Key insights</h3>
              <ul className="list">
                {data.insights.map((item) => (
                  <li key={`${item.timestamp}-${item.note}`}>
                    <strong>{item.timestamp}</strong> — {item.note}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Warnings</h3>
              <ul className="list">
                {data.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="muted">No analysis yet.</div>
        )}
      </section>
    </div>
  );
}
