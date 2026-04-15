# ML ADAS Pilot — Vercel Adaptation

This is a **Vercel-compatible adaptation** of the original `t4g/ml-adas-pilot` repository.

## What this repo is

The upstream project is a Python CLI pipeline for dashcam video processing with:

- OpenCV
- PyTorch
- Ultralytics YOLO
- video file / RTSP ingestion
- MP4 output rendering
- HTML run reporting

That is **not a good direct fit for Vercel serverless** for real production inference.

This repo therefore gives you a deployment model that is honest and usable:

- **Next.js frontend** you can deploy to Vercel immediately
- **Serverless API wrapper** at `/api/analyze`
- **Demo mode by default** so the deploy works out of the box
- **Remote backend passthrough** when you later attach a real GPU-capable inference service

---

## What works immediately on Vercel

- Landing page
- Upload/URL input UI
- `/api/health`
- `/api/analyze` in demo mode

---

## What does *not* happen inside Vercel

This repo does **not** attempt to run the original heavy ADAS pipeline inside a Vercel function.
That would be fragile due to:

- serverless execution limits
- package size and native dependency friction
- long-running video inference
- GPU constraints

---

## Local development

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Deploy to Vercel

### 1. Push this repo to GitHub

### 2. Import it into Vercel

No special build settings are required.

### 3. Optional environment variables

Set these in Vercel if you want real inference forwarding:

- `ADAS_BACKEND_URL`
- `ADAS_BACKEND_TOKEN`

Example:

```bash
ADAS_BACKEND_URL=https://your-ml-service.example.com
ADAS_BACKEND_TOKEN=your-secret-token
```

---

## Remote backend contract

If `ADAS_BACKEND_URL` is present, this repo forwards POST requests to:

```text
POST {ADAS_BACKEND_URL}/analyze
```

with JSON like:

```json
{
  "sourceName": "dashcam.mp4",
  "remoteUrl": "https://example.com/video.mp4"
}
```

and expects JSON like:

```json
{
  "message": "Real inference complete",
  "sourceName": "dashcam.mp4",
  "summary": {
    "pedestrians": 3,
    "roadDamage": 1,
    "laneConfidence": 0.81,
    "speedProxyKph": 42,
    "collisionRisk": "MEDIUM"
  },
  "insights": [
    { "timestamp": "00:04", "note": "Pedestrian entered near-field zone." }
  ],
  "warnings": []
}
```

The Vercel app automatically annotates the response as `mode: "remote"`.

---

## Recommended production architecture

### Frontend
- Vercel

### Inference backend
Use one of:
- Railway
- Render
- Fly.io
- Modal
- Runpod
- a custom GPU VM

### Why this split is correct
The original repo is designed as a **local Python video-processing pipeline**, not a serverless web app. This adaptation gives you a clean web layer without misrepresenting what Vercel can realistically host.
