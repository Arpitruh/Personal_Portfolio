import Link from "next/link";
import type { PortfolioProject } from "@/data/portfolio";

export function ProjectCard({ project, index = 0 }: { project: PortfolioProject; index?: number }) {
  return <article className={"project-card accent-" + project.accent}>
    <div className="project-card-art">
      <span className="project-index">0{index + 1} / PROJECT</span>
      {project.image
        ? <figure className="project-repo-image"><img src={project.image.src} alt={project.image.alt} loading="lazy" decoding="async" /><figcaption>AUTHENTIC PROJECT ASSET</figcaption></figure>
        : <span className="project-art-emoji" role="img" aria-label={project.kicker}>{project.emoji}</span>}
      <span className="project-window"><i /><i /><i /></span>
    </div>
    <div className="project-card-body">
      <div className="card-meta"><span>{project.category}</span><span className="card-status">{project.status}</span></div>
      <h3><Link href={"/projects/" + project.slug}>{project.title}</Link></h3>
      <p>{project.summary}</p>
      <div className="chip-row">{project.stack.slice(0, 3).map((item) => <span className="chip" key={item}>{item}</span>)}</div>
      <div className="project-card-actions"><Link href={"/projects/" + project.slug} className="text-link">Explore case study <span aria-hidden="true">↗</span></Link><a className="github-icon-link" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={"View " + project.title + " on GitHub"} title="GitHub repository">⌘</a></div>
    </div>
  </article>;
}
