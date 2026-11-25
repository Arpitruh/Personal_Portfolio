"use server";
import {query,databaseConfigured} from "@/lib/portfolio-db";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {configured,verifyPassword,createSession,SESSION_COOKIE,sessionOptions} from "@/lib/admin-session";
export type LoginState={error:string};
export async function login(_previous:LoginState,form:FormData):Promise<LoginState>{
 if(!configured())return {error:"Management access has not been configured."};
 if(databaseConfigured()){try{const rows=await query<{attempts:string}>("INSERT INTO portfolio_login_limits(bucket,attempts,expires_at) VALUES (\x27admin\x27,1,now()+interval \x2715 minutes\x27) ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN portfolio_login_limits.expires_at<=now() THEN 1 ELSE portfolio_login_limits.attempts+1 END,expires_at=CASE WHEN portfolio_login_limits.expires_at<=now() THEN now()+interval \x2715 minutes\x27 ELSE portfolio_login_limits.expires_at END RETURNING attempts::text");if(Number(rows[0]?.attempts)>10)return {error:"Too many attempts. Try again in 15 minutes."};}catch{return {error:"Login temporarily unavailable."};}}else if(process.env.NODE_ENV==="production")return {error:"Login storage unavailable."};
 const password=form.get("password");
 if(typeof password!=="string"||password.length>1024||!verifyPassword(password)){
  await new Promise(resolve=>setTimeout(resolve,700));
  return {error:"Invalid password."};
 }
 (await cookies()).set(SESSION_COOKIE,createSession(),sessionOptions);
 redirect("/manage");
}
export async function logout(){
 (await cookies()).set(SESSION_COOKIE,"",{...sessionOptions,maxAge:0});
 redirect("/manage");
}
