"use client";
import {useEffect,useState} from "react";
import type {SeoContent} from "@/lib/seo-content";
export function SeoEditor(){
 const [v,setValue]=useState<SeoContent|null>(null),[busy,setBusy]=useState(false),[status,setStatus]=useState("");
 useEffect(()=>{fetch("/api/manage/seo",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setValue).catch(()=>setStatus("SEO storage unavailable."));},[]);
 async function save(publish:boolean){if(!v)return;setBusy(true);setStatus("");try{const r=await fetch("/api/manage/seo",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:{...v,keywords:v.keywords.map(x=>x.trim()).filter(Boolean)},publish})});if(!r.ok)throw Error((await r.json()).error);setStatus(publish?"SEO settings published.":"Draft saved.");}catch(e){setStatus(e instanceof Error?e.message:"Save failed.");}finally{setBusy(false);}}
 return <section className="manage-module" id="manage-seo"><h2>Search &amp; social appearance</h2><p>Manage default metadata and search indexing. Preview deployments always remain non-indexable.</p>{v&&<div className="manage-fields">
 {(["title","titleSuffix","description","siteName","socialTitle","socialDescription"] as const).map(k=><label key={k}>{k.replace(/([A-Z])/g," $1")}{k.toLowerCase().includes("description")?<textarea maxLength={500} value={v[k]} onChange={e=>setValue({...v,[k]:e.target.value})}/>:<input maxLength={120} value={v[k]} onChange={e=>setValue({...v,[k]:e.target.value})}/>}</label>)}
 <label>Keywords (one per line)<textarea value={v.keywords.join("\n")} onChange={e=>setValue({...v,keywords:e.target.value.split("\n")})}/></label>
 <label><input type="checkbox" checked={v.indexable} onChange={e=>setValue({...v,indexable:e.target.checked})}/>Allow production search indexing</label>
 <div className="manage-item"><small>Search preview (illustrative)</small><h3>{v.title}</h3><p>{v.description}</p></div><div className="manage-item"><small>Social preview (illustrative)</small><h3>{v.socialTitle}</h3><p>{v.socialDescription}</p></div>
 <div className="button-group"><button className="btn btn-outline" disabled={busy} onClick={()=>void save(false)}>Save draft</button><button className="btn btn-primary" disabled={busy} onClick={()=>void save(true)}>Publish SEO</button></div></div>}<p role="status">{status}</p></section>;
}
