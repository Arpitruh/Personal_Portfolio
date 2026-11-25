"use client";
import {useEffect,useState} from "react";
import type {PortfolioProject} from "@/data/portfolio";
const blank=():PortfolioProject=>({slug:"",title:"",kicker:"",summary:"",category:"Products",status:"Building",year:String(new Date().getFullYear()),emoji:"✦",accent:"mint",stack:[],github:"",live:"",featured:false,challenge:"",approach:"",highlights:[],next:""});
export function ProjectEditor(){
 const [items,setItems]=useState<PortfolioProject[]|null>(null),[index,setIndex]=useState(0),[busy,setBusy]=useState(false),[status,setStatus]=useState("");
 const p=items?.[index];
 useEffect(()=>{fetch("/api/manage/projects",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setItems).catch(()=>setStatus("Storage unavailable."));},[]);
 function update(patch:Partial<PortfolioProject>){setItems(old=>old?.map((x,i)=>i===index?{...x,...patch}:x)??null);}
 function move(d:number){if(!items||index+d<0||index+d>=items.length)return;const a=[...items];[a[index],a[index+d]]=[a[index+d],a[index]];setItems(a);setIndex(index+d);}
 async function save(publish:boolean){if(!items)return;setBusy(true);setStatus("");try{const r=await fetch("/api/manage/projects",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:items,publish})});if(!r.ok)throw Error((await r.json()).error);setStatus(publish?"Projects published.":"Draft saved.");}catch(e){setStatus(e instanceof Error?e.message:"Save failed.");}finally{setBusy(false);}}
 return <section className="manage-module" id="manage-projects"><h2>Projects</h2><p>Manage the entire project catalog, including case studies and featured projects. Draft edits stay private.</p>{items&&<div className="manage-fields"><div className="button-group"><button type="button" className="btn btn-outline" disabled={busy||items.length>=100} onClick={()=>{setIndex(items.length);setItems([...items,blank()]);}}>+ Add project</button>{p&&<><button type="button" className="btn btn-outline" disabled={index===0||busy} onClick={()=>move(-1)}>↑ Move up</button><button type="button" className="btn btn-outline" disabled={index===items.length-1||busy} onClick={()=>move(1)}>↓ Move down</button><button type="button" className="btn btn-outline" disabled={busy} onClick={()=>{if(confirm("Remove this project from the draft?")){setItems(items.filter((_,i)=>i!==index));setIndex(Math.max(0,index-1));}}}>Remove</button></>}</div>
 {items.length>0&&<label>Select project<select value={index} onChange={e=>setIndex(Number(e.target.value))}>{items.map((x,i)=><option key={i} value={i}>{i+1}. {x.title||"Untitled project"}</option>)}</select></label>}
 {p&&<fieldset className="manage-fields manage-item"><legend>Project details</legend>
 {(["title","slug","kicker","year","emoji","github","live"] as const).map(k=><label key={k}>{k}<input value={p[k]??""} maxLength={k==="github"||k==="live"?1000:200} onChange={e=>update({[k]:e.target.value})}/></label>)}
 <label>Category<select value={p.category} onChange={e=>update({category:e.target.value as PortfolioProject["category"]})}>{["Products","Platform","AI","Frontend"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Status<select value={p.status} onChange={e=>update({status:e.target.value as PortfolioProject["status"]})}>{["Building","Shipped","Iterating"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Accent<select value={p.accent} onChange={e=>update({accent:e.target.value})}>{["mint","peach","violet","blue","yellow"].map(x=><option key={x}>{x}</option>)}</select></label>
 {(["summary","challenge","approach","next"] as const).map(k=><label key={k}>{k}<textarea value={p[k]} maxLength={8000} onChange={e=>update({[k]:e.target.value})}/></label>)}
 <label>Technology stack (one per line)<textarea value={p.stack.join("\n")} onChange={e=>update({stack:e.target.value.split("\n")})}/></label>
 <label>Highlights (one per line)<textarea value={p.highlights.join("\n")} onChange={e=>update({highlights:e.target.value.split("\n")})}/></label>
 <label>Existing local screenshot path<input value={p.image?.src??""} onChange={e=>update({image:e.target.value?{src:e.target.value,alt:p.image?.alt??"",caption:p.image?.caption??""}:undefined})}/></label>
 {p.image&&<><label>Screenshot alt text<input value={p.image.alt} onChange={e=>update({image:{...p.image!,alt:e.target.value}})}/></label><label>Screenshot caption<input value={p.image.caption} onChange={e=>update({image:{...p.image!,caption:e.target.value}})}/></label></>}
 <label><input type="checkbox" checked={!!p.featured} onChange={e=>update({featured:e.target.checked})}/>Featured on homepage</label></fieldset>}
 <div className="button-group"><button className="btn btn-outline" disabled={busy} onClick={()=>void save(false)}>Save draft</button><button className="btn btn-primary" disabled={busy} onClick={()=>void save(true)}>Publish projects</button></div></div>}<p role="status">{status}</p></section>;
}
