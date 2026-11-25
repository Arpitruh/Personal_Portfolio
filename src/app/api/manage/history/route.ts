import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
export const dynamic="force-dynamic";
const sections=["profile","projects","career","life","socials","library","resume","appearance"];
const fail=(error:string,status:number)=>NextResponse.json({error},{status});
const headers={"Cache-Control":"private, no-store"};
export async function GET(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 try{
 const section=req.nextUrl.searchParams.get("section"),id=req.nextUrl.searchParams.get("id"),before=req.nextUrl.searchParams.get("before");
 if(section&&!sections.includes(section))return fail("Invalid section",400);
 if(id){if(!/^\d{1,18}$/.test(id))return fail("Invalid revision",400);const rows=await query<{id:string;section:string;content:string;created_at:string}>("SELECT id::text,section,content::text,created_at::text FROM portfolio_revisions WHERE id=$1::bigint",[id]);if(!rows[0]||!sections.includes(rows[0].section))return fail("Revision not found",404);return NextResponse.json({...rows[0],content:JSON.parse(rows[0].content)},{headers});}
 if(before&&!/^\d{1,18}$/.test(before))return fail("Invalid cursor",400);
 const rows=await query<{id:string;section:string;created_at:string}>("SELECT id::text,section,created_at::text FROM portfolio_revisions WHERE section=ANY(string_to_array($1,',')) AND ($2='' OR section=$2) AND ($3='' OR id<NULLIF($3,'')::bigint) ORDER BY id DESC LIMIT 51",[sections.join(","),section??"",before??""]);
 return NextResponse.json({items:rows.slice(0,50),next:rows.length>50?rows[49].id:null},{headers});
 }catch{return fail("History unavailable",503);}
}
export async function POST(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{
 const body=await req.json();if(typeof body.id!=="string"||!/^\d{1,18}$/.test(body.id))return fail("Invalid revision",400);
 // Restore to draft only. Preserve the existing draft in history in the same statement.
 const rows=await query<{section:string}>("WITH selected AS (SELECT section,content FROM portfolio_revisions WHERE id=$1::bigint AND section=ANY(string_to_array($2,','))), locked AS (SELECT c.section,c.draft FROM portfolio_content c JOIN selected s ON s.section=c.section FOR UPDATE OF c), snapshot AS (INSERT INTO portfolio_revisions(section,content) SELECT section,draft FROM locked WHERE draft IS NOT NULL RETURNING id), restored AS (INSERT INTO portfolio_content(section,draft) SELECT section,content FROM selected ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now() RETURNING section) SELECT section FROM restored",[body.id,sections.join(",")]);
 if(!rows[0])return fail("Revision not found",404);
 return NextResponse.json({ok:true,section:rows[0].section},{headers});
 }catch{return fail("Restore failed",503);}
}
