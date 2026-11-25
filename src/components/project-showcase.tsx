"use client";
import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { PortfolioProject } from "@/data/portfolio";

export function ProjectShowcase({projects}: {projects: PortfolioProject[]}) {
  const track = useRef<HTMLDivElement>(null);
  const [index,setIndex] = useState(0);
  const [end,setEnd] = useState(false);
  const [start,setStart] = useState(true);
  useEffect(()=>{
    const element=track.current;
    if(!element) return;
    let frame=0;
    const update=()=>{
      frame=0;
      const cards=Array.from(element.querySelectorAll<HTMLElement>(".showcase-slide"));
      const left=element.getBoundingClientRect().left;
      let nearest=0;
      cards.forEach((card,i)=>{
        if(Math.abs(card.getBoundingClientRect().left-left)<Math.abs((cards[nearest]?.getBoundingClientRect().left??left)-left))nearest=i;
      });
      setIndex(nearest);
      setStart(element.scrollLeft<=4);
      setEnd(element.scrollLeft+element.clientWidth>=element.scrollWidth-4);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
    const resize=new ResizeObserver(schedule);
    resize.observe(element);
    element.addEventListener("scroll",schedule,{passive:true});
    update();
    return ()=>{resize.disconnect();element.removeEventListener("scroll",schedule);cancelAnimationFrame(frame)};
  },[projects.length]);
  const move=(direction:number)=>{
    const element=track.current;
    if(!element)return;
    const cards=Array.from(element.querySelectorAll<HTMLElement>(".showcase-slide"));
    const next=cards[Math.max(0,Math.min(cards.length-1,index+direction))];
    if(!next)return;
    const left=next.getBoundingClientRect().left-element.getBoundingClientRect().left+element.scrollLeft;
    element.scrollTo({left,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  };
  return <div className="project-showcase" role="region" aria-label="Featured project showcase">
    <div className="showcase-toolbar"><span className="eyebrow">SELECTED PROJECTS / {String(projects.length).padStart(2,"0")}</span><div className="showcase-controls"><span aria-live="polite">{String(index+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span><button type="button" className="icon-button" aria-label="Previous project" disabled={start} onClick={()=>move(-1)}>←</button><button type="button" className="icon-button" aria-label="Next project" disabled={end} onClick={()=>move(1)}>→</button></div></div>
    <div ref={track} className="showcase-track" tabIndex={0} aria-label="Scrollable project cards">{projects.map((project,i)=><div className="showcase-slide journey-project" key={project.slug}><ProjectCard project={project} index={i}/>{project.live && <a className="journey-live text-link" href={project.live} target="_blank" rel="noopener noreferrer">Open live demo ↗</a>}</div>)}</div>
    <div className="showcase-footer"><span>Swipe or use the arrows to explore</span><div className="showcase-meter" aria-hidden="true">{projects.map((project,i)=><span key={project.slug} className={i===index?"current":""}/>)}</div></div>
  </div>;
}
