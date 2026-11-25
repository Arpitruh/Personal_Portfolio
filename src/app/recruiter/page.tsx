import type { Metadata } from "next";
import Link from "next/link";
import {publicProfile} from "@/lib/profile-content";
import {publicProjects} from "@/lib/project-content";
import { experience, skills, milestones } from "@/data/portfolio";
import { PrintResume } from "@/components/print-resume";
import { resume } from "@/data/personal";
export const metadata:Metadata={title:"Recruiter Profile",description:"Concise, print-ready frontend engineering experience, education and projects for Arpit Yadav.",alternates:{canonical:"/recruiter"}};
export default async function RecruiterPage(){
 const [profile,projects]=await Promise.all([publicProfile(),publicProjects()]);
 const featuredProjects=projects.filter(p=>p.featured);
 return <main className="page recruiter-page" id="main"><div className="container recruiter-container">
  <header className="recruiter-toolbar no-print"><div><span className="eyebrow">CAREER / RESUME</span><h1>My <em>resume.</em></h1><p>{profile.role} · {profile.location}</p></div><Link className="btn btn-outline" href="/#projects">Explore projects ↗</Link></header>
  {resume.file && <section className="recruiter-pdf-section no-print" aria-labelledby="resume-pdf-title">
    <div className="recruiter-pdf-header"><div><span className="eyebrow">CURRENT RESUME · PDF</span><h2 id="resume-pdf-title">{resume.label}</h2>{resume.updated && <p>Updated {resume.updated}</p>}</div>
    <div className="resume-actions"><a className="btn btn-primary" href={resume.file} download>Download {resume.label} ↓</a><a href={resume.file} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Open PDF ↗</a></div></div>
    <div className="resume-mobile-note"><p>Open the PDF directly for the best reading experience on your phone or tablet.</p><a href={resume.file} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View full resume ↗</a></div>
    <object className="recruiter-pdf-frame" aria-label={resume.label+" PDF preview"} data={resume.file+"#view=FitH"} type="application/pdf"><p className="recruiter-pdf-fallback">PDF previews are unavailable in this browser. <a href={resume.file} target="_blank" rel="noopener noreferrer">Open the current resume in a new tab</a> instead.</p></object>
    <p className="recruiter-pdf-fallback resume-desktop-note">Preview not displaying? <a href={resume.file} target="_blank" rel="noopener noreferrer">Open the resume PDF directly.</a></p>
  </section>}
  <div className="recruiter-summary-label no-print"><div><span className="eyebrow">PORTFOLIO SUMMARY</span><h2>Additional profile overview</h2><p>{resume.file?"An optional web-based summary, separate from the official resume above.":"A printable summary of my experience and projects."}</p></div><PrintResume/></div>
  <details className="resume-overview" open={!resume.file}><summary className="resume-overview-toggle no-print">View detailed portfolio summary <span aria-hidden="true">+</span></summary><article className="resume-sheet">
   <header className="resume-head"><div><p className="eyebrow">FRONTEND / SOFTWARE ENGINEERING</p><h2>{profile.name}</h2><p>{profile.role} · {profile.location}</p></div><a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github.replace("https://","")} ↗</a></header>
   <section className="resume-section"><h3>Professional summary</h3><p>{profile.summary} Professional experience includes production-facing dashboards, reporting tools, configuration experiences and user management.</p></section>
   <section className="resume-section"><h3>Experience</h3>{experience.map(job=><article key={job.company} className="resume-experience"><div><strong>{job.role} · {job.company}</strong><span>{job.period}</span></div><p>{job.description}</p></article>)}</section>
   <section className="resume-section"><h3>Skills</h3>{skills.map(g=><p key={g.group}><strong>{g.group}:</strong> {g.items.join(" · ")}</p>)}</section>
   <section className="resume-section"><h3>Selected independent projects</h3>{featuredProjects.map(p=><article key={p.slug} className="resume-project"><div><strong>{p.title}</strong><span>{p.status}</span></div><p>{p.summary}</p><Link href={"/projects/"+p.slug}>Full case study</Link></article>)}</section>
   <section className="resume-section"><h3>Education</h3><p><strong>{milestones[0].title} · {milestones[0].label}</strong> — {milestones[0].description}</p></section>
   <footer className="resume-disclaimer">This printable summary is generated separately from published portfolio content. Refer to the uploaded PDF above for the current approved resume.</footer>
  </article></details>
  <div className="resume-help no-print"><strong>{resume.file?"Download the approved resume above.":"Need a PDF?"}</strong> {resume.file?"The Print / Save as PDF control prints the optional portfolio summary, not the original resume.":"Select Print / Save as PDF to save the generated summary; an approved resume upload can be added through Pages CMS."}</div>
 </div></main>;
}
