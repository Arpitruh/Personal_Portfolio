import type {Metadata} from "next";
import {publicCareer} from "@/lib/career-content";
import {publicProjects} from "@/lib/project-content";
import {buildSkillFamilies} from "@/data/skill-connections";
import {SkillUniverse} from "@/components/skill-universe";
import {CharacterPose} from "@/components/character-pose";
export const metadata:Metadata={title:"Skills Universe",description:"Explore how Arpit's frontend and backend tools connect to real portfolio projects.",alternates:{canonical:"/skills"}};
export default async function SkillsPage(){const [career,projects]=await Promise.all([publicCareer(),publicProjects()]);const families=buildSkillFamilies(career.skills,projects);return <main className="page" id="main"><div className="container"><div className="page-heading"><span className="eyebrow">SKILL CONSTELLATION / CONNECT THE DOTS</span><h1>My technical <em>universe.</em></h1><p>Choose a tool, follow the linked projects, and see the stack in context. No inflated ratings.</p><CharacterPose pose="coding"/></div><SkillUniverse skillFamilies={families}/></div></main>;}
