"use client";
import {useEffect,useState} from "react";
import type {LibraryEntry} from "@/lib/library-content";
const categories=["Travel Diaries","Through My Lens","Creative Corner","Memory Vault"];
export function LibraryEditor(){
 const [items,setItems]=useState<LibraryEntry[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function load(){const r=await fetch("/api/manage/library",{cache:"no-store"});if(!r.ok)throw new Error("Storage unavailable");setItems(await r.json());}
 useEffect(()=>{load().catch(()=>setMessage("Storage unavailable."));},[]);
 async function run(action:()=>Promise<void>){setBusy(true);setMessage("");try{await action();await load();setMessage("Saved.");}catch(e){setMessage(e instanceof Error?e.message:"Request failed");}finally{setBusy(false);}}
 async function patch(body:object){const r=await fetch("/api/manage/library",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok)throw new Error((await r.json()).error);}
 return <section className="manage-module manage-library"><h2>Personal library</h2><p>Upload a photo, edit its details and publish when ready. Drafts are private.</p>
 <form className="manage-fields" onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const data=new FormData(form);void run(async()=>{const r=await fetch("/api/manage/library",{method:"POST",body:data});if(!r.ok)throw new Error((await r.json()).error);form.reset();});}}>
 <label>Photo (JPEG, PNG or WebP, up to 2 MB)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required/></label>
 <label>Title<input name="title" maxLength={120} required/></label><label>Image description<input name="alt" maxLength={240} required/></label>
 <label>Collection<select name="category">{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Caption<textarea name="caption" maxLength={1000}/></label>
 <button className="btn btn-primary" disabled={busy}>Upload draft</button></form>
 <p role="status">{message}</p><div className="manage-library-items">{items.map(item=><form key={item.id} className="manage-fields manage-item" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);void run(()=>patch({action:"update",id:item.id,title:f.get("title"),alt:f.get("alt"),caption:f.get("caption"),category:f.get("category"),visible:f.has("visible"),featured:f.has("featured")}));}}>
 <img src={item.src} alt={item.alt}/><label>Title<input name="title" defaultValue={item.title} required maxLength={120}/></label><label>Description<input name="alt" defaultValue={item.alt} required maxLength={240}/></label><label>Caption<textarea name="caption" defaultValue={item.caption}/></label><label>Collection<select name="category" defaultValue={item.category}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label><input type="checkbox" name="visible" defaultChecked={item.visible}/> Public when published</label><label><input type="checkbox" name="featured" defaultChecked={item.featured}/> Featured</label><button className="btn btn-outline" disabled={busy}>Save draft</button><button type="button" className="btn btn-outline" disabled={busy} onClick={()=>{if(confirm("Remove this entry from the draft?"))void run(()=>patch({action:"remove",id:item.id}));}}>Remove</button></form>)}</div>
 <button className="btn btn-primary" disabled={busy} onClick={()=>void run(()=>patch({action:"publish"}))}>Publish library changes</button></section>;
}
