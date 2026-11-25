import {profile} from "@/data/portfolio";
import {published,query} from "@/lib/portfolio-db";
export const profileDefaults={name:profile.name,role:profile.role,location:profile.location,summary:profile.summary,headlineStart:"I make the web",headlineEnd:"feel alive.",heroDescription:"Software engineer by day. Builder by habit. I turn complex ideas into clean, playful digital experiences that people actually enjoy using.",availability:"OPEN TO INTERESTING CONVERSATIONS",eyebrow:"SOFTWARE ENGINEER / FULL STACK DEVELOPMENT",github:profile.github,email:profile.email,phone:profile.phone};
export type ProfileContent=typeof profileDefaults;
export function validateProfile(value:unknown):ProfileContent|null{
 if(!value||typeof value!=="object")return null;
 const input=value as Record<string,unknown>;
 const result={...profileDefaults};
 for(const key of Object.keys(profileDefaults) as (keyof ProfileContent)[]){
  const v=input[key];
  if(typeof v!=="string"||v.length>(key==="summary"||key==="heroDescription"?2000:250)||(!["email","phone","availability"].includes(key)&&!v.trim()))return null;
  result[key]=v.trim();
 }
 try{const u=new URL(result.github);if(u.protocol!=="https:"||u.hostname!=="github.com")return null;}catch{return null;}
 if(result.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email))return null;
 if(result.phone&&!/^\+?[0-9 ()-]{7,20}$/.test(result.phone))return null;
 return result;
}
export async function publicProfile(){return validateProfile(await published("profile",profileDefaults))??profileDefaults;}
export async function profileDraft(){const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section='profile'");return rows[0]?.content?validateProfile(JSON.parse(rows[0].content))??profileDefaults:profileDefaults;}
