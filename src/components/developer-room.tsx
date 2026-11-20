"use client";
import Link from "next/link";
import { useState } from "react";

const objects=[
 {id:"computer",title:"Laptop · Dev console",icon:"⌨",kind:"workstation",description:"A working mini terminal and the shortcuts I use to explore my projects.",href:"/#developer-console",cta:"Launch developer console"},
 {id:"books",title:"Library · Skills",icon:"▥",kind:"library",description:"Explore the tools I use and see which actual projects they connect to.",href:"/skills",cta:"Browse skill universe"},
 {id:"board",title:"Project board",icon:"▣",kind:"project-board",description:"Ten repository-backed case studies, from user experiences to independent infrastructure.",href:"/projects",cta:"Open project board"},
 {id:"resume",title:"Career folder",icon:"▤",kind:"career",description:"A clear recruiter-friendly summary of my education, experience and selected work.",href:"/recruiter",cta:"Read recruiter profile"},
 {id:"console",title:"Question terminal",icon:"?",kind:"questions",description:"Ask questions about the published projects and tech stack. Everything stays on your device.",href:"/assistant",cta:"Ask a question"}
] as const;
export function DeveloperRoom(){
 const [selected,setSelected]=useState<(typeof objects)[number]["id"]>("computer");
 const item=objects.find(x=>x.id===selected)??objects[0];
 return <section className="room-shell" aria-label="Interactive developer workstation">
   <div className="room-intro"><span className="eyebrow">INTERACTIVE · NO INSTALL REQUIRED</span><p>Select an object in the room using touch, mouse, or Tab and Enter. Every destination is also listed below.</p></div>
   <div className="room-scene" aria-label="Pixel-art developer room">
     <div className="room-window" aria-hidden="true"><span>☀</span><i/></div>
     <div className="room-shelf" aria-hidden="true">▥ ▥ ▥</div>
     <div className="room-floor" aria-hidden="true"/>
     <div className="room-desk" aria-hidden="true"/>
     <div className="room-chair" aria-hidden="true"/>
     <div className="room-lamp" aria-hidden="true"/>
     {objects.map(o=><button key={o.id} type="button" className={"room-object room-"+o.id+(o.id===selected?" selected":"")} onClick={()=>setSelected(o.id)} aria-pressed={o.id===selected} aria-label={"Inspect "+o.title}><span aria-hidden="true">{o.icon}</span><small>{o.title}</small></button>)}
   </div>
   <div className="room-bottom"><div className="room-detail" role="status"><span className="eyebrow">INSPECTED OBJECT</span><h2>{item.title}</h2><p>{item.description}</p><Link className="btn btn-primary" href={item.href}>{item.cta} ↗</Link></div>
   <div className="room-direct"><h3>Quick paths</h3><nav aria-label="Developer room destinations">{objects.map(o=><Link key={o.id} href={o.href}>{o.title} ↗</Link>)}</nav></div></div>
 </section>;
}
