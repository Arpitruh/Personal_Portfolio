"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";

type Mode = "ready" | "running" | "paused" | "won";
type InputKey = "left" | "right" | "jump" | "down";
type Player = { x: number; y: number; vx: number; vy: number; grounded: boolean; face: number; invulnerable: number };
type Pickup = { x: number; y: number; collected: boolean };
type Enemy = { x: number; baseX: number; dir: number; alive: boolean };
const WIDTH = 960, HEIGHT = 390, FLOOR = 316, LEVEL_WIDTH = 4300;
const PIPE_PROJECTS = projects.slice(0, 4);
const PIPES = [950, 1680, 2490, 3230].map((x, index) => ({ x, index }));
const PLATFORMS = [
  { x: 340, y: 230, w: 110, h: 22 }, { x: 620, y: 192, w: 140, h: 22 },
  { x: 1240, y: 215, w: 130, h: 22 }, { x: 1990, y: 195, w: 150, h: 22 },
  { x: 2790, y: 225, w: 150, h: 22 }, { x: 3600, y: 205, w: 130, h: 22 }
];
const initialCoins = (): Pickup[] => [
  240, 365, 410, 640, 690, 740, 1100, 1260, 1320, 1440, 1870, 2020,
  2090, 2260, 2650, 2810, 2880, 3030, 3450, 3600, 3670, 3890
].map((x, i) => ({ x, y: i % 3 === 0 ? 180 : i % 3 === 1 ? 160 : 245, collected: false }));
const initialEnemies = (): Enemy[] => [560, 1160, 1530, 2230, 2970, 3500].map((x) => ({ x, baseX: x, dir: -1, alive: true }));
const initialPlayer = (): Player => ({ x: 60, y: FLOOR - 36, vx: 0, vy: 0, grounded: true, face: 1, invulnerable: 0 });

function rectHit(a: {x:number;y:number;w:number;h:number}, b: {x:number;y:number;w:number;h:number}) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
  ctx.fillStyle = "#ffd35d"; ctx.beginPath(); ctx.ellipse(x, y, 5 + Math.abs(Math.sin(tick / 10)) * 6, 12, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = "#a66c2c"; ctx.lineWidth = 2; ctx.stroke();
}
function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, face: number, step: number) {
  const offset = Math.abs(step) > 0 ? (Math.floor(step / 5) % 2) * 2 : 0;
  ctx.fillStyle = "#14b8a6"; ctx.fillRect(x + 4, y, 24, 8); ctx.fillRect(x + (face === 1 ? 16 : 0), y + 6, 19, 5);
  ctx.fillStyle = "#f2c9a0"; ctx.fillRect(x + 5, y + 11, 22, 11);
  ctx.fillStyle = "#292344"; ctx.fillRect(x + (face === 1 ? 22 : 9), y + 13, 3, 4);
  ctx.fillStyle = "#f97346"; ctx.fillRect(x + 2, y + 22, 30, 9);
  ctx.fillStyle = "#292344"; ctx.fillRect(x + 6, y + 30, 8, 6 - offset); ctx.fillRect(x + 21, y + 30, 8, 6 + offset);
}
function sound(frequency: number, enabled: boolean, duration = 0.09) {
  if (!enabled) return;
  try {
    const AudioClass = window.AudioContext;
    if (!AudioClass) return;
    // A short oscillator per user-initiated gameplay action; no autoplay or background loop.
    const audio = new AudioClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "square"; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.025, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.onended = () => { void audio.close(); };
    oscillator.start(); oscillator.stop(audio.currentTime + duration);
  } catch { /* Audio is decorative; the game always works without it. */ }
}

export function PortfolioGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>("ready");
  const playerRef = useRef<Player>(initialPlayer());
  const keysRef = useRef<Record<InputKey, boolean>>({ left: false, right: false, jump: false, down: false });
  const coinsRef = useRef<Pickup[]>(initialCoins());
  const enemiesRef = useRef<Enemy[]>(initialEnemies());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const camRef = useRef(0);
  const tickRef = useRef(0);
  const soundRef = useRef(false);
  const portalOpenRef = useRef(false);
  const [mode, setMode] = useState<Mode>("ready");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [portal, setPortal] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const previous = Number(localStorage.getItem("portfolio-best-score"));
    if (Number.isFinite(previous) && previous > 0) setBest(previous);
  }, []);

  function updateMode(value: Mode) { modeRef.current = value; setMode(value); }
  function resetGame() {
    playerRef.current = initialPlayer(); coinsRef.current = initialCoins(); enemiesRef.current = initialEnemies();
    scoreRef.current = 0; livesRef.current = 3; camRef.current = 0; tickRef.current = 0;
    keysRef.current = { left: false, right: false, jump: false, down: false };
    portalOpenRef.current = false; setPortal(null); setScore(0); setCoins(0); setLives(3);
    updateMode("running");
  }
  function closePortal() {
    portalOpenRef.current = false; setPortal(null); keysRef.current.down = false; updateMode("running");
  }
  useEffect(() => {
    const map: Record<string, InputKey> = {
      ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
      ArrowUp: "jump", w: "jump", W: "jump", " ": "jump", ArrowDown: "down", s: "down", S: "down"
    };
    function keyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modeRef.current === "running") { modeRef.current = "paused"; setMode("paused"); return; }
      if (e.key === "Escape" && portalOpenRef.current) { portalOpenRef.current = false; setPortal(null); modeRef.current = "running"; setMode("running"); return; }
      if (!(e.key in map) || modeRef.current !== "running") return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      e.preventDefault(); keysRef.current[map[e.key]] = true;
    }
    function keyUp(e: KeyboardEvent) { if (e.key in map) keysRef.current[map[e.key]] = false; }
    function blur() { keysRef.current = { left: false, right: false, jump: false, down: false }; }
    window.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); window.removeEventListener("blur", blur); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let last = 0, accumulator = 0;
    const step = () => {
      if (modeRef.current !== "running") return;
      const player = playerRef.current, keys = keysRef.current, coins = coinsRef.current;
      tickRef.current++;
      if (player.invulnerable) player.invulnerable--;
      const target = (Number(keys.right) - Number(keys.left)) * 4.3;
      player.vx += (target - player.vx) * 0.21;
      if (Math.abs(player.vx) < 0.07) player.vx = 0;
      if (player.vx !== 0) player.face = player.vx > 0 ? 1 : -1;
      if (keys.jump && player.grounded) {
        player.vy = -12.7; player.grounded = false; sound(460, soundRef.current);
      }
      if (!keys.jump && player.vy < -5) player.vy = -5;
      player.x = Math.max(0, Math.min(LEVEL_WIDTH - 35, player.x + player.vx));
      player.vy = Math.min(12, player.vy + 0.58);
      const previousBottom = player.y + 36;
      player.y += player.vy;
      player.grounded = false;
      if (player.y + 36 >= FLOOR) { player.y = FLOOR - 36; player.vy = 0; player.grounded = true; }
      for (const platform of PLATFORMS) {
        if (player.vy >= 0 && previousBottom <= platform.y + 7 && rectHit({ x: player.x, y: player.y, w: 34, h: 36 }, platform)) {
          player.y = platform.y - 36; player.vy = 0; player.grounded = true;
        }
      }
      for (const coin of coins) {
        if (!coin.collected && Math.abs(player.x + 17 - coin.x) < 27 && Math.abs(player.y + 18 - coin.y) < 31) {
          coin.collected = true; scoreRef.current += 100; setScore(scoreRef.current);
          setCoins(coins.filter((item) => item.collected).length);
          sound(850, soundRef.current, 0.06);
        }
      }
      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        enemy.x += enemy.dir * 0.75;
        if (Math.abs(enemy.x - enemy.baseX) > 60) enemy.dir *= -1;
        if (rectHit({ x: player.x, y: player.y, w: 34, h: 36 }, { x: enemy.x, y: FLOOR - 25, w: 29, h: 25 })) {
          if (player.vy > 1 && previousBottom <= FLOOR - 8) {
            enemy.alive = false; player.vy = -8; scoreRef.current += 200; setScore(scoreRef.current); sound(220, soundRef.current);
          } else if (!player.invulnerable) {
            livesRef.current -= 1; setLives(livesRef.current); player.invulnerable = 90;
            player.x = Math.max(0, player.x - 80); player.vy = -6; sound(130, soundRef.current, 0.2);
            if (livesRef.current <= 0) {
              playerRef.current = initialPlayer(); livesRef.current = 3; setLives(3); scoreRef.current = 0; setScore(0);
              coinsRef.current = initialCoins(); setCoins(0); enemiesRef.current = initialEnemies();
            }
          }
        }
      }
      if (keys.down && player.grounded) {
        const pipe = PIPES.find((item) => Math.abs(item.x - player.x) < 58);
        if (pipe) {
          keys.down = false; portalOpenRef.current = true; setPortal(pipe.index);
          modeRef.current = "paused"; setMode("paused"); sound(300, soundRef.current, 0.12);
        }
      }
      if (player.x >= LEVEL_WIDTH - 155) {
        modeRef.current = "won"; setMode("won"); scoreRef.current += 1000; setScore(scoreRef.current);
        const stored = Number(localStorage.getItem("portfolio-best-score")) || 0;
        if (scoreRef.current > stored) { localStorage.setItem("portfolio-best-score", String(scoreRef.current)); setBest(scoreRef.current); }
        sound(950, soundRef.current, 0.25);
      }
      camRef.current = Math.max(0, Math.min(LEVEL_WIDTH - WIDTH, player.x - 270));
    };
    const draw = () => {
      const cam = camRef.current, tick = tickRef.current;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#7acfff"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#fff0a8"; ctx.beginPath(); ctx.arc(770, 68, 34, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 11; i++) {
        const x = i * 490 + 50 - (cam * .3) % 490, y = 46 + (i % 3) * 24;
        ctx.fillStyle = "#fff"; ctx.fillRect(x, y + 15, 115, 25); ctx.fillRect(x + 24, y, 65, 25);
      }
      for (let i = 0; i < 13; i++) {
        const x = i * 390 + 30 - (cam * .55) % 390;
        ctx.fillStyle = i % 2 ? "#4bbd77" : "#57c77e";
        ctx.beginPath(); ctx.ellipse(x + 150, 330, 170, 110 + i % 3 * 15, 0, Math.PI, Math.PI * 2); ctx.fill();
      }
      ctx.save(); ctx.translate(-cam, 0);
      ctx.fillStyle = "#9f572f"; ctx.fillRect(cam, FLOOR + 5, WIDTH + 10, HEIGHT - FLOOR);
      for (let i = Math.floor(cam / 32) * 32; i < cam + WIDTH + 32; i += 32) {
        ctx.strokeStyle = "#7e4027"; ctx.strokeRect(i, FLOOR + 7, 32, 30); ctx.strokeRect(i + 16, FLOOR + 37, 32, 32);
      }
      ctx.fillStyle = "#42b968"; ctx.fillRect(cam, FLOOR, WIDTH + 10, 10);
      for (const platform of PLATFORMS) {
        ctx.fillStyle = "#ce8647"; ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        ctx.fillStyle = "#f3b16d"; ctx.fillRect(platform.x, platform.y, platform.w, 6);
        ctx.fillStyle = "#7f412b"; for (let x = platform.x + 30; x < platform.x + platform.w; x += 32) ctx.fillRect(x, platform.y + 7, 3, platform.h - 7);
      }
      for (const pipe of PIPES) {
        ctx.fillStyle = "#268d4d"; ctx.fillRect(pipe.x, FLOOR - 48, 60, 48);
        ctx.fillStyle = "#39ba64"; ctx.fillRect(pipe.x - 6, FLOOR - 53, 72, 16);
        ctx.fillStyle = "#7cec9c"; ctx.fillRect(pipe.x + 5, FLOOR - 50, 8, 44);
        ctx.fillStyle = "#fff"; ctx.font = "bold 12px monospace"; ctx.fillText("↓", pipe.x + 25, FLOOR - 62);
      }
      for (const coin of coinsRef.current) if (!coin.collected) drawCoin(ctx, coin.x, coin.y, tick);
      for (const enemy of enemiesRef.current) if (enemy.alive) {
        ctx.fillStyle = "#875533"; ctx.fillRect(enemy.x + 2, FLOOR - 21, 25, 20);
        ctx.fillStyle = "#f9d5b1"; ctx.fillRect(enemy.x + 6, FLOOR - 16, 5, 6); ctx.fillRect(enemy.x + 18, FLOOR - 16, 5, 6);
        ctx.fillStyle = "#201b35"; ctx.fillRect(enemy.x + 8, FLOOR - 14, 2, 3); ctx.fillRect(enemy.x + 20, FLOOR - 14, 2, 3);
      }
      ctx.fillStyle = "#f9f6ed"; ctx.fillRect(LEVEL_WIDTH - 130, FLOOR - 170, 6, 170);
      ctx.fillStyle = "#f16b68"; ctx.fillRect(LEVEL_WIDTH - 124, FLOOR - 165, 70, 39);
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px monospace"; ctx.fillText("FINISH", LEVEL_WIDTH - 115, FLOOR - 143);
      const player = playerRef.current;
      if (player.invulnerable % 8 < 4) drawCharacter(ctx, player.x, player.y, player.face, player.vx ? tick : 0);
      ctx.restore();
      if (modeRef.current !== "running") {
        ctx.fillStyle = "rgba(21,21,45,.19)"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }
    };
    function animate(timestamp: number) {
      if (!last) last = timestamp;
      accumulator += Math.min(60, timestamp - last); last = timestamp;
      while (accumulator >= 1000 / 60) { step(); accumulator -= 1000 / 60; }
      draw(); frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  function press(key: InputKey, down: boolean) { keysRef.current[key] = down; }
  const selectedProject = portal === null ? null : PIPE_PROJECTS[portal];

  return <div className="game-shell">
    <div className="game-hud"><span>★ SCORE <strong>{String(score).padStart(5, "0")}</strong></span><span>◉ COINS <strong>{coins}/22</strong></span><span>♥ LIVES <strong>{lives}</strong></span><button type="button" className="sound-toggle" onClick={() => { soundRef.current = !soundRef.current; setSoundOn(soundRef.current); }} aria-pressed={soundOn}>{soundOn ? "♫ SOUND ON" : "♪ SOUND OFF"}</button></div>
    <div className="game-screen">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} role="img" aria-label="Pixel-art side scrolling platform game. Use the accessible controls below to move, jump and explore project pipes." />
      {(mode === "ready" || (mode === "paused" && !selectedProject) || mode === "won") && <div className="game-overlay">
        <span className="eyebrow">{mode === "won" ? "LEVEL COMPLETE" : mode === "paused" ? "GAME PAUSED" : "WORLD 1-1 · ARPIT'S ADVENTURE"}</span>
        <h2>{mode === "won" ? "You made it! 🏁" : mode === "paused" ? "Adventure on hold" : "Ready, player one?"}</h2>
        <p>{mode === "won" ? "The real treasure was the projects you discovered along the way." : "Collect coins, dodge critters and press ↓ beside a pipe to open a project."}</p>
        <div className="button-group"><button className="btn btn-primary" type="button" onClick={() => mode === "ready" || mode === "won" ? resetGame() : updateMode("running")}>{mode === "won" ? "Play again ↻" : mode === "paused" ? "Resume ▶" : "Start game ▶"}</button>{mode === "won" && <Link className="btn btn-outline" href="/projects">Explore projects ↗</Link>}</div>
        {best > 0 && <small>YOUR BEST SCORE: {best.toLocaleString()}</small>}
      </div>}
      {selectedProject && <div className="game-overlay pipe-overlay" role="dialog" aria-modal="true" aria-label={selectedProject.title + " project"}>
        <span className="eyebrow">SECRET PROJECT ROOM · 0{portal! + 1}</span>
        <div className="pipe-emoji">{selectedProject.emoji}</div><h2>{selectedProject.title}</h2><p>{selectedProject.summary}</p>
        <div className="button-group"><Link className="btn btn-primary" href={"/projects/" + selectedProject.slug}>View case study ↗</Link><button className="btn btn-outline" type="button" onClick={closePortal}>Back to game ←</button></div>
      </div>}
    </div>
    <div className="game-controls"><div className="game-control-left">{(["left", "right"] as const).map((key) => <button key={key} type="button" className="control-button" aria-label={key === "left" ? "Move left" : "Move right"} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(key, true); }} onPointerUp={() => press(key, false)} onPointerCancel={() => press(key, false)}>{key === "left" ? "◀" : "▶"}</button>)}</div><span className="control-tip">MOVE: ← → / A D <span>·</span> JUMP: SPACE / W <span>·</span> PIPE: ↓ / S</span><div className="game-control-right"><button type="button" className="control-button" aria-label="Enter pipe" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("down", true); }} onPointerUp={() => press("down", false)} onPointerCancel={() => press("down", false)}>↓</button><button type="button" className="control-button jump-button" aria-label="Jump" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("jump", true); }} onPointerUp={() => press("jump", false)} onPointerCancel={() => press("jump", false)}>A</button></div></div>
    <div className="game-footnote"><span>BUILT FROM SCRATCH WITH CANVAS + REACT</span><Link href="/world">Prefer to explore the map? ↗</Link></div>
  </div>;
}
