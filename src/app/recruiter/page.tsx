import type { Metadata } from "next";
import Link from "next/link";
import { profile, experience, skills, featuredProjects, milestones } from "@/data/portfolio";
import { PrintResume } from "@/components/print-resume";
export const metadata:Metadata={title:"Recruiter Profile",description:"Concise, print-ready frontend engineering experience, education and projects for Arpit Yadav.",alternates:{canonical:"/recruiter"}};
export default function RecruiterPage(){
 return <main className="page recruiter-page" id="main"><div className="container recruiter-container">
  <div className="recruiter-toolbar no-print"><div><span className="eyebrow">CAREER MODE · A DISTRACTION-FREE VIEW</span><h1>Recruiter <em>profile.</em></h1><p>Focused on verified work rather than animations or game scores.</p></div><div className="button-group"><PrintResume/><Link className="btn btn-outline" href="/projects">Explore projects ↗</Link></div></div>
  <article className="resume-sheet">
   <header className="resume-head"><div><p className="eyebrow">FRONTEND / SOFTWARE ENGINEERING</p><h2>{profile.name}</h2><p>{profile.role} · {profile.location}</p></div><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/Arpitruh ↗</a></header>
   <section className="resume-section"><h3>Professional summary</h3><p>{profile.summary} Professional experience includes production-facing dashboards, reporting tools, configuration experiences and user management.</p></section>
   <section className="resume-section"><h3>Experience</h3>{experience.map(job=><article key={job.company} className="resume-experience"><div><strong>{job.role} · {job.company}</strong><span>{job.period}</span></div><p>{job.description}</p></article>)}</section>
   <section className="resume-section"><h3>Skills</h3>{skills.map(g=><p key={g.group}><strong>{g.group}:</strong> {g.items.join(" · ")}</p>)}</section>
   <section className="resume-section"><h3>Selected independent projects</h3>{featuredProjects.map(p=><article key={p.slug} className="resume-project"><div><strong>{p.title}</strong><span>{p.status}</span></div><p>{p.summary}</p><Link href={"/projects/"+p.slug}>Full case study</Link></article>)}</section>
   <section className="resume-section"><h3>Education</h3><p><strong>{milestones[0].title} · {milestones[0].label}</strong> — {milestones[0].description}</p></section>
   <footer className="resume-disclaimer">This summary is generated from published portfolio content, not an independently verified employment record. No personal email or downloadable third-party resume file is fabricated.</footer>
  </article>
  <div className="resume-help no-print"><strong>Need a PDF?</strong> Select “Print / Save as PDF” and choose your browser’s PDF printer. A separately verified resume upload can replace this printable summary later.</div>
 </div></main>;
}
