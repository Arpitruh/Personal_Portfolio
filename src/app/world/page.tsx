import type { Metadata } from "next";
import Link from "next/link";
import { WorldMap } from "@/components/world-map";

export const metadata: Metadata = { title: "World Map", description: "Explore Arpit Yadav's portfolio as an interactive pixel-art world.", alternates: { canonical: "/world" } };
export default function WorldPage() {
  return <main id="main" className="page page-world"><div className="container">
    <div className="page-heading"><span className="eyebrow">MAP SCREEN · WORLD 1-1</span><h1>Choose your <em>adventure.</em></h1><p>Six stops, one story. Select a landmark to discover what&apos;s behind the pixels.</p></div>
    <WorldMap />
    <div className="world-next"><p>More of a button-masher?</p><Link className="btn btn-primary" href="/play">Enter the playable level ▶</Link></div>
  </div></main>;
}
