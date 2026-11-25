"use client";
import Link from "next/link";
import { useMemo,useState } from "react";
import { skillFamilies as defaultFamilies } from "@/data/skill-connections";
export function SkillUniverse({skillFamilies=defaultFamilies}:{skillFamilies?:typeof defaultFamilies}){
 const [family,setFamily]=useState(skillFamilies[0]?.group??"");
 const [selected,setSelected]=useState(skillFamilies[0]?.skills[0]?.name??"");
 const group=skillFamilies.find(x=>x.group===family)??skillFamilies[0];
 const active=useMemo(()=>group?.skills.find(x=>x.name===selected)??group?.skills[0],[group,selected]);
 if(!group||!active)return <p>No skills published yet.</p>;
 return <div className="universe-shell">
  <div className="universe-toolbar" role="group" aria-label="Skill families">{skillFamilies.map(f=><button key={f.group} type="button" aria-pressed={family===f.group} onClick={()=>{setFamily(f.group);setSelected(f.skills[0].name)}}>{f.group}</button>)}</div>
  <div className="universe-layout">
   <div className="universe-constellation" aria-label="Skill selector">
    <span className="universe-orbit orbit-a" aria-hidden="true"/><span className="universe-orbit orbit-b" aria-hidden="true"/>
    <div className="universe-core" aria-hidden="true">AY<span>SKILLS</span></div>
    <div className="universe-nodes">{group.skills.map(s=><button type="button" key={s.name} className={selected===s.name?"active":""} aria-pressed={selected===s.name} onClick={()=>setSelected(s.name)}>{s.name}<small>{s.projects.length} linked {s.projects.length===1?"project":"projects"}</small></button>)}</div>
   </div>
   <aside className="universe-detail"><span className="eyebrow">SELECTED SKILL</span><h2>{active.name}</h2><p>Project connections come from the published tech stack in each case study—not invented proficiency levels or usage statistics.</p>
   <h3>{active.projects.length ? "Documented project connections":"No exact stack match yet"}</h3>
   {active.projects.length?<div className="universe-links">{active.projects.map(p=><Link key={p.slug} href={"/projects/"+p.slug}>{p.title} ↗</Link>)}</div>:<p>This tool is part of the broader inventory, but none of the listed projects explicitly names it in its published stack.</p>}
   <Link href="/recruiter" className="text-link">View complete career summary ↗</Link>
   </aside>
  </div>
 </div>;
}
