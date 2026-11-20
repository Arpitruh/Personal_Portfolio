"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  if (!profile.email) {
    return <div className="contact-form contact-unconfigured"><div className="contact-icon">✉</div><h2>Let's connect.</h2><p>The email form will be available once a public contact address is configured. For now, GitHub is the best way to find me.</p><a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Find me on GitHub ↗</a><small>To enable the form, set NEXT_PUBLIC_CONTACT_EMAIL at deployment.</small></div>;
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Portfolio enquiry from " + name.trim());
    const body = encodeURIComponent("From: " + name.trim() + "\nReply to: " + email.trim() + "\n\n" + message.trim());
    window.location.href = "mailto:" + profile.email + "?subject=" + subject + "&body=" + body;
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setCopied(false); }
  }
  return <form className="contact-form" onSubmit={submit}>
    <span className="eyebrow">DROP A MESSAGE / NO BACKEND REQUIRED</span>
    <h2>What's on your mind?</h2>
    <div className="form-grid"><label>Your name<input required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></label><label>Your email<input required type="email" maxLength={200} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label></div>
    <label>Your message<textarea required minLength={10} maxLength={4000} rows={7} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell me about your project, idea, or favourite pixel game..." /></label>
    <div className="form-footer"><button type="submit" className="btn btn-primary">Open email draft ↗</button><button className="copy-email" type="button" onClick={copyEmail}>{copied ? "✓ Email copied" : "Copy email address"}</button></div>
    <p className="form-notice">This opens your email app with a prefilled draft. It does not submit or store your message on this website.</p>
  </form>;
}
