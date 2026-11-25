"use client";
import {useActionState,useState} from "react";
import {login} from "./actions";
export function LoginForm({enabled}:{enabled:boolean}){
 const [state,action,pending]=useActionState(login,{error:""});
 const [show,setShow]=useState(false);
 return <form action={action} className="manage-login-form">
 <label htmlFor="admin-password">Access password</label>
 <div className="manage-password"><input id="admin-password" name="password" type={show?"text":"password"} autoComplete="current-password" maxLength={1024} required disabled={!enabled||pending}/><button type="button" onClick={()=>setShow(v=>!v)} aria-pressed={show}>{show?"Hide":"Show"}</button></div>
 {state.error&&<p role="alert" className="manage-error">{state.error}</p>}
 {!enabled&&<p role="status">Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET on the server to enable login.</p>}
 <button className="btn btn-primary" disabled={!enabled||pending} type="submit">{pending?"Unlocking…":"Unlock dashboard"}</button>
 </form>;
}
