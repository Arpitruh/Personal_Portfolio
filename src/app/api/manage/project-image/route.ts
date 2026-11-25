import {NextRequest,NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 try{
 const form=await req.formData(),file=form.get("file");
 if(!(file instanceof File)||file.size<12||file.size>2*1024*1024)return NextResponse.json({error:"Image must be under 2 MB."},{status:400});
 const b=Buffer.from(await file.arrayBuffer());
 const mime=b[0]===255&&b[1]===216&&b[2]===255?"image/jpeg":b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?"image/png":b.toString("ascii",0,4)==="RIFF"&&b.toString("ascii",8,12)==="WEBP"?"image/webp":"";
 if(!mime)return NextResponse.json({error:"Invalid image format."},{status:400});
 const id=randomUUID();
 await query("INSERT INTO portfolio_media(id,mime,bytes) VALUES($1::uuid,$2,decode($3,'base64'))",[id,mime,b.toString("base64")]);
 return NextResponse.json({src:"/api/media/"+id},{status:201});
 }catch{return NextResponse.json({error:"Upload failed"},{status:503});}
}
