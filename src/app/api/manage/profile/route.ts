import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {profileDraft,validateProfile} from "@/lib/profile-content";
export const dynamic="force-dynamic";
const fail=(error:string,status:number)=>NextResponse.json({error},{status});
export async function GET(){if(!await isAdmin())return fail("Unauthorized",401);try{return NextResponse.json(await profileDraft(),{headers:{"Cache-Control":"no-store"}});}catch{return fail("Storage unavailable",503);}}
export async function PUT(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{
 const body=await req.json();const value=validateProfile(body.content);
 if(!value||typeof body.publish!=="boolean")return fail("Invalid profile details",400);
 if(body.publish){await query("WITH changed AS (INSERT INTO portfolio_content(section,draft,published) VALUES ('profile',$1::jsonb,$1::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,published=EXCLUDED.published,updated_at=now() RETURNING section,published) INSERT INTO portfolio_revisions(section,content) SELECT section,published FROM changed",[JSON.stringify(value)]);}
 else await query("INSERT INTO portfolio_content(section,draft) VALUES ('profile',$1::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now()",[JSON.stringify(value)]);
 return NextResponse.json({ok:true});
 }catch{return fail("Unable to save profile",503);}
}
