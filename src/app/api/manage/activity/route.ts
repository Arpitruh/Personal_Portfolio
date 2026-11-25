import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {activityDraft,validateActivity} from "@/lib/activity-content";
export const dynamic="force-dynamic";
const fail=(error:string,status:number)=>NextResponse.json({error},{status});
export async function GET(){if(!await isAdmin())return fail("Unauthorized",401);try{return NextResponse.json(await activityDraft(),{headers:{"Cache-Control":"private, no-store"}});}catch{return fail("Storage unavailable",503);}}
export async function PUT(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{const body=await req.json(),content=validateActivity(body.content);if(!content||typeof body.publish!=="boolean")return fail("Invalid content. Check required fields and HTTPS links.",400);
 const params=[JSON.stringify(content)];
 if(body.publish)await query("WITH changed AS (INSERT INTO portfolio_content(section,draft,published) VALUES ('activity',$1::jsonb,$1::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,published=EXCLUDED.published,updated_at=now() RETURNING section,published) INSERT INTO portfolio_revisions(section,content) SELECT section,published FROM changed",params);
 else await query("INSERT INTO portfolio_content(section,draft) VALUES ('activity',$1::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now()",params);
 return NextResponse.json({ok:true});}catch{return fail("Save failed",503);}
}
