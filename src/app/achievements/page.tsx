import type {Metadata} from "next";
import {AchievementBoard} from "@/components/achievement-board";
export const metadata:Metadata={title:"Achievements",description:"A local-only visitor quest board for discovering projects, skills and sections of Portfolio World.",alternates:{canonical:"/achievements"}};
export default function AchievementsPage(){return <main id="main" className="page"><div className="container"><div className="page-heading"><span className="eyebrow">EXPLORER PASS · NO ACCOUNT REQUIRED</span><h1>Your <em>achievements.</em></h1><p>Discover hidden corners of the portfolio and collect a small badge for each section visited.</p></div><AchievementBoard/></div></main>;}
