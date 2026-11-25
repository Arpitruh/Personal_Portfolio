import Link from "next/link";
import { PixelAvatar, PixelLandscape } from "@/components/pixel-landscape";
import { ProjectShowcase } from "@/components/project-showcase";
import { InteractiveTerminal } from "@/components/interactive-terminal";
import { ScrollMotion } from "@/components/scroll-motion";
import {publicProfile} from "@/lib/profile-content";
import { experience, featuredProjects, skills } from "@/data/portfolio";
import { life, visualIdentity, characterPack, socialProfiles } from "@/data/personal";
import { CharacterPose } from "@/components/character-pose";
import { PersonalPortrait } from "@/components/personal-portrait";

const playground = [
  { href: "/world", icon: "◇", title: "World map", detail: "Explore every corner." },
  { href: "/room", icon: "⌘", title: "Developer room", detail: "Visit the interactive workstation." },
  { href: "/play", icon: "▶", title: "Arcade", detail: "Play the pixel adventures." },
  { href: "/assistant", icon: "?", title: "Portfolio guide", detail: "Find answers about my work." },
  { href: "/achievements", icon: "★", title: "Achievements", detail: "Discover the visitor badges." },
  { href: "/now", icon: "◷", title: "Now", detail: "See what I am building." },
];

export default async function HomePage() {
  const profile=await publicProfile();
  return <main id="main" className="scroll-portfolio">
    <ScrollMotion />
    <section className="hero" id="top">
      <div className="journey-ambient" aria-hidden="true"><i/><i/><i/><i/><i/></div>
      <div className="hero-inner container">
        <div className="hero-copy">
          {profile.availability && <div className="hero-available"><span className="status-dot" /> {profile.availability} <span>✦</span></div>}
          <p className="eyebrow hero-level">{profile.eyebrow}</p>
          <h1>Hi, I&apos;m <span>{profile.name.split(" ")[0]}.</span><br />{profile.headlineStart} <em>{profile.headlineEnd}</em></h1>
          <p className="hero-description">{profile.heroDescription}</p>
          <div className="button-group hero-buttons"><Link className="btn btn-primary" href="#projects">Explore my work <span aria-hidden="true">↗</span></Link><Link className="btn btn-outline" href="/recruiter">View resume ↗</Link></div>
          <div className="hero-social"><span>BASED IN {profile.location.toUpperCase()}</span><span className="hero-social-line" /><a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a></div>
        </div>
        <div className="hero-scene"><div className="hero-scene-card"><span className="scene-corner scene-corner-left">LEVEL 01</span><span className="scene-corner scene-corner-right">1 PLAYER</span><PixelLandscape /><div className="hero-avatar">{characterPack.standing ? <CharacterPose pose="standing" priority/> : visualIdentity.illustration ? <PersonalPortrait variant="home"/> : <PixelAvatar large/>}</div><div className="speech-bubble">HELLO WORLD! <span>♥</span></div><div className="scene-caption">✦ SCROLL TO EXPLORE</div></div></div>
      </div>
      <a className="journey-scroll" href="#about">Scroll to explore <span aria-hidden="true">↓</span></a>
    </section>


    <section id="about" className="section journey-chapter journey-about">
      <div className="container journey-split">
        <div data-reveal><span className="eyebrow">01 / ABOUT ME</span><h2>Curious by nature.<br/><em>Engineer by choice.</em></h2><p>{profile.summary}</p><p>I enjoy making complex workflows feel simple, from thoughtful interfaces to reusable backend services.</p><Link href="/about" className="text-link">More about me ↗</Link></div>
        <div className="journey-portrait" data-reveal><PersonalPortrait variant="about"/></div>
      </div>
    </section>
    <section id="experience" className="section journey-chapter section-experience">
      <div className="container journey-split journey-timeline-layout">
        <div className="journey-sticky" data-reveal><span className="eyebrow">02 / EXPERIENCE</span><h2>The journey<br/><em>so far.</em></h2><p>Building products, learning from real-world problems and growing as an engineer.</p><Link href="/recruiter" className="btn btn-outline">View resume ↗</Link></div>
        <ol className="journey-timeline">{experience.map((item,index)=><li key={item.company} data-reveal><span className="journey-timeline-dot" aria-hidden="true">{index+1}</span><article className="experience-card"><div><span className="eyebrow">{item.period}</span><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.description}</p></div></article></li>)}</ol>
      </div>
    </section>
    <section id="projects" className="section journey-chapter section-projects">
      <div className="container"><div className="section-intro" data-reveal><div><span className="eyebrow">03 / SELECTED WORK</span><h2>Things I&apos;ve <em>built.</em></h2><p>Products, developer tools and experiments, with the details behind each build.</p></div><Link className="section-more" href="/projects">ALL PROJECTS ↗</Link></div>
      <ProjectShowcase projects={featuredProjects}/></div>
    </section>
    <section id="skills" className="section journey-chapter section-about"><div className="container journey-split"><div data-reveal><span className="eyebrow">04 / TOOLKIT</span><h2>Tools I <em>work with.</em></h2><p>From interfaces to APIs and infrastructure. See the connections between tools and real projects.</p><Link href="/skills" className="btn btn-dark">Explore skills ↗</Link></div><div className="about-stack" data-reveal><div className="inventory-header"><span>TOOLKIT</span><span>✦</span></div>{skills.map((group,index)=><div className="inventory-row" key={group.group}><span className="inventory-number">0{index+1}</span><div><strong>{group.group}</strong><p>{group.items.join(" · ")}</p></div></div>)}</div></div></section>
    <section id="life" className="section journey-chapter home-life-preview"><div className="container home-life-grid"><div data-reveal><span className="eyebrow">05 / BEYOND CODE</span><h2>Life outside <em>the editor.</em></h2><p>{life.introduction}</p><Link href="/life" className="btn btn-outline">Explore my life ↗</Link></div><div className="journey-portrait" data-reveal>{characterPack.casual ? <CharacterPose pose="casual"/> : <div className="home-life-decoration" aria-hidden="true"><span>✦</span><strong>ALT + LIFE</strong><small>PLAYER 01</small></div>}</div></div></section>
    <section id="explore" className="section journey-chapter new-experiences"><div className="container"><div className="section-intro" data-reveal><div><span className="eyebrow">06 / PLAYGROUND</span><h2>A little room <em>for play.</em></h2><p>Optional side quests for the curious. No game required to explore my work.</p></div></div><div className="experience-shortcuts">{playground.map(item=><Link href={item.href} key={item.href} data-reveal><span aria-hidden="true">{item.icon}</span><strong>{item.title}</strong><small>{item.detail}</small></Link>)}</div><details className="journey-terminal"><summary>Open interactive developer terminal</summary><InteractiveTerminal/></details></div></section>
    <section id="contact" className="section journey-chapter"><div className="container"><div className="cta-banner" data-reveal><div><span className="eyebrow">07 / CONTACT</span><h2>Got an idea?<br/><em>Let&apos;s build it.</em></h2><p>Available for interesting engineering conversations and collaborations.</p><div className="button-group"><Link className="btn btn-primary" href="/contact">Get in touch ↗</Link><Link className="btn btn-outline" href="/recruiter">Resume ↗</Link></div><div className="journey-socials">{socialProfiles.map(link=><a href={link.url} key={link.url} target="_blank" rel="noopener noreferrer">{link.name} ↗</a>)}{profile.email && <a href={"mailto:"+profile.email}>Email ↗</a>}</div></div><div className="cta-decoration" aria-hidden="true"><span>★</span><span>?</span><span>✦</span></div></div></div></section>
  </main>;
}
