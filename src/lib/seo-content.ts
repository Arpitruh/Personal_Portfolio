import {profile} from "@/data/portfolio";
import {published,query} from "@/lib/portfolio-db";
export const seoDefaults={title:"Arpit Yadav | Portfolio World",titleSuffix:"Arpit Yadav",description:profile.summary,siteName:"Portfolio World",keywords:["Arpit Yadav","Software Engineer","Frontend Developer","Next.js","React","TypeScript","Portfolio"],socialTitle:"Arpit Yadav | Portfolio World",socialDescription:profile.summary,indexable:true};
export type SeoContent=typeof seoDefaults;
export function validateSeo(v:unknown):SeoContent|null{
 if(!v||typeof v!=="object")return null;
 const x=v as Record<string,unknown>;
 const result={...seoDefaults};
 for(const key of ["title","titleSuffix","description","siteName","socialTitle","socialDescription"] as const){const s=x[key];if(typeof s!=="string"||!s.trim()||s.length>(key.toLowerCase().includes("description")?500:120))return null;result[key]=s.trim();}
 if(!Array.isArray(x.keywords)||x.keywords.length>30||!x.keywords.every(k=>typeof k==="string"&&k.trim()&&k.length<=100)||typeof x.indexable!=="boolean")return null;
 result.keywords=[...new Set(x.keywords.map(k=>String(k).trim()))];result.indexable=x.indexable;return result;
}
export async function publicSeo(){return validateSeo(await published("seo",seoDefaults))??seoDefaults;}
export async function seoDraft(){const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section='seo'");return rows[0]?.content?validateSeo(JSON.parse(rows[0].content))??seoDefaults:seoDefaults;}
export function allowIndexing(seo:SeoContent){return seo.indexable&&!(process.env.VERCEL&&process.env.VERCEL_ENV!=="production");}
