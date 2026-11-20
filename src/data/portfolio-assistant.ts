import { projects, skills, experience, profile } from "./portfolio.ts";

export type PortfolioAnswer = { text: string; links: { label: string; href: string }[] };
const common = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#. ]/g, " ").split(/\s+/).filter(w=>w.length>=3);
const ignore = new Set(["what","which","about","with","your","this","that","have","does","show","tell","more","some","please","could","would","there","their","from","into","work","works","give","does"]);
export function answerPortfolioQuestion(value: string): PortfolioAnswer {
  const question = value.trim().slice(0, 220);
  if (!question) return { text: "Ask about Arpit's projects, skills, experience or how to get in touch.", links: [] };
  const lower=question.toLowerCase();
  const tokens=common(question).filter(w=>!ignore.has(w));
  const link=(label:string,href:string)=>[{label,href}];
  if (/contact|email|hire|reach|collaborat|connect/.test(lower)) return {
    text: "Arpit is based in Noida and builds frontend experiences with React, Next.js and TypeScript. Use the Contact page to reach him; an email address is only shown if he has chosen to publish one.",
    links: link("Contact Arpit","/contact")
  };
  if (/resume|cv|recruit|job|qualification|education|degree/.test(lower)) return {
    text: "Arpit earned a B.Tech in Computer Science in 2024. His recruiter summary lists his documented experience, selected projects and technical stack. It can be printed or saved as a PDF from your browser.",
    links: link("View recruiter summary","/recruiter")
  };
  if (/experience|career|mfilter|fortum|glida|company|employment/.test(lower)) return {
    text: experience.map(item=>item.role+" at "+item.company+" ("+item.period+"): "+item.description).join("\n\n"),
    links:link("Experience timeline","/about#experience")
  };
  if (/skill|stack|technolog|react|typescript|next.js|frontend|backend|node|postgres|prisma|framework|javascript/.test(lower)) {
    const relevant=skills.flatMap(g=>g.items).filter(s=>tokens.some(t=>s.toLowerCase().includes(t)||t.includes(s.toLowerCase())));
    return {text: relevant.length?"Relevant tools in the portfolio: "+relevant.join(", ")+".":"Current areas: "+skills.map(g=>g.group+": "+g.items.join(", ")).join("\n"),links:link("Explore skill connections","/skills")};
  }
  const ranked=projects.map(p=>{
    const fields=[p.title,p.slug,p.kicker,p.summary,p.category,p.challenge,p.approach,...p.stack,...p.highlights].join(" ").toLowerCase();
    let score=0;
    for(const token of tokens){if(p.title.toLowerCase().includes(token)||p.slug.includes(token))score+=5;else if(fields.includes(token))score+=1;}
    return {p,score};
  }).sort((a,b)=>b.score-a.score);
  const strong=ranked.filter(x=>x.score>0).slice(0,3);
  if(strong.length) return {text:strong.map(({p})=>p.title+" — "+p.summary+" Status: "+p.status+". Tech: "+p.stack.join(", ")+".").join("\n\n"),links:strong.map(({p})=>({label:"View "+p.title,href:"/projects/"+p.slug}))};
  if(/project|portfolio|build|product|demo/.test(lower)) return {text:"The portfolio covers "+projects.length+" repository-backed projects, including "+projects.slice(0,4).map(p=>p.title).join(", ")+". Open any case study to read its current challenges, approaches and known limitations.",links:link("Explore all projects","/projects")};
  return {text:"I can answer questions from this published portfolio, but I cannot verify anything beyond it. Try asking about a specific project, the tech stack, experience, or how to contact Arpit.",links:[{label:"Browse projects",href:"/projects"},{label:"View recruiter summary",href:"/recruiter"}]};
}
export const assistantSuggestions=["What has Arpit built?","Tell me about CacheLoom","Which frontend skills?","What's his experience?","How can I contact him?"];
