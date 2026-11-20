import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/data/portfolio";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? { title: project.title, description: project.summary, alternates: { canonical: "/projects/" + project.slug } } : {};
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return <main id="main" className="page project-detail"><div className="container">
    <Link href="/projects" className="back-link">← ALL PROJECTS</Link>
    <div className={"case-hero accent-" + project.accent}>
      <div className="case-hero-copy"><div className="case-meta"><span>{project.category.toUpperCase()}</span><span>{project.status.toUpperCase()}</span><span>{project.year}</span></div><span className="eyebrow">{project.kicker}</span><h1>{project.title}</h1><p>{project.summary}</p><div className="button-group"><a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Explore source ↗</a>{project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Visit live site ↗</a>}</div></div>
      <div className="case-illustration"><span>{project.emoji}</span><div className="case-illustration-chip">QUEST #{String(index + 1).padStart(2, "0")}</div></div>
    </div>
    <div className="case-layout"><div className="case-main"><section className="case-section"><span className="eyebrow">01 / THE CHALLENGE</span><h2>Where it started.</h2><p>{project.challenge}</p></section><section className="case-section"><span className="eyebrow">02 / THE APPROACH</span><h2>How I approached it.</h2><p>{project.approach}</p></section><section className="case-section"><span className="eyebrow">03 / WHAT'S INSIDE</span><h2>Key highlights.</h2><div className="highlight-list">{project.highlights.map((highlight, i) => <div key={highlight}><span>0{i + 1}</span><p>{highlight}</p><span>✦</span></div>)}</div></section><section className="case-section"><span className="eyebrow">04 / NEXT CHECKPOINT</span><h2>What's next?</h2><p>{project.next}</p></section></div><aside className="case-sidebar"><div className="case-aside-card"><span className="eyebrow">MY TOOLKIT</span><h3>Tech inventory</h3><div className="chip-row">{project.stack.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div><div className="case-aside-card"><span className="eyebrow">PROJECT STATUS</span><h3>{project.status}</h3><p>The linked repository is the source of truth for current code and progress.</p><a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link">Open GitHub repository ↗</a></div></aside></div>
    <Link className="next-project" href={"/projects/" + next.slug}><span><span className="eyebrow">NEXT QUEST</span><strong>{next.title}</strong></span><span aria-hidden="true">↗</span></Link>
  </div></main>;
}
