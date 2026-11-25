import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {categories,libraryDraft,type LibraryEntry} from "@/lib/library-content";
import {randomUUID} from "node:crypto";
export const dynamic="force-dynamic";
const failure=(message:string,status=400)=>NextResponse.json({error:message},{status});
export async function GET(){
 if(!await isAdmin())return failure("Unauthorized",401);
 try{return NextResponse.json(await libraryDraft(),{headers:{"Cache-Control":"no-store"}});}catch{return failure("Storage unavailable",503);}
}
export async function POST(req:NextRequest){
 if(!await isAdmin())return failure("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return failure("Invalid origin",403);
 try{
 const form=await req.formData();
 const file=form.get("photo"),title=String(form.get("title")??"").trim(),alt=String(form.get("alt")??"").trim(),caption=String(form.get("caption")??"").trim(),category=String(form.get("category")??"");
 if(!(file instanceof File)||file.size<12||file.size>2*1024*1024||!title||title.length>120||!alt||alt.length>240||caption.length>1000||!categories.some(c=>c===category))return failure("Choose a JPEG, PNG or WebP up to 2 MB and enter valid details.");
 const b=Buffer.from(await file.arrayBuffer());
 const mime=b[0]===255&&b[1]===216&&b[2]===255?"image/jpeg":b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?"image/png":b.toString("ascii",0,4)==="RIFF"&&b.toString("ascii",8,12)==="WEBP"?"image/webp":"";
 if(!mime)return failure("Unsupported image");
 const id=randomUUID();
 const entry:LibraryEntry={id,src:"/api/media/"+id,alt,title,category,caption,featured:false,visible:false};
 await query("WITH media AS (INSERT INTO portfolio_media(id,mime,bytes) VALUES($1::uuid,$2,decode($3,'base64')) RETURNING id) INSERT INTO portfolio_content(section,draft) SELECT 'library',jsonb_build_array($4::jsonb) FROM media ON CONFLICT(section) DO UPDATE SET draft=COALESCE(portfolio_content.draft,portfolio_content.published,'[]'::jsonb)||EXCLUDED.draft,updated_at=now()",[id,mime,b.toString("base64"),JSON.stringify(entry)]);
 return NextResponse.json(entry,{status:201});
 }catch{return failure("Upload failed",503);}
}
export async function PATCH(req:NextRequest){
 if(!await isAdmin())return failure("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return failure("Invalid origin",403);
 try{
 const body=await req.json();if(body.action==="publish"){
 await query("WITH changed AS (UPDATE portfolio_content SET published=COALESCE(draft,'[]'::jsonb),updated_at=now() WHERE section='library' RETURNING section,published) INSERT INTO portfolio_revisions(section,content) SELECT section,published FROM changed");return NextResponse.json({ok:true});
 }
 if(typeof body.id!=="string"||!/^[0-9a-f-]{36}$/.test(body.id))return failure("Invalid entry");
 if(body.action==="remove"){await query("UPDATE portfolio_content SET draft=COALESCE((SELECT jsonb_agg(item) FROM jsonb_array_elements(COALESCE(draft,published,'[]'::jsonb)) item WHERE item->>'id'<>$1),'[]'::jsonb),updated_at=now() WHERE section='library'",[body.id]);}
 else if(body.action==="update"){
 const {title,alt,caption,category,visible,featured}=body;
 if(typeof title!=="string"||!title.trim()||title.length>120||typeof alt!=="string"||!alt.trim()||alt.length>240||typeof caption!=="string"||caption.length>1000||!categories.some(c=>c===category)||typeof visible!=="boolean"||typeof featured!=="boolean")return failure("Invalid details");
 await query("UPDATE portfolio_content SET draft=COALESCE((SELECT jsonb_agg(CASE WHEN item->>'id'=$1 THEN item||$2::jsonb ELSE item END ORDER BY ord) FROM jsonb_array_elements(COALESCE(draft,published,'[]'::jsonb)) WITH ORDINALITY AS e(item,ord)),'[]'::jsonb),updated_at=now() WHERE section='library'",[body.id,JSON.stringify({title,alt,caption,category,visible,featured})]);
 }else return failure("Invalid action");
 return NextResponse.json({ok:true});
 }catch{return failure("Update failed",503);}
}
