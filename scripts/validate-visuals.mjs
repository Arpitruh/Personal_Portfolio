import {readFile,stat} from "node:fs/promises";
import {join} from "node:path";
const data=JSON.parse(await readFile("content/visuals.json","utf8"));
const pattern=/^\/uploads\/images\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.(png|jpg|jpeg|webp)$/i;
async function check(asset,label){
 if(!asset?.src)return;
 if(typeof asset.src!=="string"||!pattern.test(asset.src))throw Error(label+": only local uploaded JPG, PNG and WebP paths are accepted");
 if(typeof asset.alt!=="string"||!asset.alt.trim())throw Error(label+": nonempty accessible alt text is required");
 const filename=join("public",asset.src.slice(1));
 const file=await stat(filename).catch(()=>null);
 if(!file?.isFile())throw Error(label+": uploaded image not found at "+filename);
 if(file.size>4*1024*1024)throw Error(label+": optimize image below 4 MB before publishing");
}
await check(data.portrait,"Real portrait");
await check(data.illustration,"Illustration");
if(!Array.isArray(data.moments))throw Error("Moments must be an array");
for(let i=0;i<data.moments.length;i++){
 const moment=data.moments[i];
 if(!moment?.visible)continue;
 if(typeof moment.title!=="string"||!moment.title.trim())throw Error("Public moment "+(i+1)+" needs a title");
 await check(moment,"Public moment "+(i+1));
}
console.log("Phase 15: published visual media validated");
