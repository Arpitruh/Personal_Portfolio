import Link from "next/link";
import {isAdmin,configured} from "@/lib/admin-session";
import {LoginForm} from "./login-form";
import {LifeEditor,SocialEditor} from "./personal-editor";
import {AssetEditor} from "./asset-editor";
import {CareerEditor} from "./career-editor";
import {ProjectEditor} from "./project-editor";
import {ProfileEditor} from "./profile-editor";
import {LibraryEditor} from "./library-editor";
import {logout} from "./actions";
const modules=[
 ["Personal library","Photos, collections and captions"],["Profile & homepage","Identity, biography and introduction"],["Projects","Case studies and screenshots"],["Experience & education","Work history and milestones"],["Skills","Technology groups"],["Personal life","Interests and stories"],["Resume","Official PDF"],["Social links","Public profiles"],["Appearance","Illustrations and portraits"],["Achievements & now","Milestones and current activity"],["SEO & analytics","Discovery and visitor metrics"],["Settings","Publishing and security"]
];
export default async function ManagePage(){
 if(!await isAdmin())return <main id="main" className="manage-login"><section className="manage-login-card"><span className="eyebrow">PRIVATE WORKSPACE</span><h1>Portfolio admin.</h1><p>Authorized access only.</p><LoginForm enabled={configured()}/><Link href="/">← Return to portfolio</Link></section></main>;
 return <main id="main" className="manage-dashboard"><header className="manage-header"><div><span className="eyebrow">OWNER WORKSPACE</span><h1>Portfolio admin.</h1></div><form action={logout}><button className="btn btn-outline">Log out</button></form></header><p>Manage your portfolio from one place.</p><ProfileEditor/><ProjectEditor/><CareerEditor/><AssetEditor/><LibraryEditor/><LifeEditor/><SocialEditor/><div className="manage-grid">{modules.slice(2).filter(([title])=>title!=="Resume"&&title!=="Appearance"&&title!=="Experience & education"&&title!=="Skills"&&title!=="Projects"&&title!=="Personal life"&&title!=="Social links").map(([title,description])=><article className="manage-module" key={title}><h2>{title}</h2><p>{description}</p><span>Not connected yet</span></article>)}</div><Link className="btn btn-outline" href="/">View portfolio ↗</Link></main>;
}
