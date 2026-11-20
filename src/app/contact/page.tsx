import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/data/portfolio";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Arpit Yadav about engineering, projects and collaboration.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <main id="main" className="page"><div className="container">
    <div className="page-heading"><span className="eyebrow">FINAL FLAG / SAY HELLO</span><h1>Let's make something <em>great.</em></h1><p>Have a product idea, a challenging frontend problem or just want to talk shop? I'd love to hear from you.</p></div>
    <div className="contact-layout"><div className="contact-aside"><div className="contact-aside-art"><span>✉</span><div className="contact-flag">LET'S TALK!</div></div><div><span className="eyebrow">PLAYER ONE</span><h2>Arpit Yadav</h2><p>{profile.role}<br />{profile.location}</p></div><div className="contact-links"><a href={profile.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><span>↗</span></a>{profile.email && <a href={"mailto:" + profile.email}><span>Email</span><span>{profile.email} ↗</span></a>}{profile.phone && <a href={"tel:" + profile.phone.replace(/[^+\d]/g,"")}><span>Phone</span><span>{profile.phone} ↗</span></a>}</div></div><ContactForm /></div>
  </div></main>;
}
