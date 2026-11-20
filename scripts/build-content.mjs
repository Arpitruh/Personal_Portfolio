// Compile CMS-edited JSON records into a deterministic client-safe catalog.
// Vercel runs this before builds; no runtime GitHub API or database is used.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, basename } from "node:path";
const root=process.cwd();
const source=join(root,"content/projects"),target=join(root,"src/content/generated/projects.json");
const bad=(path,reason)=>{throw new Error("Invalid CMS project "+path+": "+reason)};
const slug=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedCategories=new Set(["Products","Platform","AI","Frontend"]);
const allowedStatuses=new Set(["Building","Shipped","Iterating"]);
const allowedAccents=new Set(["mint","peach","violet","blue","yellow"]);
function checkText(value,name,path){if(typeof value!=="string"||!value.trim())bad(path,name+" is required");}
async function main(){
 const files=(await readdir(source)).filter(x=>x.endsWith(".json")).sort();
 const projects=[];const seen=new Set();
 for(const file of files){
   const path=join(source,file);
   const item=JSON.parse(await readFile(path,"utf8"));
   for(const name of ["slug","title","kicker","summary","category","status","year","emoji","accent","github","challenge","approach","next"]) checkText(item[name],name,file);
   if(!slug.test(item.slug)||basename(file)!==item.slug+".json")bad(file,"filename and slug must match in lowercase kebab-case");
   if(seen.has(item.slug))bad(file,"duplicate slug");
   seen.add(item.slug);
   if(!allowedCategories.has(item.category))bad(file,"unsupported category");
   if(!allowedStatuses.has(item.status))bad(file,"unsupported status");
   if(!allowedAccents.has(item.accent))bad(file,"unsupported theme accent");
   const url=new URL(item.github);
   if(url.protocol!=="https:"||url.hostname!=="github.com"||!url.pathname.startsWith("/"))bad(file,"GitHub URL must use https://github.com/");
   if(item.live){const live=new URL(item.live);if(live.protocol!=="https:")bad(file,"live URL must use HTTPS");}
   if(!Array.isArray(item.stack)||!item.stack.every(x=>typeof x==="string"&&x.trim()))bad(file,"stack must be a list");
   if(!Array.isArray(item.highlights)||!item.highlights.every(x=>typeof x==="string"&&x.trim()))bad(file,"highlights must be a list");
   if(item.image){
     if(typeof item.image.src!=="string"||!/^\\/(?:projects|uploads\\/images)\\/[a-z0-9/_-]+\\.(png|jpg|jpeg|webp)$/.test(item.image.src))bad(file,"image must be a local uploaded asset");
     for(const key of ["alt","caption"])checkText(item.image[key],"image."+key,file);
   }
   projects.push(item);
 }
 if(!projects.length)throw new Error("At least one project is needed");
 await mkdir(join(root,"src/content/generated"),{recursive:true});
 await writeFile(target,JSON.stringify(projects,null,2)+"\n");
 console.log("CMS catalog: "+projects.length+" projects verified and compiled");
}
await main();
