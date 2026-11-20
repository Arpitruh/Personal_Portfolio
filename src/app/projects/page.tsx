import type { Metadata } from "next";
import { ProjectExplorer } from "@/components/project-explorer";

export const metadata: Metadata = { title: "Projects", description: "Explore Arpit Yadav's featured projects, developer tools, SaaS products and frontend experiments." };
export default function ProjectsPage() {
  return <main id="main" className="page"><div className="container">
    <div className="page-heading"><span className="eyebrow">THE QUEST LOG / ALL MISSIONS</span><h1>Built with <em>purpose.</em></h1><p>A growing collection of products, infrastructure experiments and small ideas that turned into working code. Filter the quests below.</p></div>
    <ProjectExplorer />
  </div></main>;
}
