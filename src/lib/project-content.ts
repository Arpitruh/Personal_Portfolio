import {projects,type PortfolioProject} from "@/data/portfolio";
import {published,query} from "@/lib/portfolio-db";
const categories=["Products","Platform","AI","Frontend"],statuses=["Building","Shipped","Iterating"],accents=["mint","peach","violet","blue","yellow"];
function object(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==="object"&&!Array.isArray(v);}
function text(v:unknown,max:number):v is string{return typeof v==="string"&&!!v.trim()&&v.length<=max;}
function url(v:unknown,github=false):v is string{if(!text(v,1000))return false;try{const u=new URL(v);return u.protocol==="https:"&&!u.username&&!u.password&&(!github||u.hostname==="github.com");}catch{return false;}}
export function validateProjects(value:unknown):PortfolioProject[]|null{
 if(!Array.isArray(value)||value.length>100)return null;
 const output:PortfolioProject[]=[],seen=new Set<string>();
 for(const row of value){
 if(!object(row))return null;
 for(const k of ["slug","title","kicker","summary","category","status","year","emoji","accent","challenge","approach","next"]){if(!text(row[k],["summary","challenge","approach","next"].includes(k)?8000:200))return null;}
 const slug=String(row.slug);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>100||seen.has(slug)||!categories.includes(String(row.category))||!statuses.includes(String(row.status))||!accents.includes(String(row.accent))||!/^\d{4}$/.test(String(row.year))||!url(row.github)||!url(row.github,true)||row.live&& !url(row.live))return null;
 if(!Array.isArray(row.stack)||row.stack.length>80||!row.stack.every(s=>text(s,150))||!Array.isArray(row.highlights)||row.highlights.length>80||!row.highlights.every(s=>text(s,2000))||typeof row.featured!=="boolean")return null;
 let image:PortfolioProject["image"];
 if(row.image){if(!object(row.image)||!text(row.image.src,500)||!(/^\/(?:projects|uploads\/images)\/[a-zA-Z0-9/_-]+\.(?:png|jpg|jpeg|webp)$/.test(row.image.src)||/^\/api\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(row.image.src))||!text(row.image.alt,250)||!text(row.image.caption,500))return null;image={src:row.image.src,alt:row.image.alt,caption:row.image.caption};}
 seen.add(slug);
 output.push({slug,title:String(row.title).trim(),kicker:String(row.kicker).trim(),summary:String(row.summary).trim(),category:row.category as PortfolioProject["category"],status:row.status as PortfolioProject["status"],year:String(row.year),emoji:String(row.emoji),accent:String(row.accent),stack:row.stack as string[],github:row.github as string,live:row.live?String(row.live):undefined,image,featured:row.featured,challenge:String(row.challenge),approach:String(row.approach),highlights:row.highlights as string[],next:String(row.next)});
 }
 return output;
}
export async function publicProjects(){return validateProjects(await published("projects",projects))??projects;}
export async function projectDraft(){const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section='projects'");return rows[0]?.content?validateProjects(JSON.parse(rows[0].content))??projects:projects.map(p=>({...p,featured:!!p.featured}));}
