import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
export const dynamic="force-dynamic";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const extensions:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","application/pdf":"pdf"};
export async function GET(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
 const id=req.nextUrl.searchParams.get("id");
 if(id){if(!uuid.test(id))return new Response(null,{status:400});const rows=await query<{mime:string;data:string}>("SELECT mime,encode(bytes,'base64') AS data FROM portfolio_media WHERE id=$1::uuid",[id]);const row=rows[0];if(!row||!extensions[row.mime])return new Response(null,{status:404});
 return new Response(new Uint8Array(Buffer.from(row.data,"base64")),{headers:{"Content-Type":row.mime,"Content-Disposition":'attachment; filename="'+id+"."+extensions[row.mime]+'"',"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }
 const rows=await query<{id:string;mime:string;size:string;created_at:string}>("SELECT id::text,mime,octet_length(bytes)::text AS size,created_at::text FROM portfolio_media ORDER BY created_at DESC");
 return NextResponse.json(rows,{headers:{"Cache-Control":"private, no-store"}});
 }catch{return NextResponse.json({error:"Media backup unavailable"},{status:503});}
}
export async function POST(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 try{
 const form=await req.formData(),file=form.get("file");
 if(!(file instanceof File)||file.size<12||file.size>2*1024*1024)return NextResponse.json({error:"Choose a media backup file under 2 MB."},{status:400});
 const id=file.name.replace(/\.[^.]+$/,"");if(!uuid.test(id))return NextResponse.json({error:"Keep the exported UUID filename unchanged."},{status:400});
 const b=Buffer.from(await file.arrayBuffer());const mime=b.toString("ascii",0,5)==="%PDF-"?"application/pdf":b[0]===255&&b[1]===216&&b[2]===255?"image/jpeg":b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?"image/png":b.toString("ascii",0,4)==="RIFF"&&b.toString("ascii",8,12)==="WEBP"?"image/webp":"";
 if(!mime)return NextResponse.json({error:"Unsupported file format."},{status:400});
 const rows=await query<{id:string}>("INSERT INTO portfolio_media(id,mime,bytes) VALUES($1::uuid,$2,decode($3,'base64')) ON CONFLICT(id) DO NOTHING RETURNING id::text",[id,mime,b.toString("base64")]);
 return NextResponse.json({ok:true,inserted:!!rows.length});
 }catch{return NextResponse.json({error:"Media restore failed"},{status:503});}
}
