import {life,socialProfiles,type SocialProfile,type Hobby} from "@/data/personal";
import {published,query} from "@/lib/portfolio-db";
export type LifeContent=typeof life;
export const personalDefaults={life,socials:socialProfiles};
function record(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==="object"&&!Array.isArray(v);}
function txt(v:unknown,max:number,required=true):v is string{return typeof v==="string"&&v.length<=max&&(!required||!!v.trim());}
export function validateLife(v:unknown):LifeContent|null{
 if(!record(v)||!txt(v.eyebrow,100)||!txt(v.title,150)||!txt(v.introduction,3000)||!txt(v.note,3000,false)||!Array.isArray(v.hobbies)||v.hobbies.length>50)return null;
 const hobbies:Hobby[]=[];
 for(const h of v.hobbies){if(!record(h)||!txt(h.title,100)||!txt(h.description,1500)||!txt(h.emoji??"",20,false))return null;hobbies.push({title:h.title.trim(),description:h.description.trim(),emoji:String(h.emoji??"").trim()});}
 return {eyebrow:v.eyebrow.trim(),title:v.title.trim(),introduction:v.introduction.trim(),note:v.note.trim(),hobbies};
}
export function validateSocials(v:unknown):SocialProfile[]|null{
 if(!Array.isArray(v)||v.length>50)return null;
 const out:SocialProfile[]=[];const seen=new Set<string>();
 for(const row of v){if(!record(row)||!txt(row.name,80)||!txt(row.url,500)||!txt(row.kind,80)||typeof row.visible!=="boolean")return null;
 try{const u=new URL(row.url);if(u.protocol!=="https:"||u.username||u.password||!u.hostname||seen.has(u.href))return null;seen.add(u.href);out.push({name:row.name.trim(),url:u.href,kind:row.kind.trim(),visible:row.visible});}catch{return null;}}
 return out;
}
export async function publicLife(){return validateLife(await published("life",life))??life;}
export async function publicSocials(){return (validateSocials(await published("socials",socialProfiles))??socialProfiles).filter(x=>x.visible);}
export async function personalDraft(section:"life"|"socials"){const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section=$1",[section]);return rows[0]?.content?JSON.parse(rows[0].content):personalDefaults[section];}
