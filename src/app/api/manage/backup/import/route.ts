import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {validateBackup} from "@/lib/backup-validation";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 try{
 const raw=await req.text();if(Buffer.byteLength(raw)>2*1024*1024)return NextResponse.json({error:"Backup exceeds 2 MB."},{status:413});
 let body:unknown;try{body=JSON.parse(raw);}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const media=await query<{id:string;mime:string}>("SELECT id::text,mime FROM portfolio_media");
 let entries;try{entries=validateBackup(body,new Map(media.map(x=>[x.id,x.mime])));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Invalid backup."},{status:400});}
 await query("WITH incoming AS (SELECT section,content FROM jsonb_to_recordset($1::jsonb) AS x(section text,content jsonb)), locked AS (SELECT c.section,c.draft FROM portfolio_content c JOIN incoming i ON i.section=c.section FOR UPDATE OF c), snapshots AS (INSERT INTO portfolio_revisions(section,content) SELECT section,draft FROM locked WHERE draft IS NOT NULL RETURNING id) INSERT INTO portfolio_content(section,draft) SELECT section,content FROM incoming ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now()",[JSON.stringify(entries)]);
 return NextResponse.json({ok:true,sections:entries.map(x=>x.section)});
 }catch{return NextResponse.json({error:"Import failed. No publish operation was performed."},{status:503});}
}
