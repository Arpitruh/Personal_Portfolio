"use client";
import {usePathname} from "next/navigation";
import {useEffect,useRef} from "react";
function send(path:string,event:string){
 if(navigator.doNotTrack==="1"||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl)return;
 const data=JSON.stringify({path,event});
 void fetch("/api/analytics",{method:"POST",body:data,headers:{"Content-Type":"application/json"},keepalive:true}).catch(()=>{});
}
export function AnalyticsTracker(){
 const path=usePathname(),last=useRef("");
 useEffect(()=>{if(!path||path.startsWith("/manage")||last.current===path)return;last.current=path;send(path,"view");},[path]);
 useEffect(()=>{function click(e:MouseEvent){if(path==="/recruiter"&&e.target instanceof Element&&e.target.closest("[data-resume-download]"))send(path,"resume_click");}document.addEventListener("click",click);return()=>document.removeEventListener("click",click);},[path]);
 return null;
}
