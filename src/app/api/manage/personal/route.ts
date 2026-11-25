import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {personalDraft,validateLife,validateSocials} from "@/lib/personal-content";
export const dynamic="force-dynamic";
const fail=(error:string,status:number)=>NextResponse.json({error},{status});
export async function GET(req:NextRequest){if(!await isAdmin())return fail("Unauthorized",401);const section=req.nextUrl.searchParams.get("section");if(section!=="life"&&section!=="socials")return fail("Invalid section",400);try{return NextResponse.json(await personalDraft(section),{headers:{"Cache-Control":"no-store"}});}catch{return fail("Storage unavailable",503);}}
export async function PUT(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{const body=await req.json();const section=body.section;
 if(section!=="life"&&section!=="socials")return fail("Invalid section",400);
 const content=section==="life"?validateLife(body.content):validateSocials(body.content);
 if(!content||typeof body.publish!=="boolean")return fail("Invalid content; check required fields and HTTPS URLs.",400);
 const params=[section,JSON.stringify(content)];
 if(body.publish)await query("WITH changed AS (INSERT INTO portfolio_content(section,draft,published) VALUES ($1,$2::jsonb,$2::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,published=EXCLUDED.published,updated_at=now() RETURNING section,published) INSERT INTO portfolio_revisions(section,content) SELECT section,published FROM changed",params);
 else await query("INSERT INTO portfolio_content(section,draft) VALUES ($1,$2::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now()",params);
 return NextResponse.json({ok:true});}catch{return fail("Save failed",503);}
}
