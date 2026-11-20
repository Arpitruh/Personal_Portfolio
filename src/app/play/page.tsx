import type { Metadata } from "next";
import { PortfolioGame } from "@/components/portfolio-game";

export const metadata: Metadata = { title: "Play the Level", description: "A playable pixel-art platform adventure through Arpit's projects.", alternates: { canonical: "/play" } };
export default function PlayPage() {
  return <main id="main" className="page game-page"><div className="container">
    <div className="page-heading"><span className="eyebrow">BONUS STAGE · NO INSTALL REQUIRED</span><h1>Work hard. <em>Play harder.</em></h1><p>A tiny platformer built with Canvas. Collect coins, meet a few critters and drop into a pipe to discover a project.</p></div>
    <PortfolioGame />
  </div></main>;
}
