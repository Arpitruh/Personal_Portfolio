import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {careerDraft,validateCareer} from "@/lib/career-content";
export const dynamic="force-dynamic";
const fail=(error:string,status:number)=>NextResponse.json({error},{status});
export async function GET(){if(!await isAdmin())return fail("Unauthorized",401);try{return NextResponse.json(await careerDraft(),{headers:{"Cache-Control":"no-store"}});}catch{return fail("Storage unavailable",503);}}
export async function PUT(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{const body=await req.json(),value=validateCareer(body.content);if(!value||typeof body.publish!=="boolean")return fail("Invalid career content. Check required fields and unique skill groups.",400);
 const params=[JSON.stringify(value)];
 if(body.publish)await query("WITH changed AS (INSERT INTO portfolio_content(section,draft,published) VALUES ('career',$1::jsonb,$1::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,published=EXCLUDED.published,updated_at=now() RETURNING section,published) INSERT INTO portfolio_revisions(section,content) SELECT section,published FROM changed",params);
 else await query("INSERT INTO portfolio_content(section,draft) VALUES ('career',$1::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now()",params);
 return NextResponse.json({ok:true});}catch{return fail("Save failed",503);}
}
