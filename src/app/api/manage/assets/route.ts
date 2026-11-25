import {NextRequest,NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
import {assetDraft,assetSlots,appearanceDefaults} from "@/lib/asset-content";
import {resume} from "@/data/personal";
export const dynamic="force-dynamic";
const fail=(error:string,status=400)=>NextResponse.json({error},{status});
export async function GET(){if(!await isAdmin())return fail("Unauthorized",401);try{const [appearance,resume]=await Promise.all([assetDraft("appearance"),assetDraft("resume")]);return NextResponse.json({appearance,resume},{headers:{"Cache-Control":"no-store"}});}catch{return fail("Storage unavailable",503);}}
export async function POST(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{
 const form=await req.formData(),slot=String(form.get("slot")),file=form.get("file"),isPdf=slot==="resume";
 if(!isPdf&&!assetSlots.some(s=>s===slot))return fail("Invalid slot");
 if(!(file instanceof File)||file.size<12||file.size>2*1024*1024)return fail("Choose a file up to 2 MB.");
 const b=Buffer.from(await file.arrayBuffer());
 const mime=isPdf?(b.toString("ascii",0,5)==="%PDF-"?"application/pdf":""):b[0]===255&&b[1]===216&&b[2]===255?"image/jpeg":b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?"image/png":b.toString("ascii",0,4)==="RIFF"&&b.toString("ascii",8,12)==="WEBP"?"image/webp":"";
 if(!mime)return fail("Unsupported file format.");
 const label=String(form.get("label")??"").trim(),alt=String(form.get("alt")??"").trim(),caption=String(form.get("caption")??"").trim();
 if(isPdf?(!label||label.length>120):(!alt||alt.length>240||caption.length>1000))return fail("Invalid details.");
 const id=randomUUID(),src="/api/media/"+id,section=isPdf?"resume":"appearance";
 const value=isPdf?{file:src,label,updated:new Date().toISOString().slice(0,10),note:""}:{src,alt,caption};
 const defaults=isPdf?resume:appearanceDefaults;
 const patch=isPdf?value:{[slot]:value};
 await query("WITH media AS (INSERT INTO portfolio_media(id,mime,bytes) VALUES($1::uuid,$2,decode($3,'base64')) RETURNING id) INSERT INTO portfolio_content(section,draft) SELECT $4,$5::jsonb||$6::jsonb FROM media ON CONFLICT(section) DO UPDATE SET draft=COALESCE(portfolio_content.draft,portfolio_content.published,$5::jsonb)||$6::jsonb,updated_at=now()",[id,mime,b.toString("base64"),section,JSON.stringify(defaults),JSON.stringify(patch)]);
 return NextResponse.json({ok:true},{status:201});
 }catch{return fail("Upload failed",503);}
}
export async function PATCH(req:NextRequest){
 if(!await isAdmin())return fail("Unauthorized",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Invalid origin",403);
 try{const body=await req.json(),section=body.section;
 if(section!=="resume"&&section!=="appearance")return fail("Invalid section");
 if(body.action==="publish"){await query("WITH changed AS (UPDATE portfolio_content SET published=draft,updated_at=now() WHERE section=$1 AND draft IS NOT NULL RETURNING section,published) INSERT INTO portfolio_revisions(section,content) SELECT section,published FROM changed",[section]);}
 else if(body.action==="reset"){const defaults=section==="resume"?resume:appearanceDefaults;await query("INSERT INTO portfolio_content(section,draft) VALUES($1,$2::jsonb) ON CONFLICT(section) DO UPDATE SET draft=EXCLUDED.draft,updated_at=now()",[section,JSON.stringify(defaults)]);}
 else if(body.action==="remove"&&section==="appearance"&&assetSlots.some(s=>s===body.slot)){await query("INSERT INTO portfolio_content(section,draft) VALUES('appearance',$1::jsonb||$2::jsonb) ON CONFLICT(section) DO UPDATE SET draft=COALESCE(portfolio_content.draft,portfolio_content.published,$1::jsonb)||$2::jsonb,updated_at=now()",[JSON.stringify(appearanceDefaults),JSON.stringify({[body.slot]:null})]);}
 else return fail("Invalid action");
 return NextResponse.json({ok:true});}catch{return fail("Save failed",503);}
}
