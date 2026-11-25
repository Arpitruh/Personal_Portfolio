"use client";
import {useEffect,useState} from "react";
import type {ProfileContent} from "@/lib/profile-content";
const fields:[keyof ProfileContent,string][]=[["name","Full name"],["role","Designation"],["location","Location"],["summary","Professional biography"],["headlineStart","Hero headline"],["headlineEnd","Hero highlighted text"],["heroDescription","Hero introduction"],["availability","Availability (leave empty to hide)"],["eyebrow","Hero eyebrow"],["github","GitHub URL"],["email","Public email"],["phone","Public phone"]];
export function ProfileEditor(){
 const [value,setValue]=useState<ProfileContent|null>(null),[busy,setBusy]=useState(false),[status,setStatus]=useState("");
 useEffect(()=>{fetch("/api/manage/profile",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setValue).catch(()=>setStatus("Profile storage unavailable."));},[]);
 async function save(publish:boolean){
 if(!value)return;setBusy(true);setStatus("");
 try{const r=await fetch("/api/manage/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:value,publish})});if(!r.ok)throw Error((await r.json()).error);setStatus(publish?"Profile published.":"Draft saved.");}catch(e){setStatus(e instanceof Error?e.message:"Save failed.");}finally{setBusy(false);}
 }
 return <section className="manage-module" id="manage-profile"><h2>Profile &amp; homepage</h2><p>Edit public identity and hero content. Save privately or publish to the homepage and About page.</p>{value&&<form className="manage-fields" onSubmit={e=>{e.preventDefault();void save((e.nativeEvent as SubmitEvent).submitter?.getAttribute("value")==="publish");}}>{fields.map(([key,label])=><label key={key}>{label}{key==="summary"||key==="heroDescription"?<textarea required maxLength={2000} value={value[key]} onChange={e=>setValue({...value,[key]:e.target.value})}/>:<input required={!["email","phone","availability"].includes(key)} maxLength={250} value={value[key]} onChange={e=>setValue({...value,[key]:e.target.value})}/>}</label>)}<div className="button-group"><button className="btn btn-outline" value="draft" disabled={busy}>Save draft</button><button className="btn btn-primary" value="publish" disabled={busy}>Publish profile</button></div></form>}<p role="status">{status}</p></section>;
}
