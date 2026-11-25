import {createHmac, timingSafeEqual, randomBytes} from "node:crypto";
import {cookies} from "next/headers";

export const SESSION_COOKIE="portfolio_admin";
export const SESSION_SECONDS=60*60*24*30;
export function configured(){
 return Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length??0)>=32);
}
function equal(a:string,b:string){
 const x=Buffer.from(a),y=Buffer.from(b);
 return x.length===y.length&&timingSafeEqual(x,y);
}
function sign(value:string){
 return createHmac("sha256",process.env.ADMIN_SESSION_SECRET??"").update(value).digest("hex");
}
export function verifyPassword(value:string){
 return configured()&&equal(sign(value),sign(process.env.ADMIN_PASSWORD!));
}
export function createSession(){
 if(!configured())throw new Error("Admin is not configured");
 const payload=String(Date.now()+SESSION_SECONDS*1000)+"."+randomBytes(24).toString("hex");
 return payload+"."+sign(payload+"."+sign(process.env.ADMIN_PASSWORD!));
}
export function validSession(token:string|undefined){
 if(!configured()||!token)return false;
 const parts=token.split(".");
 if(parts.length!==3||!/^\d{13}$/.test(parts[0])||!/^\w{48}$/.test(parts[1]))return false;
 const expiry=Number(parts[0]);
 return expiry>Date.now()&&expiry<=Date.now()+SESSION_SECONDS*1000&&equal(parts[2],sign(parts[0]+"."+parts[1]+"."+sign(process.env.ADMIN_PASSWORD!)));
}
export async function isAdmin(){
 return validSession((await cookies()).get(SESSION_COOKIE)?.value);
}
export const sessionOptions={httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict" as const,path:"/",maxAge:SESSION_SECONDS};
