"use client";

import Image from "next/image";
import {useRef,useState} from "react";
import type {GalleryMoment} from "@/data/personal";

const collections=[
 {name:"Travel Diaries",icon:"↗",description:"Journeys, places and little discoveries.",aliases:["Places","Travel"]},
 {name:"Through My Lens",icon:"◉",description:"Everyday details and photographic observations.",aliases:["Photography"]},
 {name:"Creative Corner",icon:"✦",description:"Illustrations, visual stories and creative experiments.",aliases:["Creative"]},
 {name:"Memory Vault",icon:"◇",description:"Meaningful moments and memories worth keeping.",aliases:["Everyday","Other","Personal"]},
];
function collectionFor(category:string){
 return collections.find(c=>c.name===category||c.aliases.includes(category))?.name??"Memory Vault";
}

export function PersonalGallery({moments}:{moments:GalleryMoment[]}) {
 const [selected,setSelected]=useState("All");
 const [active,setActive]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);
 const visible=moments.filter(m=>selected==="All"||collectionFor(m.category)===selected);
 const current=visible[active];
 function open(index:number,button:HTMLButtonElement){
  trigger.current=button;
  setActive(index);
  dialog.current?.showModal();
 }
 function move(direction:number){
  if(visible.length)setActive(i=>(i+direction+visible.length)%visible.length);
 }
 function close(){dialog.current?.close();}
 return <section className="inner-section personal-gallery" id="moments" aria-labelledby="moments-heading">
  <div className="section-intro"><div><span className="eyebrow">PERSONAL LIBRARY / FOUR COLLECTIONS</span><h2 id="moments-heading">My personal <em>library.</em></h2><p>A few corners of life beyond code, collected one story at a time.</p></div></div>
  <div className="library-collections" role="group" aria-label="Personal library collections">
   {collections.map((c,i)=><button key={c.name} type="button" className={"library-collection collection-"+i} aria-pressed={selected===c.name} onClick={()=>{setSelected(c.name);setActive(0);}}>
    <span className="library-collection-top"><span aria-hidden="true">{c.icon}</span><small>{String(i+1).padStart(2,"0")} / COLLECTION</small></span>
    <strong>{c.name}</strong><span>{c.description}</span><small>{moments.filter(m=>collectionFor(m.category)===c.name).length} items</small>
   </button>)}
  </div>
  <div className="library-filter-bar"><button type="button" className="btn btn-outline" aria-pressed={selected==="All"} onClick={()=>{setSelected("All");setActive(0);}}>All collections</button><span role="status">{selected} · {visible.length} {visible.length===1?"item":"items"}</span></div>
  {visible.length>0?<div className="personal-gallery-grid">{visible.map((moment,index)=><figure key={moment.src+"-"+index} className={"personal-gallery-card"+(moment.featured?" gallery-featured":"")}>
   <button className="personal-gallery-photo library-photo-button" type="button" aria-label={"View "+moment.title} onClick={e=>open(index,e.currentTarget)}><Image src={moment.src} unoptimized={moment.src.startsWith("/api/media/")} alt={moment.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 32vw" /></button>
   <figcaption><span className="eyebrow">{collectionFor(moment.category)}</span><h3>{moment.title}</h3>{moment.caption&&<p>{moment.caption}</p>}</figcaption>
  </figure>)}</div>:<div className="personal-gallery-empty"><span className="personal-gallery-placeholder" aria-hidden="true">▧</span><div><h3>{selected==="All"?"A library in the making.":selected+" is waiting for its first story."}</h3><p>New entries will appear here when they are ready to share.</p></div></div>}
  <dialog ref={dialog} className="library-dialog" aria-label="Personal library image viewer" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==="ArrowLeft"){e.preventDefault();move(-1);}if(e.key==="ArrowRight"){e.preventDefault();move(1);}}}>
   {current&&<div className="library-viewer"><div className="library-viewer-head"><span>{active+1} / {visible.length}</span><button type="button" className="icon-button" aria-label="Close image viewer" onClick={close}>×</button></div><div className="library-viewer-image"><Image src={current.src} unoptimized={current.src.startsWith("/api/media/")} alt={current.alt} fill sizes="90vw"/></div><div className="library-viewer-controls"><button type="button" className="icon-button" aria-label="Previous image" disabled={visible.length<2} onClick={()=>move(-1)}>←</button><div aria-live="polite"><strong>{current.title}</strong>{current.caption&&<p>{current.caption}</p>}</div><button type="button" className="icon-button" aria-label="Next image" disabled={visible.length<2} onClick={()=>move(1)}>→</button></div></div>}
  </dialog>
 </section>;
}
