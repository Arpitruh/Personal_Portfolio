import type { Metadata } from "next";
import { PortfolioGame } from "@/components/portfolio-game";

export const metadata: Metadata = { title: "Play the Level", description: "A playable pixel-art platform adventure through Arpit's projects.", alternates: { canonical: "/play" } };
export default function PlayPage() {
  return <main id="main" className="page game-page"><div className="container">
    <div className="page-heading"><span className="eyebrow">BONUS STAGE · NO INSTALL REQUIRED</span><h1>Work hard. <em>Play harder.</em></h1><p>A five-world pixel adventure with hidden stars, power-ups, spike hazards, difficulty modes, checkpoints and records. Explore real projects through secret portals.</p></div>
    <PortfolioGame />
  </div></main>;
}
