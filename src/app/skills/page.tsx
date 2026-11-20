import type {Metadata} from "next";
import {SkillUniverse} from "@/components/skill-universe";
export const metadata:Metadata={title:"Skills Universe",description:"Explore how Arpit's frontend and backend tools connect to real portfolio projects.",alternates:{canonical:"/skills"}};
export default function SkillsPage(){return <main className="page" id="main"><div className="container"><div className="page-heading"><span className="eyebrow">SKILL CONSTELLATION / CONNECT THE DOTS</span><h1>My technical <em>universe.</em></h1><p>Choose a tool, follow the linked projects, and see the stack in context. No inflated ratings.</p></div><SkillUniverse/></div></main>;}
