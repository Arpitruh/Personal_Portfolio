import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir,writeFile } from "node:fs/promises";

const origin="http://127.0.0.1:3100";
const server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p","3100"],{
  env:{...process.env,NEXT_TELEMETRY_DISABLED:"1"},stdio:"inherit"
});
let chrome;
const wait=async()=>{
 for(let attempt=0;attempt<100;attempt++){
  if(server.exitCode!==null) throw new Error("Next.js server stopped before Lighthouse");
  try{const r=await fetch(origin);if(r.ok)return;}catch{}
  await new Promise(resolve=>setTimeout(resolve,300));
 }
 throw new Error("Next.js server did not become ready");
};
try{
 await wait();
 chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:["--headless","--no-sandbox","--disable-dev-shm-usage"]});
 await mkdir("artifacts",{recursive:true});
 const reports=[];
 for(const config of [
  {name:"home-mobile",path:"/",formFactor:"mobile"},
  {name:"projects-mobile",path:"/projects",formFactor:"mobile"},
  {name:"home-desktop",path:"/",formFactor:"desktop"}
 ]){
  const result=await lighthouse(origin+config.path,{
    port:chrome.port,logLevel:"error",output:"json",onlyCategories:["performance","accessibility","best-practices","seo"],
    formFactor:config.formFactor,
    screenEmulation:config.formFactor==="desktop"?
      {mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false}:
      {mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false}
  });
  if(!result?.lhr)throw new Error("Lighthouse returned no report for "+config.name);
  const lhr=result.lhr;
  const scores=Object.fromEntries(Object.entries(lhr.categories).map(([name,cat])=>[name,Math.round((cat.score??0)*100)]));
  const shifts=(lhr.audits["layout-shift-elements"]?.details?.items??lhr.audits["cls-culprits-insight"]?.details?.items??[]).slice(0,4).map(item=>({node:item.node?.selector??item.node?.snippet??null,score:item.score??item.totalShift??null}));
  console.log("LAYOUT_SHIFT_CULPRITS "+config.name+": "+JSON.stringify(shifts));
  reports.push({page:config.name,url:config.path,scores,metrics:{
    lcp:lhr.audits["largest-contentful-paint"]?.numericValue??null,
    cls:lhr.audits["cumulative-layout-shift"]?.numericValue??null,
    tbt:lhr.audits["total-blocking-time"]?.numericValue??null
  }});
  await writeFile("artifacts/lighthouse-"+config.name+".json",JSON.stringify(lhr));
  console.log("LIGHTHOUSE "+config.name+": "+JSON.stringify(reports[reports.length-1]));
 }
 await writeFile("artifacts/lighthouse-summary.json",JSON.stringify(reports,null,2));
 // Scores are lab estimates, not real-user Core Web Vitals; report and iterate rather than
 // treating simulated single-run performance as a stable production release gate.
 if(reports.some(r=>r.scores.accessibility<75))process.exitCode=1;
}catch(e){console.error(e);process.exitCode=1;}
finally{if(chrome)await chrome.kill();server.kill("SIGTERM");}
