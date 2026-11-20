import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/portfolio";
export const metadata: Metadata = { title: "Now", description: "What Arpit Yadav is currently building and exploring.", alternates: { canonical: "/now" } };

export default function NowPage() {
  const current = projects.filter((project) => project.status === "Building");
  return <main id="main" className="page"><div className="container">
    <div className="page-heading"><span className="eyebrow">PLAYER STATUS · CURRENT MISSIONS</span><h1>What I&apos;m <em>up to.</em></h1><p>A lightweight snapshot of ongoing projects and topics I&apos;m exploring. For the latest changes, the repositories are the source of truth.</p></div>
    <div className="now-layout"><div className="now-card"><span className="eyebrow">ACTIVE QUESTS</span><h2>Currently building</h2>{current.map((project) => <Link href={"/projects/" + project.slug} className="now-project" key={project.slug}><span>{project.emoji}</span><span><strong>{project.title}</strong><small>{project.kicker}</small></span><span>↗</span></Link>)}</div>
    <div className="now-card now-side"><span className="eyebrow">CURRENT FOCUS</span><h2>In my toolkit</h2><div className="focus-list"><p>✦ Frontend architecture and scalable components</p><p>✦ Reusable services and developer experience</p><p>✦ Making complex interfaces easier to navigate</p><p>✦ Ship, inspect, improve, repeat</p></div><div className="now-note">No fake activity feed here. This page is intentionally curated and the repositories provide the freshest code updates.</div><a href="https://github.com/Arpitruh" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Latest work on GitHub ↗</a></div></div>
  </div></main>;
}
