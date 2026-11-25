import Link from "next/link";
import {isAdmin,configured} from "@/lib/admin-session";
import {LoginForm} from "./login-form";
import {ManageWorkspace} from "./workspace";
export default async function ManagePage(){
 if(!await isAdmin())return <main id="main" className="manage-login"><section className="manage-login-card"><span className="eyebrow">PRIVATE WORKSPACE</span><h1>Portfolio admin.</h1><p>Authorized access only.</p><LoginForm enabled={configured()}/><Link href="/">← Return to portfolio</Link></section></main>;
 return <ManageWorkspace/>;
}
