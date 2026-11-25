import {query} from "@/lib/portfolio-db";
import {isAdmin} from "@/lib/admin-session";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id))return new Response(null,{status:404});
 try{
 const admin=await isAdmin();
 const rows=await query<{mime:string;data:string}>("SELECT mime,encode(bytes,'base64') AS data FROM portfolio_media WHERE id=$1::uuid AND ($2::boolean OR EXISTS(SELECT 1 FROM portfolio_content c CROSS JOIN LATERAL jsonb_array_elements(COALESCE(c.published,'[]'::jsonb)) item WHERE c.section='library' AND item->>'id'=$1 AND item->>'visible'='true'))",[id,String(admin)]);
 if(!rows[0])return new Response(null,{status:404});
 return new Response(new Uint8Array(Buffer.from(rows[0].data,"base64")),{headers:{"Content-Type":rows[0].mime,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return new Response(null,{status:503});}
}
