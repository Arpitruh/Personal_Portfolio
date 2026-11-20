"use client";
import Link from "next/link";
import {useState} from "react";
import {answerPortfolioQuestion,assistantSuggestions,type PortfolioAnswer} from "@/data/portfolio-assistant";
type ChatEntry={id:number;question:string;answer:PortfolioAnswer};
export function PortfolioAssistant(){
 const [value,setValue]=useState("");
 const [entries,setEntries]=useState<ChatEntry[]>([]);
 function ask(text:string){const query=text.trim().slice(0,220);if(!query)return;setEntries(current=>[...current,{id:current.length?current[current.length-1].id+1:1,question:query,answer:answerPortfolioQuestion(query)}].slice(-12));setValue("");}
 return <section className="assistant-shell" aria-label="Portfolio question explorer">
  <div className="assistant-head"><div><span className="eyebrow">DOCUMENTED ANSWERS · LOCAL MODE</span><h2>Ask about the work.</h2><p>Not generative AI: this searchable assistant answers from the published project data in your browser. No API key, no subscription, and no conversation upload.</p></div><span className="assistant-offline">● NO EXTERNAL API</span></div>
  <div className="assistant-messages" role="log" aria-live="polite" aria-label="Question and answer history">
   {entries.length===0?<div className="assistant-welcome"><strong>Hey! Ask me about projects, tools or experience.</strong><p>Try one of the prompts below or write your own.</p></div>:entries.map(e=><article className="assistant-exchange" key={e.id}><div className="assistant-question"><strong>You</strong><p>{e.question}</p></div><div className="assistant-answer"><strong>Portfolio Guide</strong>{e.answer.text.split("\n").map((p,i)=><p key={i}>{p}</p>)}<div>{e.answer.links.map(l=><Link key={l.href} href={l.href}>{l.label} ↗</Link>)}</div></div></article>)}
  </div>
  <div className="assistant-suggestions">{assistantSuggestions.map(q=><button type="button" onClick={()=>ask(q)} key={q}>{q}</button>)}</div>
  <form className="assistant-form" onSubmit={e=>{e.preventDefault();ask(value);}}><label htmlFor="assistant-query" className="sr-only">Question about the portfolio</label><input id="assistant-query" value={value} onChange={e=>setValue(e.target.value)} maxLength={220} placeholder="e.g. What did Arpit build with Next.js?" required/><button className="btn btn-primary" type="submit">Ask ↗</button></form>
 </section>;
}
