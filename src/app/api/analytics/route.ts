import {NextRequest} from "next/server";
import {query,databaseConfigured} from "@/lib/portfolio-db";
import {isAdmin} from "@/lib/admin-session";
const paths=new Set(["/","/about","/life","/projects","/world","/room","/play","/now","/contact","/skills","/recruiter","/achievements","/assistant"]);
export async function POST(req:NextRequest){
 if(!databaseConfigured()||process.env.NODE_ENV!=="production"||process.env.VERCEL_ENV==="preview")return new Response(null,{status:204});
 if(req.headers.get("origin")!==req.nextUrl.origin)return new Response(null,{status:403});
 if(req.headers.get("dnt")==="1"||req.headers.get("sec-gpc")==="1"||await isAdmin())return new Response(null,{status:204});
 try{const raw=await req.text();if(raw.length>500)return new Response(null,{status:400});const {path,event}=JSON.parse(raw);
 if(typeof path!=="string"||(!paths.has(path)&&!/^\/projects\/[a-z0-9-]{1,100}$/.test(path))||!["view","resume_click"].includes(event)||(event==="resume_click"&&path!=="/recruiter"))return new Response(null,{status:400});
 // Bound new project path cardinality to the published catalog.
 if(path.startsWith("/projects/")){const {publicProjects}=await import("@/lib/project-content");if(!(await publicProjects()).some(p=>"/projects/"+p.slug===path))return new Response(null,{status:400});}
 await query("INSERT INTO portfolio_analytics_daily(day,path,event,total) VALUES ((now() AT TIME ZONE 'UTC')::date,$1,$2,1) ON CONFLICT(day,path,event) DO UPDATE SET total=portfolio_analytics_daily.total+1",[path,event]);
 return new Response(null,{status:204});}catch{return new Response(null,{status:503});}
}
