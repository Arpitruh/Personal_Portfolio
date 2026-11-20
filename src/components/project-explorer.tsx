"use client";
import { useMemo, useState } from "react";
import { projectCategories, projects } from "@/data/portfolio";
import { ProjectCard } from "@/components/project-card";

export function ProjectExplorer() {
  const [category, setCategory] = useState<(typeof projectCategories)[number]>("All");
  const [search, setSearch] = useState("");
  const results = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === "All" || project.category === category;
    const haystack = [project.title, project.summary, project.category, ...project.stack].join(" ").toLowerCase();
    return matchesCategory && haystack.includes(search.trim().toLowerCase());
  }), [category, search]);

  return <>
    <div className="explorer-toolbar"><div className="filter-tabs" aria-label="Filter projects by category">
      {projectCategories.map((item) => <button key={item} type="button" className={"filter-tab" + (category === item ? " selected" : "")} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
    </div><label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search projects</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search quests..." /></label></div>
    <p className="result-count" aria-live="polite">SHOWING {results.length} / {projects.length} QUESTS</p>
    {results.length ? <div className="project-grid">{results.map((project) => <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />)}</div> : <div className="empty-state"><span>?</span><h2>No quests matched</h2><p>Try another keyword or switch categories.</p><button type="button" className="btn btn-outline" onClick={() => { setCategory("All"); setSearch(""); }}>Reset filters</button></div>}
  </>;
}
