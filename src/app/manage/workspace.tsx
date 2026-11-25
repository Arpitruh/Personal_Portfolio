"use client";
import {useState,useEffect} from "react";
import Link from "next/link";
import {LifeEditor,SocialEditor} from "./personal-editor";
import {ActivityEditor} from "./activity-editor";
import {AnalyticsEditor} from "./analytics-editor";
import {SeoEditor} from "./seo-editor";
import {HistoryEditor} from "./history-editor";
import {AssetEditor} from "./asset-editor";
import {CareerEditor} from "./career-editor";
import {ProjectEditor} from "./project-editor";
import {ProfileEditor} from "./profile-editor";
import {LibraryEditor} from "./library-editor";
import {logout} from "./actions";
const modules=[
 {id:"profile",label:"Profile & homepage",icon:"◈",description:"Identity, biography and introduction",group:"Content",Editor:ProfileEditor},
 {id:"projects",label:"Projects",icon:"▣",description:"Case studies and featured work",group:"Content",Editor:ProjectEditor},
 {id:"career",label:"Career & skills",icon:"✳",description:"Experience, education and technologies",group:"Content",Editor:CareerEditor},
 {id:"life",label:"Personal life",icon:"♥",description:"Interests, hobbies and stories",group:"Content",Editor:LifeEditor},
 {id:"socials",label:"Social links",icon:"↗",description:"Public profiles and visibility",group:"Content",Editor:SocialEditor},
 {id:"activity",label:"Achievements & now",icon:"★",description:"Credentials and current activities",group:"Content",Editor:ActivityEditor},
 {id:"library",label:"Personal library",icon:"▧",description:"Photos, captions and collections",group:"Media",Editor:LibraryEditor},
 {id:"assets",label:"Resume & appearance",icon:"▤",description:"Official PDF, portraits and illustrations",group:"Media",Editor:AssetEditor},
 {id:"seo",label:"Search appearance",icon:"⌕",description:"Metadata and indexing",group:"Insights & settings",Editor:SeoEditor},
 {id:"analytics",label:"Analytics",icon:"◷",description:"Aggregate traffic and resume clicks",group:"Insights & settings",Editor:AnalyticsEditor},
 {id:"history",label:"History & backups",icon:"↶",description:"Restore drafts and export content",group:"Insights & settings",Editor:HistoryEditor}
];
export function ManageWorkspace(){
 const [active,setActive]=useState("overview"),[visited,setVisited]=useState<string[]>([]),[collapsed,setCollapsed]=useState(false),[mobileOpen,setMobileOpen]=useState(false);
 useEffect(()=>{const id=window.location.hash.slice(1);if(modules.some(m=>m.id===id)){setActive(id);setVisited([id]);}},[]);
 function select(id:string){setActive(id);setVisited(old=>old.includes(id)||id==="overview"?old:[...old,id]);setMobileOpen(false);window.history.replaceState(window.history.state,"",id==="overview"?window.location.pathname: "#"+id);document.getElementById("manage-content")?.scrollTo({top:0});}
 const selected=modules.find(m=>m.id===active);
 return <div className={"admin-workspace"+(collapsed?" admin-collapsed":"")}>
 <aside className={"admin-sidebar"+(mobileOpen?" admin-mobile-open":"")} aria-label="Management navigation">
 <div className="admin-brand"><span className="admin-mark" aria-hidden="true">AY</span><div className="admin-nav-label"><strong>Portfolio</strong><small>OWNER CONSOLE</small></div><button type="button" className="admin-collapse" aria-label={collapsed?"Expand sidebar":"Collapse sidebar"} onClick={()=>setCollapsed(!collapsed)}>{collapsed?"»":"«"}</button></div>
 <nav className="admin-nav"><button type="button" title="Overview" aria-current={active==="overview"?"page":undefined} onClick={()=>select("overview")}><span aria-hidden="true">⌂</span><span className="admin-nav-label">Overview</span></button>{["Content","Media","Insights & settings"].map(group=><div className="admin-nav-group" key={group}><p className="admin-nav-label">{group}</p>{modules.filter(m=>m.group===group).map(m=><button key={m.id} type="button" title={m.label} aria-current={active===m.id?"page":undefined} onClick={()=>select(m.id)}><span aria-hidden="true">{m.icon}</span><span className="admin-nav-label">{m.label}</span></button>)}</div>)}</nav>
 <div className="admin-sidebar-bottom"><Link href="/" title="View portfolio"><span aria-hidden="true">↗</span><span className="admin-nav-label">View portfolio</span></Link><form action={logout}><button type="submit" title="Log out"><span aria-hidden="true">⇥</span><span className="admin-nav-label">Log out</span></button></form></div>
 </aside>
 {mobileOpen&&<button type="button" className="admin-overlay" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
 <main id="main" className="admin-main"><header className="admin-topbar"><button type="button" className="admin-menu-toggle" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)}>☰</button><div><small>OWNER WORKSPACE / {selected?.group??"HOME"}</small><h1>{selected?.label??"Overview"}</h1></div><span className="admin-session"><i/> Signed in</span></header>
 <div className="admin-content" id="manage-content">
 {active==="overview"&&<><div className="admin-welcome"><span className="eyebrow">YOUR PRIVATE WORKSPACE</span><h2>Make it yours.</h2><p>Manage the portfolio from one place. Save changes as drafts and publish when ready.</p></div><div className="admin-summary"><div><small>Available modules</small><strong>{modules.length}</strong></div><div><small>Content workflow</small><strong>Draft → Publish</strong></div><div><small>Access</small><strong>Owner only</strong></div></div>{["Content","Media","Insights & settings"].map(group=><section key={group} className="admin-overview-group"><h2>{group}</h2><div className="admin-module-grid">{modules.filter(m=>m.group===group).map(m=><button key={m.id} type="button" onClick={()=>select(m.id)}><span className="admin-module-icon" aria-hidden="true">{m.icon}</span><strong>{m.label}</strong><small>{m.description}</small><span className="admin-card-arrow" aria-hidden="true">↗</span></button>)}</div></section>)}</>}
 {modules.filter(m=>visited.includes(m.id)).map(m=><div key={m.id} hidden={active!==m.id}><m.Editor/></div>)}
 <footer className="admin-footer">Portfolio management · Private workspace</footer></div></main></div>;
}
