import {validateProfile} from "@/lib/profile-content";
import {validateProjects} from "@/lib/project-content";
import {validateCareer} from "@/lib/career-content";
import {validateLife,validateSocials} from "@/lib/personal-content";
import {validateActivity} from "@/lib/activity-content";
import {validateSeo} from "@/lib/seo-content";
import {assetSlots} from "@/lib/asset-content";
import {categories} from "@/lib/library-content";
import {safePersonalImage} from "@/data/personal";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function obj(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==="object"&&!Array.isArray(v);}
function txt(v:unknown,max:number,optional=false):v is string{return typeof v==="string"&&v.length<=max&&(optional||!!v.trim());}
function mediaId(path:unknown){return typeof path==="string"&&path.startsWith("/api/media/")&&uuid.test(path.slice(11))?path.slice(11):null;}
export function validateBackup(raw:unknown,available:Map<string,string>){
 if(!obj(raw)||raw.format!=="portfolio-content-v1"||!obj(raw.content))throw Error("Unsupported backup format.");
 const result:{section:string;content:unknown}[]=[];
 const imagePath=(src:unknown)=>!!safePersonalImage(src)||(!!mediaId(src)&&["image/jpeg","image/png","image/webp"].includes(available.get(mediaId(src)!)??""));
 for(const [section,entry] of Object.entries(raw.content)){
 if(!obj(entry))throw Error("Invalid backup entry: "+section);
 const v=entry.draft??entry.published;let value:unknown=null;
 switch(section){
 case "profile":value=validateProfile(v);break;
 case "projects":value=validateProjects(Array.isArray(v)?v.map(p=>obj(p)?{...p,featured:!!p.featured}:p):v);if(Array.isArray(value)&&value.some(p=>p.image&&mediaId(p.image.src)&&!imagePath(p.image.src)))value=null;break;
 case "career":value=validateCareer(v);break;
 case "life":value=validateLife(v);break;
 case "socials":value=validateSocials(v);break;
 case "activity":value=validateActivity(v);break;
 case "seo":value=validateSeo(v);break;
 case "resume":
 if(obj(v)&&txt(v.label,120)&&txt(v.updated,100,true)&&txt(v.note,1000,true)&&typeof v.file==="string"&&(v.file===""||(/^\/uploads\/resumes\/[a-zA-Z0-9_.-]+\.pdf$/i.test(v.file)&&!v.file.includes(".."))||(!!mediaId(v.file)&&available.get(mediaId(v.file)!)==="application/pdf")))value={file:v.file,label:v.label,updated:v.updated,note:v.note};break;
 case "appearance":
 if(obj(v)&&assetSlots.every(k=>v[k]===null||(obj(v[k])&&imagePath(v[k].src)&&txt(v[k].alt,240)&&txt(v[k].caption??"",1000,true))))value=Object.fromEntries(assetSlots.map(k=>{const a=v[k];return [k,obj(a)?{src:a.src,alt:a.alt,caption:a.caption??""}:null];}));break;
 case "library":
 if(Array.isArray(v)&&v.length<=1000&&v.every(x=>obj(x)&&typeof x.id==="string"&&uuid.test(x.id)&&x.src==="/api/media/"+x.id&&imagePath(x.src)&&txt(x.title,120)&&txt(x.alt,240)&&txt(x.caption??"",1000,true)&&categories.some(c=>c===x.category)&&typeof x.visible==="boolean"&&typeof x.featured==="boolean")&&new Set(v.map(x=>x.id)).size===v.length)value=v.map(x=>({id:x.id,src:x.src,title:x.title,alt:x.alt,caption:x.caption??"",category:x.category,visible:x.visible,featured:x.featured}));break;
 default:throw Error("Unknown backup section: "+section);
 }
 if(value===null)throw Error("Invalid content or missing uploaded media in "+section+". Restore media first if needed.");
 result.push({section,content:value});
 }
 if(!result.length)throw Error("Backup has no sections.");
 return result;
}
