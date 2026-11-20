"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PixelAvatar } from "@/components/pixel-landscape";

const stops = [
  { id: "about", label: "About me", number: "01", x: 12, y: 61, href: "/about", icon: "?", text: "The story behind the code." },
  { id: "skills", label: "Skill hills", number: "02", x: 27, y: 35, href: "/about#skills", icon: "✦", text: "The tools in my inventory." },
  { id: "projects", label: "Project pipes", number: "03", x: 44, y: 58, href: "/projects", icon: "▣", text: "See what I've been building." },
  { id: "experience", label: "Work castle", number: "04", x: 63, y: 31, href: "/about#experience", icon: "♜", text: "A tour of the work so far." },
  { id: "play", label: "Bonus stage", number: "05", x: 79, y: 56, href: "/play", icon: "★", text: "Actually play the portfolio." },
  { id: "contact", label: "Finish flag", number: "06", x: 91, y: 29, href: "/contact", icon: "⚑", text: "Let's make something together." }
] as const;

const storageKey = "portfolio-visited-stops";

export function WorldMap() {
  const [selected, setSelected] = useState<string>(stops[0].id);
  const [visited, setVisited] = useState<string[]>([]);
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(value)) setVisited(value.filter((item): item is string => typeof item === "string" && stops.some((stop) => stop.id === item)));
    } catch { /* Corrupt local progress is safe to ignore. */ }
  }, []);

  const active = stops.find((stop) => stop.id === selected) || stops[0];
  function selectStop(id: string) {
    setSelected(id);
    setVisited((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return <div className="world-shell">
    <div className="world-toolbar"><div><span className="eyebrow">INTERACTIVE WORLD MAP</span><p>Select each stop to explore. Your progress stays on this device.</p></div><span className="world-progress">STOPS FOUND <strong>{visited.length}/{stops.length}</strong></span></div>
    <div className="world-scroll" tabIndex={0} aria-label="Scrollable world map">
      <div className="world-scene">
        <div className="world-sun" /><div className="world-cloud w-cloud-one" /><div className="world-cloud w-cloud-two" /><div className="world-hill wh-one" /><div className="world-hill wh-two" /><div className="world-hill wh-three" />
        <svg className="world-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={stops.map((stop) => stop.x + "," + stop.y).join(" ")} fill="none" stroke="#fdf0b4" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="2.2 2.2" /></svg>
        {stops.map((stop) => <button key={stop.id} type="button" className={"world-stop" + (selected === stop.id ? " active" : "") + (visited.includes(stop.id) ? " visited" : "")} style={{ left: stop.x + "%", top: stop.y + "%" }} onClick={() => selectStop(stop.id)} aria-pressed={selected === stop.id} aria-label={stop.label}>
          <span className="stop-icon">{stop.icon}</span><span className="stop-label">{stop.label}</span><span className="stop-complete" aria-hidden="true">✓</span>
        </button>)}
        <div className="world-avatar" style={{ left: active.x + "%", top: active.y + "%" }}><PixelAvatar /></div>
        <div className="world-ground" />
      </div>
    </div>
    <div className="world-info"><div className="world-info-number">{active.number}<span>/ 06</span></div><div><span className="eyebrow">NOW EXPLORING</span><h2>{active.label}</h2><p>{active.text}</p></div><Link className="btn btn-primary" href={active.href}>Enter this level ↗</Link></div>
    <div className="world-secret-hint" role="status"><strong>EXPLORER BADGE:</strong> {visited.length}/{stops.length} landmarks discovered. {visited.length === stops.length ? "You've explored every stop!" : "Visit all six stops to reveal a bonus developer shortcut."}</div>
    {visited.length === stops.length && <div className="world-secret-reveal"><strong>★ Secret unlocked: The Builder's Console</strong><p>It's not behind a puzzle or paywall. You've earned a shortcut to the interactive developer console on the homepage.</p><Link href="/#developer-console">Open the console ↗</Link></div>}
    <div className="world-dots" aria-label="World stop selector">{stops.map((stop) => <button type="button" key={stop.id} className={selected === stop.id ? "active" : ""} onClick={() => selectStop(stop.id)} aria-label={"Select " + stop.label} aria-pressed={selected === stop.id} />)}</div>
  </div>;
}
