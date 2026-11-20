import type { Metadata } from "next";
import Link from "next/link";
import { profile, experience, skills, featuredProjects, milestones } from "@/data/portfolio";
import { PrintResume } from "@/components/print-resume";
import { resume } from "@/data/personal";
export const metadata:Metadata={title:"Recruiter Profile",description:"Concise, print-ready frontend engineering experience, education and projects for Arpit Yadav.",alternates:{canonical:"/recruiter"}};
export default function RecruiterPage(){
 return <main className="page recruiter-page" id="main"><div className="container recruiter-container">
  <div className="recruiter-toolbar no-print"><div><span className="eyebrow">CAREER MODE · A DISTRACTION-FREE VIEW</span><h1>Recruiter <em>profile.</em></h1><p>{resume.file?"Your latest uploaded PDF is the primary resume shown below.":"A concise portfolio summary, ready to print."}</p></div><div className="button-group">{resume.file && <a className="btn btn-primary" href={resume.file} download>Download {resume.label} ↓</a>}<PrintResume/><Link className="btn btn-outline" href="/projects">Explore projects ↗</Link></div></div>
  {resume.file && <section className="recruiter-pdf-section no-print" aria-labelledby="resume-pdf-title"><div className="recruiter-pdf-header"><div><span className="eyebrow">CURRENT APPROVED PDF</span><h2 id="resume-pdf-title">{resume.label}</h2>{resume.updated && <p>Updated {resume.updated}</p>}</div><a href={resume.file} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Open PDF in new tab ↗</a></div><object className="recruiter-pdf-frame" aria-label={resume.label+" PDF preview"} data={resume.file+"#view=FitH"} type="application/pdf"><p className="recruiter-pdf-fallback">PDF previews are unavailable in this browser. <a href={resume.file} target="_blank" rel="noopener noreferrer">Open the current resume in a new tab</a> instead.</p></object><p className="recruiter-pdf-fallback">If your browser cannot display the preview, <a href={resume.file} target="_blank" rel="noopener noreferrer">open the resume PDF directly</a>.</p></section>}
  <div className="recruiter-summary-label no-print"><span className="eyebrow">PORTFOLIO-GENERATED SUMMARY</span><h2>Additional profile overview</h2><p>This section is generated from portfolio content and may differ from the uploaded PDF above.</p></div>
  <article className="resume-sheet">
   <header className="resume-head"><div><p className="eyebrow">FRONTEND / SOFTWARE ENGINEERING</p><h2>{profile.name}</h2><p>{profile.role} · {profile.location}</p></div><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/Arpitruh ↗</a></header>
   <section className="resume-section"><h3>Professional summary</h3><p>{profile.summary} Professional experience includes production-facing dashboards, reporting tools, configuration experiences and user management.</p></section>
   <section className="resume-section"><h3>Experience</h3>{experience.map(job=><article key={job.company} className="resume-experience"><div><strong>{job.role} · {job.company}</strong><span>{job.period}</span></div><p>{job.description}</p></article>)}</section>
   <section className="resume-section"><h3>Skills</h3>{skills.map(g=><p key={g.group}><strong>{g.group}:</strong> {g.items.join(" · ")}</p>)}</section>
   <section className="resume-section"><h3>Selected independent projects</h3>{featuredProjects.map(p=><article key={p.slug} className="resume-project"><div><strong>{p.title}</strong><span>{p.status}</span></div><p>{p.summary}</p><Link href={"/projects/"+p.slug}>Full case study</Link></article>)}</section>
   <section className="resume-section"><h3>Education</h3><p><strong>{milestones[0].title} · {milestones[0].label}</strong> — {milestones[0].description}</p></section>
   <footer className="resume-disclaimer">This printable summary is generated separately from published portfolio content. Refer to the uploaded PDF above for the current approved resume.</footer>
  </article>
  <div className="resume-help no-print"><strong>{resume.file?"Download the approved resume above.":"Need a PDF?"}</strong> {resume.file?"The separate Print / Save as PDF control prints this generated portfolio summary, not your uploaded PDF.":"Select Print / Save as PDF to save the generated summary; an approved resume upload can be added through Pages CMS."}</div>
 </div></main>;
}
