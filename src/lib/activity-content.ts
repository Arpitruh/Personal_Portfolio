import {published,query} from "@/lib/portfolio-db";
export type Achievement={title:string;issuer:string;date:string;description:string;url:string};
export const activityDefaults={intro:"A lightweight snapshot of ongoing projects and topics I'm exploring. For the latest changes, the repositories are the source of truth.",focus:["Frontend architecture and scalable components","Reusable services and developer experience","Making complex interfaces easier to navigate","Ship, inspect, improve, repeat"],note:"This page is intentionally curated and the repositories provide the freshest code updates.",achievements:[] as Achievement[]};
export type ActivityContent=typeof activityDefaults;
function txt(v:unknown,max:number,optional=false):v is string{return typeof v==="string"&&v.length<=max&&(optional||!!v.trim());}
export function validateActivity(v:unknown):ActivityContent|null{
 if(!v||typeof v!=="object")return null;
 const x=v as Record<string,unknown>;
 if(!txt(x.intro,3000)||!txt(x.note,3000,true)||!Array.isArray(x.focus)||x.focus.length>50||!x.focus.every(f=>txt(f,300))||!Array.isArray(x.achievements)||x.achievements.length>100)return null;
 const achievements:Achievement[]=[];
 for(const a of x.achievements){if(!a||typeof a!=="object"||!txt(a.title,200)||!txt(a.issuer,200,true)||!txt(a.date,100,true)||!txt(a.description,3000,true)||!txt(a.url,1000,true))return null;
 if(a.url){try{const u=new URL(a.url);if(u.protocol!=="https:"||u.username||u.password)return null;}catch{return null;}}
 achievements.push({title:a.title.trim(),issuer:a.issuer.trim(),date:a.date.trim(),description:a.description.trim(),url:a.url.trim()});}
 return {intro:x.intro.trim(),note:x.note.trim(),focus:x.focus.map(f=>f.trim()),achievements};
}
export async function publicActivity(){return validateActivity(await published("activity",activityDefaults))??activityDefaults;}
export async function activityDraft(){const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section='activity'");return rows[0]?.content?validateActivity(JSON.parse(rows[0].content))??activityDefaults:activityDefaults;}
