import type { Metadata } from "next";
import Link from "next/link";
import { life, socialProfiles, visualIdentity } from "@/data/personal";
import { PersonalPortrait } from "@/components/personal-portrait";
import { PersonalGallery } from "@/components/personal-gallery";
import { CharacterPose } from "@/components/character-pose";
import { characterPack } from "@/data/personal";

export const metadata: Metadata = {
  title:"Beyond the Code",
  description:"A little about the person behind Arpit Yadav's projects, interests and creative side.",
  alternates:{canonical:"/life"}
};
export default function LifePage(){
 return <main id="main" className="page life-page"><div className="container">
  <div className="page-heading"><span className="eyebrow">{life.eyebrow} / PLAYER 01</span><h1>More than <em>just code.</em></h1><p>A personal corner of this otherwise very technical world.</p></div>
  <div className="life-intro-grid">
    <PersonalPortrait variant="life"/>
    <div className="life-story"><span className="eyebrow">THE HUMAN SIDE</span><h2>{life.title}</h2><p>{life.introduction}</p><p>{life.note}</p><Link href="/about" className="btn btn-outline">My developer story ↗</Link></div>
  </div>
  {characterPack.casual && <section className="life-character-feature" aria-label="Illustrated personal-life character"><div><span className="eyebrow">PERSONAL MODE / UNLOCKED</span><h2>Off the <em>clock.</em></h2><p>Not every adventure has a keyboard in it. A little room for the everyday moments between builds.</p></div><CharacterPose pose="casual"/></section>}
  <section className="inner-section" aria-labelledby="life-hobbies-title">
   <div className="section-intro"><div><span className="eyebrow">A PERSONAL INVENTORY</span><h2 id="life-hobbies-title">Things I <em>enjoy.</em></h2><p>Interests and hobbies, added when I have a story worth sharing.</p></div></div>
   {life.hobbies.length ? <div className="life-hobby-grid">{life.hobbies.map((hobby,index)=><article className="life-hobby" key={hobby.title}><div className="life-hobby-number">{String(index+1).padStart(2,"0")}</div><span aria-hidden="true">{hobby.emoji || "✦"}</span><h3>{hobby.title}</h3><p>{hobby.description}</p></article>)}</div> :
    <div className="life-empty"><span aria-hidden="true">✳</span><h3>Stories are still being collected.</h3><p>Personal interests will appear here once they’re ready to share. No filler hobbies or placeholder photographs.</p></div>}
  </section>
  <PersonalGallery moments={visualIdentity.moments}/>
  <section className="inner-section" aria-labelledby="life-links-title"><div className="section-intro"><div><span className="eyebrow">ELSEWHERE ON THE INTERNET</span><h2 id="life-links-title">Find me <em>elsewhere.</em></h2><p>Only profiles I’ve chosen to make public.</p></div></div>
   <div className="life-social-grid">{socialProfiles.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"><small>{link.kind}</small><strong>{link.name}</strong><span aria-hidden="true">↗</span></a>)}</div>
  </section>
 </div></main>;
}
