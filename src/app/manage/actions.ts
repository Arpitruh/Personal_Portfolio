"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {configured,verifyPassword,createSession,SESSION_COOKIE,sessionOptions} from "@/lib/admin-session";
export type LoginState={error:string};
export async function login(_previous:LoginState,form:FormData):Promise<LoginState>{
 if(!configured())return {error:"Management access has not been configured."};
 // A durable distributed attempt limiter is required before public rollout.
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
