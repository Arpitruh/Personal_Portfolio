import type { Metadata } from "next";
import Link from "next/link";
import {publicProjects} from "@/lib/project-content";
import {publicActivity} from "@/lib/activity-content";
import {publicProfile} from "@/lib/profile-content";
export const metadata: Metadata = { title: "Now", description: "What Arpit Yadav is currently building and exploring.", alternates: { canonical: "/now" } };

export default async function NowPage() {
  const [projects,activity,profile]=await Promise.all([publicProjects(),publicActivity(),publicProfile()]);
  const current = projects.filter((project) => project.status === "Building");
  return <main id="main" className="page"><div className="container">
    <div className="page-heading"><span className="eyebrow">PLAYER STATUS · CURRENT MISSIONS</span><h1>What I&apos;m <em>up to.</em></h1><p>{activity.intro}</p></div>
    <div className="now-layout"><div className="now-card"><span className="eyebrow">ACTIVE QUESTS</span><h2>Currently building</h2>{current.map((project) => <Link href={"/projects/" + project.slug} className="now-project" key={project.slug}><span>{project.emoji}</span><span><strong>{project.title}</strong><small>{project.kicker}</small></span><span>↗</span></Link>)}</div>
    <div className="now-card now-side"><span className="eyebrow">CURRENT FOCUS</span><h2>In my toolkit</h2><div className="focus-list">{activity.focus.map((item,i)=><p key={i}>✦ {item}</p>)}</div><div className="now-note">{activity.note}</div><a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Latest work on GitHub ↗</a></div></div>
  </div></main>;
}
