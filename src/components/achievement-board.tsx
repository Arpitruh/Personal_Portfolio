"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {QUEST_KEY,questDefinitions,safeQuests,type QuestId} from "@/data/quests";
export function AchievementBoard(){
 const [earned,setEarned]=useState<QuestId[]>([]);
 useEffect(()=>{
  function sync(){try{setEarned(safeQuests(JSON.parse(localStorage.getItem(QUEST_KEY)||"[]")));}catch{setEarned([]);}}
  sync();window.addEventListener("portfolio-quest",sync);
  return()=>window.removeEventListener("portfolio-quest",sync);
 },[]);
 return <section className="achievement-shell" aria-label="Exploration achievements"><div className="achievement-overview"><span className="eyebrow">LOCAL EXPLORER PROFILE</span><h2>{earned.length}<span> / {questDefinitions.length}</span> badges discovered</h2><div className="achievement-meter" role="progressbar" aria-label="Exploration progress" aria-valuenow={earned.length} aria-valuemin={0} aria-valuemax={questDefinitions.length}><span style={{width:(earned.length/questDefinitions.length*100)+"%"}}/></div><p>These badges celebrate browsing different pages. They are saved on this device only—no leaderboard, analytics, account, or cross-device tracking.</p></div><div className="achievement-grid">{questDefinitions.map(q=><article className={earned.includes(q.id)?"achievement achieved":"achievement"} key={q.id}><span aria-hidden="true">{q.emoji}</span><div><h3>{q.title}</h3><p>{q.description}</p><small>{earned.includes(q.id)?"✓ Discovered":"Undiscovered"}</small></div><Link href={q.href}>{earned.includes(q.id)?"Explore again":"Find this badge"} ↗</Link></article>)}</div></section>;
}
