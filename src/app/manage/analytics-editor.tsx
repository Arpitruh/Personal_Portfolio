"use client";
import {useEffect,useState} from "react";
type Metric={day:string;path:string;event:string;total:string};
export function AnalyticsEditor(){
 const [days,setDays]=useState("30"),[rows,setRows]=useState<Metric[]>([]),[status,setStatus]=useState("Loading…");
 async function load(period:string){setStatus("Loading…");try{const r=await fetch("/api/manage/analytics?days="+period,{cache:"no-store"});if(!r.ok)throw Error();setRows(await r.json());setStatus("");}catch{setRows([]);setStatus("Analytics unavailable.");}}
 useEffect(()=>{void load(days);},[days]);
 const views=rows.filter(r=>r.event==="view"),sum=(a:Metric[])=>a.reduce((n,r)=>n+Number(r.total),0);
 const byPath=Object.entries(views.reduce<Record<string,number>>((a,r)=>({...a,[r.path]:(a[r.path]??0)+Number(r.total)}),{})).sort((a,b)=>b[1]-a[1]).slice(0,10);
 const daily=Object.entries(views.reduce<Record<string,number>>((a,r)=>({...a,[r.day]:(a[r.day]??0)+Number(r.total)}),{})).sort((a,b)=>a[0].localeCompare(b[0]));
 return <section className="manage-module" id="manage-analytics"><h2>Visitor analytics</h2><p>Anonymous aggregate activity. Production only; admin sessions and privacy opt-outs are excluded. Counts are events, not unique people.</p><div className="manage-fields"><label>Period<select value={days} onChange={e=>setDays(e.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label><button className="btn btn-outline" onClick={()=>void load(days)}>Refresh analytics</button></div><p role="status">{status}</p>{!status&&<><div className="manage-grid"><article className="manage-item"><small>Page views</small><h2>{sum(views).toLocaleString()}</h2></article><article className="manage-item"><small>Resume download clicks</small><h2>{sum(rows.filter(r=>r.event==="resume_click")).toLocaleString()}</h2></article><article className="manage-item"><small>Pages viewed</small><h2>{new Set(views.map(r=>r.path)).size}</h2></article></div><h3>Daily views (UTC)</h3>{daily.length?daily.map(([day,total])=><div key={day} className="manage-fields"><span>{day} · {total}</span><progress value={total} max={Math.max(1,...daily.map(x=>x[1]))}/></div>):<p>No page views recorded yet.</p>}<h3>Top pages</h3>{byPath.map(([path,total])=><p key={path}>{path} — {total.toLocaleString()}</p>)}</>}</section>;
}
