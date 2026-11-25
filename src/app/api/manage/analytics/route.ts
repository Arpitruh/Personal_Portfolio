import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-session";
import {query} from "@/lib/portfolio-db";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 const days=req.nextUrl.searchParams.get("days")??"30";if(!["7","30","90"].includes(days))return NextResponse.json({error:"Invalid period"},{status:400});
 try{const rows=await query<{day:string;path:string;event:string;total:string}>("SELECT day::text,path,event,total::text FROM portfolio_analytics_daily WHERE day>=((now() AT TIME ZONE 'UTC')::date-($1::int-1)) ORDER BY day DESC",[days]);return NextResponse.json(rows,{headers:{"Cache-Control":"private, no-store"}});}catch{return NextResponse.json({error:"Analytics unavailable"},{status:503});}
}
