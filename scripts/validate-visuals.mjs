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
const characterPack=JSON.parse(await readFile("content/character-pack.json","utf8"));
for(const pose of ["standing","sitting","coding","casual"]){
  if(!characterPack[pose]||typeof characterPack[pose]!=="object")throw Error("Character pack missing "+pose+" object");
  await check(characterPack[pose],"Character pack: "+pose);
}
if(!Array.isArray(data.moments))throw Error("Moments must be an array");
for(let i=0;i<data.moments.length;i++){
 const moment=data.moments[i];
 if(!moment?.visible)continue;
 if(typeof moment.title!=="string"||!moment.title.trim())throw Error("Public moment "+(i+1)+" needs a title");
 await check(moment,"Public moment "+(i+1));
}
console.log("Phase 15: published visual media validated");

const resumeSource=JSON.parse(await readFile("content/resume.json","utf8"));
if(resumeSource.file){
 if(typeof resumeSource.file!=="string"||!/^\/uploads\/resumes\/[a-zA-Z0-9_.-]+\.pdf$/i.test(resumeSource.file)||resumeSource.file.includes(".."))throw Error("Resume must be an approved local PDF file");
 const filename=join("public",resumeSource.file.slice(1));
 const file=await stat(filename).catch(()=>null);
 if(!file?.isFile()||file.size>8*1024*1024||file.size<100)throw Error("Published resume PDF missing or outside size limit: "+filename);
 const {open}=await import("node:fs/promises");
 const fd=await open(filename,"r");
 try {const magic=Buffer.alloc(5);await fd.read(magic,0,5,0);if(magic.toString()!=="%PDF-")throw Error("Published resume is not a PDF");}
 finally {await fd.close();}
}
