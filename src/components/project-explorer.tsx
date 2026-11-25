"use client";
import { useEffect, useMemo, useState } from "react";
import { projectCategories, type PortfolioProject } from "@/data/portfolio";
import { compareUrl, discoverProjects, MAX_COMPARE, parseSharedComparison, safeSlugs, SAVED_PROJECTS_KEY, type SortOrder } from "@/data/project-discovery";
import { ProjectCard } from "@/components/project-card";

export function ProjectExplorer({projects}: {projects:PortfolioProject[]}) {
  const [category, setCategory] = useState<(typeof projectCategories)[number]>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try { setSaved(safeSlugs(JSON.parse(localStorage.getItem(SAVED_PROJECTS_KEY) || "[]"),projects)); }
    catch { /* A corrupted or unavailable local store should not block browsing. */ }
    setCompare(parseSharedComparison(window.location.search,projects));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(saved)); }
    catch { /* Bookmarks remain usable in memory if storage is disabled. */ }
  }, [saved, ready]);

  // URL state means a shared comparison can be opened without an account.
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (compare.length) url.searchParams.set("compare", compare.join(","));
    else url.searchParams.delete("compare");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [compare, ready]);

  const results = useMemo(() => discoverProjects(projects, { category, search, savedOnly, saved, sort }), [category, search, savedOnly, saved, sort,projects]);
  const selected = compare.map(slug => projects.find(project => project.slug === slug)).filter((p): p is (typeof projects)[number] => Boolean(p));

  function toggleSaved(slug: string) {
    const exists = saved.includes(slug);
    setSaved(current => exists ? current.filter(x => x !== slug) : [...current, slug]);
    setFeedback(exists ? "Project removed from saved quests." : "Project saved on this device.");
  }
  function toggleCompare(slug: string) {
    if (compare.includes(slug)) { setCompare(current => current.filter(x => x !== slug)); setFeedback("Removed from comparison."); return; }
    if (compare.length >= MAX_COMPARE) { setFeedback("Compare up to three projects. Remove one to add another."); return; }
    setCompare(current => [...current, slug]);
    setFeedback("Project added to comparison.");
  }
  async function share() {
    const url = compareUrl(window.location.origin, compare,projects);
    try { await navigator.clipboard.writeText(url); setFeedback("Comparison link copied."); }
    catch { setFeedback("Copy the comparison URL from your browser's address bar."); }
  }

  return <>
    <div className="explorer-toolbar">
      <div className="filter-tabs" aria-label="Filter projects by category">
        {projectCategories.map(item => <button key={item} type="button" className={"filter-tab" + (category === item ? " selected" : "")} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
      </div>
      <label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search projects</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search quests..." /></label>
    </div>
    <div className="discovery-toolbar">
      <label className="discovery-sort">Sort projects <select aria-label="Sort projects" value={sort} onChange={event => setSort(event.target.value as SortOrder)}>
        <option value="featured">Featured first</option><option value="newest">Newest first</option><option value="alphabetical">A to Z</option>
      </select></label>
      <button type="button" className={"discovery-saved-toggle" + (savedOnly ? " active" : "")} onClick={() => setSavedOnly(current => !current)} aria-pressed={savedOnly}>♥ Saved quests ({saved.length})</button>
      <span className="discovery-hint">Save projects locally. Compare up to 3 and share a link.</span>
    </div>
    <p className="result-count" aria-live="polite">SHOWING {results.length} / {projects.length} QUESTS</p>
    {results.length
      ? <div className="project-grid">{results.map(project =>
        <div className="discovery-card" key={project.slug}>
          <ProjectCard project={project} index={projects.indexOf(project)} />
          <div className="discovery-card-actions">
            <button type="button" onClick={() => toggleSaved(project.slug)} aria-pressed={saved.includes(project.slug)} aria-label={(saved.includes(project.slug) ? "Unsave " : "Save ") + project.title}>{saved.includes(project.slug) ? "♥ Saved" : "♡ Save"}</button>
            <button type="button" onClick={() => toggleCompare(project.slug)} aria-pressed={compare.includes(project.slug)} aria-label={(compare.includes(project.slug) ? "Remove " : "Compare ") + project.title}>{compare.includes(project.slug) ? "✓ Comparing" : "+ Compare"}</button>
          </div>
        </div>)}</div>
      : <div className="empty-state"><span>?</span><h2>No quests matched</h2><p>Try another keyword or switch categories.</p><button type="button" className="btn btn-outline" onClick={() => { setCategory("All"); setSearch(""); setSavedOnly(false); }}>Reset filters</button></div>}
    <p className="discovery-feedback" role="status">{feedback}</p>
    {selected.length > 0 && <section className="compare-workbench" aria-label="Project comparison">
      <div className="compare-heading"><div><span className="eyebrow">PROJECT WORKBENCH</span><h2>Compare your quests</h2><p>Side-by-side details from the published case studies. No account needed.</p></div><div className="compare-commands"><button type="button" onClick={() => void share()}>Copy comparison link</button><button type="button" onClick={() => setCompare([])}>Clear selection</button></div></div>
      <div className="compare-scroll"><div className="compare-columns">{selected.map(project =>
        <article key={project.slug} className="compare-column">
          <div className="compare-title"><span aria-hidden="true">{project.emoji}</span><div><h3>{project.title}</h3><small>{project.category} · {project.status}</small></div><button type="button" aria-label={"Remove " + project.title + " from comparison"} onClick={() => toggleCompare(project.slug)}>×</button></div>
          <div className="compare-row"><strong>Tech stack</strong><p>{project.stack.join(" · ")}</p></div>
          <div className="compare-row"><strong>Challenge</strong><p>{project.challenge}</p></div>
          <div className="compare-row"><strong>Approach</strong><p>{project.approach}</p></div>
          <div className="compare-row"><strong>Highlights</strong><ul>{project.highlights.slice(0, 3).map(h => <li key={h}>{h}</li>)}</ul></div>
          <a href={"/projects/" + project.slug} className="btn btn-outline">Read full case study ↗</a>
        </article>)}</div></div>
    </section>}
  </>;
}
