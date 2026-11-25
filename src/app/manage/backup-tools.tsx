"use client";
import {useState} from "react";
type Media={id:string;mime:string;size:string;created_at:string};
export function BackupTools(){
 const [media,setMedia]=useState<Media[]|null>(null),[busy,setBusy]=useState(false),[status,setStatus]=useState("");
 async function load(){const r=await fetch("/api/manage/media-backup",{cache:"no-store"});if(!r.ok)throw Error("Unable to list media.");setMedia(await r.json());}
 async function run(fn:()=>Promise<void>){setBusy(true);setStatus("");try{await fn();}catch(e){setStatus(e instanceof Error?e.message:"Request failed.");}finally{setBusy(false);}}
 async function importContent(file:File){if(file.size>2*1024*1024){setStatus("Backup exceeds 2 MB.");return;}if(!confirm("Replace saved drafts with this backup? Published content will stay unchanged. Unsaved edits may be lost when the dashboard reloads."))return;
 await run(async()=>{const r=await fetch("/api/manage/backup/import",{method:"POST",headers:{"Content-Type":"application/json"},body:await file.text()});const d=await r.json();if(!r.ok)throw Error(d.error);setStatus("Restored "+d.sections.length+" draft sections. Reload before editing or publishing.");});}
 async function restoreMedia(files:File[]){await run(async()=>{let restored=0,existing=0;for(const file of files){const body=new FormData();body.set("file",file);const r=await fetch("/api/manage/media-backup",{method:"POST",body});const d=await r.json();if(!r.ok)throw Error(file.name+": "+d.error+" ("+restored+" restored so far)");if(d.inserted)restored++;else existing++;}await load();setStatus(restored+" media files restored; "+existing+" existing IDs skipped.");});}
 return <div className="manage-fields"><h3>Restore content backup</h3><p>Import an exported JSON file into private drafts. If any referenced media is missing, restore those files first.</p><label>JSON content backup<input type="file" accept=".json,application/json" disabled={busy} onChange={e=>{const f=e.target.files?.[0];e.target.value="";if(f)void importContent(f);}}/></label>
 <h3>Uploaded media backup</h3><p>Download original stored media files individually. Keep their UUID filenames unchanged to recover references. Bundled repository assets are not included.</p><button className="btn btn-outline" disabled={busy} onClick={()=>void run(load)}>Load uploaded files</button>
 {media&&<><p>{media.length} stored files, including private drafts and previous uploads.</p>{media.map(m=><div className="manage-item" key={m.id}><p style={{overflowWrap:"anywhere"}}>{m.id} · {m.mime} · {Math.ceil(Number(m.size)/1024)} KB</p><a className="btn btn-outline" href={"/api/manage/media-backup?id="+m.id} download>Download file ↓</a></div>)}</>}
 <label>Restore media files<input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" disabled={busy} onChange={e=>{const files=Array.from(e.target.files??[]);e.target.value="";if(files.length)void restoreMedia(files);}}/></label><p role="status">{busy?"Working…":status}</p></div>;
}
