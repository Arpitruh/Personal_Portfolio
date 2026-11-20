"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { QUEST_KEY, questForPath, safeQuests } from "@/data/quests";

const navigation = [
  { href: "/", label: "Home", icon: "⌂", keywords: "start intro" },
  { href: "/world", label: "World", icon: "◇", keywords: "explore map" },
  { href: "/room", label: "Room", icon: "⌘", keywords: "developer workstation" },
  { href: "/projects", label: "Projects", icon: "▣", keywords: "work case studies" },
  { href: "/about", label: "About", icon: "◈", keywords: "skills experience" },
  { href: "/recruiter", label: "Resume", icon: "▤", keywords: "recruiter resume career print" },
  { href: "/play", label: "Play", icon: "✦", keywords: "game level" },
  { href: "/now", label: "Now", icon: "◷", keywords: "currently building" },
  { href: "/contact", label: "Contact", icon: "↗", keywords: "email collaborate" },
  { href: "/skills", label: "Skills", icon: "✳", keywords: "technology universe inventory" },
  { href: "/achievements", label: "Badges", icon: "★", keywords: "achievements quests" },
  { href: "/assistant", label: "Guide", icon: "?", keywords: "assistant ask search" }
];

type Theme = "day" | "night";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("day");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored === "night" || stored === "day") setTheme(stored);
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("portfolio-theme", theme); } catch { /* Private windows can block persistence. */ }
  }, [theme, themeLoaded]);

  useEffect(() => {
    setMenuOpen(false);
    setPaletteOpen(false);
    setQuery("");
    const quest=questForPath(pathname);
    if (!quest) return;
    try {
      const stored=safeQuests(JSON.parse(localStorage.getItem(QUEST_KEY)||"[]"));
      if (!stored.includes(quest)) {
        localStorage.setItem(QUEST_KEY,JSON.stringify([...stored,quest]));
        window.dispatchEvent(new Event("portfolio-quest"));
      }
    } catch { /* Achievements are optional and stay on the visitor's device. */ }
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!paletteOpen) return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    searchRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const popup = searchRef.current?.closest("[role=dialog]");
      if (!popup) return;
      const focusable = Array.from(popup.querySelectorAll<HTMLElement>("input,button,a[href]")).filter(el => !el.hasAttribute("disabled"));
      if (!focusable.length) return;
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      if ((event.shiftKey && current <= 0) || (!event.shiftKey && current === focusable.length - 1)) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const previous = lastFocusRef.current;
      if (previous?.isConnected) previous.focus();
    };
  }, [paletteOpen]);

  const filtered = navigation.filter((item) =>
    (item.label + " " + item.keywords).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="announcement" aria-label="Current availability">
        <span className="status-dot" /> Welcome to world 1-1 <span className="announcement-divider">✦</span> Built for curious people
      </div>
      <header className="site-header">
        <div className="nav-container">
          <Link className="brand" href="/" aria-label="A✦ ARPIT .DEV / WORLD 01 — Arpit Yadav homepage">
            <span className="brand-mark">A<span className="brand-pixel">✦</span></span>
            <span><strong>ARPIT</strong><small>.DEV / WORLD 01</small></span>
          </Link>
          <nav className={"nav-links" + (menuOpen ? " nav-links-open" : "")} aria-label="Main navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={"nav-link" + ((pathname === item.href || (item.href === "/projects" && pathname.startsWith("/projects/"))) ? " active" : "")}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button ref={paletteTriggerRef} className="icon-button palette-shortcut" type="button" onClick={() => setPaletteOpen(true)} aria-expanded={paletteOpen} aria-controls="site-command-palette" aria-label="⌕ ⌘K — Open quick navigation" title="Search navigation (Ctrl/⌘ K)">⌕ <span>⌘K</span></button>
            <button className="icon-button" type="button" onClick={() => setTheme((value) => value === "day" ? "night" : "day")} aria-label={"Switch to " + (theme === "day" ? "night" : "day") + " theme"} title="Toggle theme">{theme === "day" ? "☾" : "☀"}</button>
            <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-inner">
          <div><Link href="/" className="footer-brand">ARPIT<span>✦</span>YADAV</Link><p>Making the web a little more fun, one interface at a time.</p></div>
          <div className="footer-nav"><Link href="/projects">Projects</Link><Link href="/recruiter">Resume</Link><Link href="/room">Dev Room</Link><Link href="/skills">Skills</Link><Link href="/achievements">Badges</Link><Link href="/assistant">Guide</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Arpit Yadav</span><span>Designed with curiosity. No coins required. ✦</span><Link href="#top">Back to top ↑</Link></div>
        </div>
      </footer>

      {paletteOpen && <div className="palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
        <div className="palette" role="dialog" aria-modal="true" aria-label="Quick navigation" id="site-command-palette">
          <div className="palette-search"><span aria-hidden="true">⌕</span><input ref={searchRef} placeholder="Where to, player one?" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search pages" /><button type="button" className="palette-esc" onClick={() => setPaletteOpen(false)}>ESC</button></div>
          <div className="palette-results">
            {filtered.map((item) => <Link href={item.href} key={item.href} className="palette-result" onClick={() => setPaletteOpen(false)}><span className="palette-symbol">{item.icon}</span><span>{item.label}</span><span aria-hidden="true">↗</span></Link>)}
            {!filtered.length && <p className="muted">No levels found. Try another search.</p>}
          </div>
          <div className="palette-foot">PRESS ⌘ / CTRL + K FROM ANYWHERE</div>
        </div>
      </div>}
    </>
  );
}
