"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { profile, projects, skills } from "@/data/portfolio";

type TerminalLine = { id: number; command?: string; text: string; href?: string; linkText?: string; error?: boolean };
const welcome: TerminalLine[] = [
  { id: 0, text: "ARPIT.DEV / INTERACTIVE CONSOLE v1.0" },
  { id: 1, text: "A tiny command explorer. Type 'help' to see what's available." }
];
const presets = ["help", "about", "projects", "skills"];

function execute(raw: string, id: number): TerminalLine[] {
  const command = raw.trim().toLowerCase();
  if (!command) return [];
  const base: TerminalLine = { id, command: raw.trim(), text: "" };
  if (command === "help") return [
    base,
    { id: id + 1, text: "COMMANDS  help · about · skills · projects · contact · open <slug> · clear" },
    { id: id + 2, text: "Tip: use ↑ to recall a previous command." }
  ];
  if (command === "about") return [base, { id: id + 1, text: profile.summary, href: "/about", linkText: "Read my story ↗" }];
  if (command === "skills") return [base, { id: id + 1, text: skills.map(group => group.group + ": " + group.items.slice(0, 4).join(", ")).join("  |  "), href: "/about#skills", linkText: "Full inventory ↗" }];
  if (command === "projects") return [base,
    { id: id + 1, text: "Quests discovered: " + projects.length + ". Try 'open cacheloom' or 'open leadloop-crm'." },
    { id: id + 2, text: "Browse all projects", href: "/projects", linkText: "Open quest log ↗" }];
  if (command === "contact") return [base, { id: id + 1, text: "I'm one click away.", href: "/contact", linkText: "Contact page ↗" }];
  if (command.startsWith("open ")) {
    const slug = command.slice(5).trim();
    const project = projects.find(item => item.slug === slug);
    return project
      ? [base, { id: id + 1, text: project.title + " — " + project.summary, href: "/projects/" + project.slug, linkText: "Enter case study ↗" }]
      : [base, { id: id + 1, text: "Quest not found. Type 'projects' to view the catalog.", error: true }];
  }
  return [base, { id: id + 1, text: "Unknown command. This is a portfolio explorer, not a real shell. Try 'help'.", error: true }];
}

export function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>(welcome);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const ref = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  const scrollRef = useRef<HTMLDivElement>(null);

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;
    if (text.toLowerCase() === "clear") {
      setLines([{ id: nextId.current++, command: "clear", text: "" }]);
    } else {
      const result = execute(text, nextId.current);
      nextId.current += result.length;
      setLines(current => [...current, ...result].slice(-24));
    }
    setHistory(current => [...current, text].slice(-25));
    setHistoryIndex(-1);
    setValue("");
    ref.current?.focus();
    requestAnimationFrame(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const next = event.key === "ArrowUp"
      ? Math.min(historyIndex + 1, history.length - 1)
      : Math.max(-1, historyIndex - 1);
    setHistoryIndex(next);
    setValue(next === -1 ? "" : history[history.length - 1 - next]);
  }

  return <div className="interactive-terminal" aria-label="Portfolio command explorer">
    <div className="terminal-titlebar">
      <span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span>
      <span>arpit@portfolio ~ / explorer</span>
      <span className="terminal-status"><span className="status-dot" /> LOCAL ONLY</span>
    </div>
    <div className="terminal-body" ref={scrollRef} aria-live="polite" aria-relevant="additions text">
      {lines.map(line => <div key={line.id} className={"terminal-line" + (line.error ? " terminal-error" : "")}>
        {line.command && <div className="terminal-command"><span>➜ ~</span> {line.command}</div>}
        {line.text && <p>{line.text}</p>}
        {line.href && <Link href={line.href} className="terminal-link">{line.linkText}</Link>}
      </div>)}
    </div>
    <form className="terminal-prompt" onSubmit={event => { event.preventDefault(); run(value); }}>
      <label htmlFor="terminal-command"><span>➜ ~</span><span className="sr-only">Enter a portfolio command</span></label>
      <input id="terminal-command" ref={ref} value={value} onChange={e => setValue(e.target.value)} onKeyDown={onKeyDown} placeholder="try: open cacheloom" maxLength={100} autoComplete="off" spellCheck={false} />
      <button type="submit" aria-label="Run portfolio command">ENTER ↵</button>
    </form>
    <div className="terminal-presets"><span>TRY IT:</span>{presets.map(command => <button type="button" key={command} onClick={() => run(command)}>{command}</button>)}</div>
  </div>;
}
