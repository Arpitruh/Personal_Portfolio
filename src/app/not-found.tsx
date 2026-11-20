import Link from "next/link";
export default function NotFound() {
  return <main id="main" className="page center-page"><span className="eyebrow">404 · SECRET LEVEL</span><h1>Wrong warp pipe.</h1><p>That part of the world hasn't been built yet.</p><Link href="/" className="btn btn-primary">← Back to the start</Link></main>;
}
