import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ML ADAS Pilot — Vercel Adaptation',
  description: 'Vercel-safe frontend and API wrapper for the ml-adas-pilot project.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
