import type {Metadata} from "next";
import {DeveloperRoom} from "@/components/developer-room";
export const metadata:Metadata={title:"Developer Room",description:"Explore an interactive pixel-art developer workstation with links to Arpit's projects and experience.",alternates:{canonical:"/room"}};
export default function RoomPage(){return <main id="main" className="page"><div className="container"><div className="page-heading"><span className="eyebrow">PIXEL HQ · INTERACTIVE ROOM</span><h1>Welcome to my <em>workstation.</em></h1><p>Every object opens a different side of the work: projects, skills, ideas and career milestones.</p></div><DeveloperRoom/></div></main>;}
