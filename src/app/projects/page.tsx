import type { Metadata } from "next";
import { ProjectExplorer } from "@/components/project-explorer";

export const metadata: Metadata = { title: "Projects", description: "Explore and compare Arpit Yadav's developer tools, SaaS products, and frontend experiments.", alternates: { canonical: "/projects" } };
export default function ProjectsPage() {
  return <main id="main" className="page"><div className="container">
    <div className="page-heading"><span className="eyebrow">THE QUEST LOG / ALL MISSIONS</span><h1>Built with <em>purpose.</em></h1><p>Explore real projects, save your favorites, and compare stacks and approaches side by side. Your shortlist stays on your device.</p></div>
    <ProjectExplorer />
  </div></main>;
}
