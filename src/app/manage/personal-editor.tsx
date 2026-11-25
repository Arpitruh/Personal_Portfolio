"use client";
import {useEffect,useState} from "react";
import type {LifeContent} from "@/lib/personal-content";
import type {Hobby,SocialProfile} from "@/data/personal";
function useEditor<T>(section:"life"|"socials"){
 const [value,setValue]=useState<T|null>(null),[busy,setBusy]=useState(false),[status,setStatus]=useState("");
 useEffect(()=>{fetch("/api/manage/personal?section="+section,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setValue).catch(()=>setStatus("Storage unavailable."));},[section]);
 async function save(publish:boolean){if(value===null)return;setBusy(true);setStatus("");try{const r=await fetch("/api/manage/personal",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({section,content:value,publish})});if(!r.ok)throw Error((await r.json()).error);setStatus(publish?"Published.":"Draft saved.");}catch(e){setStatus(e instanceof Error?e.message:"Save failed.");}finally{setBusy(false);}}
 return {value,setValue,busy,status,save};
}
function Buttons({busy}:{busy:boolean}){return <div className="button-group"><button className="btn btn-outline" value="draft" disabled={busy}>Save draft</button><button className="btn btn-primary" value="publish" disabled={busy}>Publish changes</button></div>;}
function publishing(e:React.FormEvent){return (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value")==="publish";}
export function LifeEditor(){
 const {value:v,setValue,busy,status,save}=useEditor<LifeContent>("life");
 function update(i:number,patch:Partial<Hobby>){if(v)setValue({...v,hobbies:v.hobbies.map((h,n)=>n===i?{...h,...patch}:h)});}
 return <section className="manage-module" id="manage-life"><h2>Personal life</h2><p>Update the Beyond Code story and hobbies.</p>{v&&<form className="manage-fields" onSubmit={e=>{e.preventDefault();void save(publishing(e));}}>
 {(["eyebrow","title","introduction","note"] as const).map(k=><label key={k}>{k}{k==="introduction"||k==="note"?<textarea value={v[k]} required={k!=="note"} maxLength={3000} onChange={e=>setValue({...v,[k]:e.target.value})}/>:<input value={v[k]} required maxLength={k==="eyebrow"?100:150} onChange={e=>setValue({...v,[k]:e.target.value})}/>}</label>)}
 <h3>Hobbies and interests</h3>{v.hobbies.map((h,i)=><fieldset className="manage-item" key={i}><legend>Interest {i+1}</legend><label>Title<input required maxLength={100} value={h.title} onChange={e=>update(i,{title:e.target.value})}/></label><label>Description<textarea required maxLength={1500} value={h.description} onChange={e=>update(i,{description:e.target.value})}/></label><label>Emoji (optional)<input maxLength={20} value={h.emoji??""} onChange={e=>update(i,{emoji:e.target.value})}/></label><button type="button" className="btn btn-outline" onClick={()=>setValue({...v,hobbies:v.hobbies.filter((_,n)=>n!==i)})}>Remove interest</button></fieldset>)}
 <button type="button" className="btn btn-outline" disabled={v.hobbies.length>=50} onClick={()=>setValue({...v,hobbies:[...v.hobbies,{title:"",description:"",emoji:""}]})}>+ Add interest</button><Buttons busy={busy}/></form>}<p role="status">{status}</p></section>;
}
export function SocialEditor(){
 const {value:v,setValue,busy,status,save}=useEditor<SocialProfile[]>("socials");
 function update(i:number,patch:Partial<SocialProfile>){if(v)setValue(v.map((h,n)=>n===i?{...h,...patch}:h));}
 function move(i:number,d:number){if(!v||i+d<0||i+d>=v.length)return;const next=[...v];[next[i],next[i+d]]=[next[i+d],next[i]];setValue(next);}
 return <section className="manage-module" id="manage-socials"><h2>Social links</h2><p>Manage public links and their order across the site.</p>{v&&<form className="manage-fields" onSubmit={e=>{e.preventDefault();void save(publishing(e));}}>
 {v.map((h,i)=><fieldset className="manage-item" key={i}><legend>Profile {i+1}</legend><label>Platform<input required maxLength={80} value={h.name} onChange={e=>update(i,{name:e.target.value})}/></label><label>HTTPS URL<input type="url" required maxLength={500} value={h.url} onChange={e=>update(i,{url:e.target.value})}/></label><label>Category<input required maxLength={80} value={h.kind} onChange={e=>update(i,{kind:e.target.value})}/></label><label><input type="checkbox" checked={h.visible} onChange={e=>update(i,{visible:e.target.checked})}/>Public</label><div className="button-group"><button type="button" className="btn btn-outline" disabled={i===0} onClick={()=>move(i,-1)}>↑ Move up</button><button type="button" className="btn btn-outline" disabled={i===v.length-1} onClick={()=>move(i,1)}>↓ Move down</button><button type="button" className="btn btn-outline" onClick={()=>setValue(v.filter((_,n)=>n!==i))}>Remove</button></div></fieldset>)}
 <button type="button" className="btn btn-outline" disabled={v.length>=50} onClick={()=>setValue([...v,{name:"",url:"",kind:"Social",visible:true}])}>+ Add profile</button><Buttons busy={busy}/></form>}<p role="status">{status}</p></section>;
}
