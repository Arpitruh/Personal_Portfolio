export default function Loading() {
  return <div className="page loading-page" role="status" aria-busy="true"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-copy" /><div className="skeleton-grid"><div className="skeleton skeleton-card" /><div className="skeleton skeleton-card" /><div className="skeleton skeleton-card" /></div><span className="sr-only">Loading page</span></div>;
}
