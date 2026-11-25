import {experience,skills,milestones} from "@/data/portfolio";
import {published,query} from "@/lib/portfolio-db";
export type Education={qualification:string;institution:string;period:string;description:string};
export const careerDefaults={experience,skills,milestones,education:[{qualification:"B.Tech in Computer Science",institution:"",period:"2024",description:""}] as Education[]};
export type CareerContent=typeof careerDefaults;
function obj(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==="object"&&!Array.isArray(v);}
function txt(v:unknown,max:number,optional=false):v is string{return typeof v==="string"&&v.length<=max&&(optional||!!v.trim());}
function list(v:unknown):v is string[]{return Array.isArray(v)&&v.length<=80&&v.every(x=>txt(x,150));}
export function validateCareer(v:unknown):CareerContent|null{
 if(!obj(v)||!Array.isArray(v.experience)||!Array.isArray(v.skills)||!Array.isArray(v.milestones)||!Array.isArray(v.education)||[v.experience,v.skills,v.milestones,v.education].some(a=>a.length>60))return null;
 const out:CareerContent={experience:[],skills:[],milestones:[],education:[]};
 for(const x of v.experience){if(!obj(x)||!txt(x.company,200)||!txt(x.role,200)||!txt(x.period,100)||!txt(x.description,4000)||!list(x.tags))return null;out.experience.push({company:x.company.trim(),role:x.role.trim(),period:x.period.trim(),description:x.description.trim(),tags:x.tags});}
 const groups=new Set<string>();
 for(const x of v.skills){if(!obj(x)||!txt(x.group,100)||!list(x.items)||!x.items.length||groups.has(x.group.trim()))return null;groups.add(x.group.trim());out.skills.push({group:x.group.trim(),items:[...new Set(x.items.map(s=>s.trim()))]});}
 for(const x of v.milestones){if(!obj(x)||!txt(x.label,100)||!txt(x.title,200)||!txt(x.description,4000))return null;out.milestones.push({label:x.label.trim(),title:x.title.trim(),description:x.description.trim()});}
 for(const x of v.education){if(!obj(x)||!txt(x.qualification,200)||!txt(x.institution,200,true)||!txt(x.period,100)||!txt(x.description,4000,true))return null;out.education.push({qualification:x.qualification.trim(),institution:x.institution.trim(),period:x.period.trim(),description:x.description.trim()});}
 return out;
}
export async function publicCareer(){return validateCareer(await published("career",careerDefaults))??careerDefaults;}
export async function careerDraft(){const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section='career'");return rows[0]?.content?validateCareer(JSON.parse(rows[0].content))??careerDefaults:careerDefaults;}
