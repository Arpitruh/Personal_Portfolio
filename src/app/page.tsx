import Link from "next/link";
import { PixelAvatar, PixelLandscape } from "@/components/pixel-landscape";
import { WorldMap } from "@/components/world-map";
import { ProjectCard } from "@/components/project-card";
import { InteractiveTerminal } from "@/components/interactive-terminal";
import { experience, featuredProjects, profile, skills } from "@/data/portfolio";

export default function HomePage() {
  return <main id="main">
    <section className="hero" id="top">
      <div className="hero-inner container">
        <div className="hero-copy">
          <div className="hero-available"><span className="status-dot" /> OPEN TO INTERESTING CONVERSATIONS <span>✦</span></div>
          <p className="eyebrow hero-level">WELCOME TO MY LITTLE CORNER OF THE INTERNET / WORLD 1-1</p>
          <h1>Hi, I&apos;m <span>Arpit.</span><br />I make the web <em>feel alive.</em></h1>
          <p className="hero-description">Software engineer by day. Builder by habit. I turn complex ideas into clean, playful digital experiences that people actually enjoy using.</p>
          <div className="button-group hero-buttons"><Link className="btn btn-primary" href="/projects">Explore my work <span aria-hidden="true">↗</span></Link><Link className="btn btn-outline" href="/room">⌘ Explore my room</Link><Link className="btn btn-outline" href="/recruiter">Recruiter mode ↗</Link></div>
          <div className="hero-social"><span>BASED IN {profile.location.toUpperCase()}</span><span className="hero-social-line" /><a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a></div>
        </div>
        <div className="hero-scene"><div className="hero-scene-card"><span className="scene-corner scene-corner-left">LEVEL 01</span><span className="scene-corner scene-corner-right">1 PLAYER</span><PixelLandscape /><div className="hero-avatar"><PixelAvatar large /></div><div className="speech-bubble">HELLO WORLD! <span>♥</span></div><div className="scene-caption">✦ PRESS START TO EXPLORE MY WORLD</div></div><div className="scene-stamp">100% HUMAN<br />MADE IDEAS</div></div>
      </div>
      <div className="ticker" aria-hidden="true"><div>DESIGN • DEVELOP • DEBUG • REPEAT ✦ REACT • NEXT.JS • TYPESCRIPT ✦ BUILDING THINGS THAT MATTER ✦ DESIGN • DEVELOP • DEBUG • REPEAT ✦</div></div>
    </section>

    <section className="section new-experiences" id="explore-more"><div className="container">
      <div className="section-intro"><div><span className="eyebrow">NEW PATHS / BEYOND THE PIXELS</span><h2>Find your <em>own way in.</em></h2><p>Prefer a recruiter-friendly profile, an interactive room, connected skills, or questions and answers? Pick your path.</p></div></div>
      <div className="experience-shortcuts">
        <Link href="/room"><span aria-hidden="true">⌘</span><strong>Developer Room</strong><small>Explore the workstation</small></Link>
        <Link href="/recruiter"><span aria-hidden="true">▤</span><strong>Recruiter Mode</strong><small>Focused career profile + print-to-PDF</small></Link>
        <Link href="/skills"><span aria-hidden="true">✳</span><strong>Skills Universe</strong><small>See which projects use each tool</small></Link>
        <Link href="/assistant"><span aria-hidden="true">?</span><strong>Portfolio Guide</strong><small>Ask about the published work</small></Link>
        <Link href="/achievements"><span aria-hidden="true">★</span><strong>Achievement Board</strong><small>Discover local visitor badges</small></Link>
        <Link href="/play"><span aria-hidden="true">▶</span><strong>Playable Worlds</strong><small>Three optional pixel adventures</small></Link>
      </div>
    </div></section>
    <section className="section section-world" id="world"><div className="container">
      <div className="section-intro"><div><span className="eyebrow">01 / INTERACTIVE ADVENTURE</span><h2>Pick a path.<br /><em>Explore my world.</em></h2><p>Not your usual portfolio navigation. Every stop tells a different part of the story.</p></div><Link className="section-more" href="/world">OPEN FULL MAP ↗</Link></div>
      <WorldMap />
    </div></section>

    <section className="section section-projects" id="projects"><div className="container">
      <div className="section-intro"><div><span className="eyebrow">02 / SELECTED QUESTS</span><h2>Things I&apos;ve <em>built.</em></h2><p>From real-world frontend products to experiments in developer infrastructure.</p></div><Link className="section-more" href="/projects">VIEW ALL PROJECTS ↗</Link></div>
      <div className="project-grid">{featuredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
    </div></section>

    <section className="section section-terminal" id="developer-console"><div className="container terminal-section-grid">
      <div className="terminal-intro"><span className="eyebrow">03 / SECRET DEVELOPER MODE</span><h2>Feel more at home<br /><em>in a terminal?</em></h2><p>Try a tiny command explorer made just for this portfolio. No account, no external service and definitely no shell access.</p><div className="terminal-command-chips"><span><b>$</b> help</span><span><b>$</b> projects</span><span><b>$</b> open cacheloom</span></div></div>
      <InteractiveTerminal />
    </div></section>

    <section className="section section-about"><div className="container about-split">
      <div className="about-intro"><span className="eyebrow">04 / THE HUMAN BEHIND THE PIXELS</span><h2>More than<br /><em>just code.</em></h2><p>I&apos;m a frontend-focused engineer who cares about the small details: how a layout responds, how a state changes, and whether a product feels intuitive from the first click.</p><Link href="/about" className="btn btn-dark">More about me ↗</Link></div>
      <div className="about-stack"><div className="inventory-header"><span>PLAYER INVENTORY</span><span>✦ EQUIPPED</span></div>{skills.map((group, index) => <div className="inventory-row" key={group.group}><span className="inventory-number">0{index + 1}</span><div><strong>{group.group}</strong><p>{group.items.join(" · ")}</p></div><span className="inventory-star">✳</span></div>)}</div>
    </div></section>

    <section className="section section-experience"><div className="container"><div className="section-intro"><div><span className="eyebrow">05 / EXPERIENCE POINTS</span><h2>The journey <em>so far.</em></h2></div><Link className="section-more" href="/about#experience">VIEW JOURNEY ↗</Link></div><div className="experience-grid">{experience.map((item, index) => <article className="experience-card" key={item.company}><span className="experience-number">0{index + 1}</span><div><span className="eyebrow">{item.period}</span><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.description}</p></div></article>)}</div></div></section>

    <section className="section"><div className="container"><div className="cta-banner"><div><span className="eyebrow">FINAL LEVEL? NOT EVEN CLOSE.</span><h2>Got an idea?<br /><em>Let&apos;s build it.</em></h2><p>Whether it&apos;s a product, a tricky frontend problem or a good conversation, my inbox is a great place to start.</p><Link className="btn btn-primary" href="/contact">Get in touch ↗</Link></div><div className="cta-decoration" aria-hidden="true"><span>★</span><span>?</span><span>✦</span></div></div></div></section>
  </main>;
}
