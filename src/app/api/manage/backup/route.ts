import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {profileDefaults} from "@/lib/profile-content";
import {seoDefaults} from "@/lib/seo-content";
import {activityDefaults} from "@/lib/activity-content";
import {careerDefaults} from "@/lib/career-content";
import {personalDefaults} from "@/lib/personal-content";
import {appearanceDefaults} from "@/lib/asset-content";
import {projects} from "@/data/portfolio";
import {resume} from "@/data/personal";
export const dynamic="force-dynamic";
export async function GET(){
 if(!await isAdmin())return new Response("Unauthorized",{status:401});
 try{
 const defaults:Record<string,unknown>={profile:profileDefaults,career:careerDefaults,projects,life:personalDefaults.life,socials:personalDefaults.socials,appearance:appearanceDefaults,resume,library:[],activity:activityDefaults,seo:seoDefaults};
 const rows=await query<{section:string;draft:string|null;published:string|null;updated_at:string}>("SELECT section,draft::text,published::text,updated_at::text FROM portfolio_content ORDER BY section");
 const content=Object.fromEntries(Object.entries(defaults).map(([section,value])=>{const row=rows.find(r=>r.section===section);return [section,{draft:row?.draft?JSON.parse(row.draft):value,published:row?.published?JSON.parse(row.published):value,updatedAt:row?.updated_at??null}];}));
 const date=new Date().toISOString();
 return new Response(JSON.stringify({format:"portfolio-content-v1",exportedAt:date,content,mediaIncluded:false},null,2),{headers:{"Content-Type":"application/json; charset=utf-8","Content-Disposition":'attachment; filename="portfolio-content-'+date.slice(0,10)+'.json"',"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return new Response("Backup unavailable",{status:503});}
}
