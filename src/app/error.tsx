"use client";
export default function ErrorView({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main" className="page center-page" role="alert"><span className="eyebrow">SOMETHING GLITCHED</span><h1>We've hit a question block.</h1><p>This page couldn't load. Your adventure isn't lost.</p><button type="button" className="btn btn-primary" onClick={reset}>Try again ↻</button></main>;
}
