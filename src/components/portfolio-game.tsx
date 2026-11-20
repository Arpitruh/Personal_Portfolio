"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import { GAME_CLEAR_KEY, GAME_SAVE_KEY, GAME_RECORDS_KEY, GAME_SETTINGS_KEY, gameLevels, validateGameSave, validateLevelRecord, rankMission, difficultySettings, type GameDifficulty, type GamePowerup, type LevelRecord, type GameCheckpointSave } from "@/data/game-levels";

type Mode = "ready" | "running" | "paused" | "won";
type InputKey = "left" | "right" | "jump" | "down";
type Player = { x: number; y: number; vx: number; vy: number; grounded: boolean; face: number; invulnerable: number };
type Pickup = { x: number; y: number; collected: boolean };
type Enemy = { x: number; baseX: number; dir: number; alive: boolean };
type Power = {x:number;y:number;type:GamePowerup;collected:boolean};
type Star = {x:number;y:number;collected:boolean};
const WIDTH = 960, HEIGHT = 390, FLOOR = 316;
const initialCoins = (level = gameLevels[0]): Pickup[] => level.coins.map(({ x, y }) => ({ x, y, collected: false }));
const initialEnemies = (level = gameLevels[0]): Enemy[] => level.enemies.map(x => ({ x, baseX: x, dir: -1, alive: true }));
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
  const [levelIndex, setLevelIndex] = useState(0);
  const levelRef = useRef(gameLevels[0]);
  const checkpointRef = useRef(-1);
  const [checkpoint, setCheckpoint] = useState(-1);
  const [saves, setSaves] = useState<Record<string, GameCheckpointSave>>({});
  const [cleared, setCleared] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const portalReturnFocusRef = useRef<HTMLElement | null>(null);
  const portalCloseRef = useRef<HTMLButtonElement>(null);
  const modeRef = useRef<Mode>("ready");
  const playerRef = useRef<Player>(initialPlayer());
  const keysRef = useRef<Record<InputKey, boolean>>({ left: false, right: false, jump: false, down: false });
  const coinsRef = useRef<Pickup[]>(initialCoins());
  const enemiesRef = useRef<Enemy[]>(initialEnemies());
  const powersRef = useRef<Power[]>(gameLevels[0].powerups?.map(p=>({...p,collected:false}))??[]);
  const starsRef = useRef<Star[]>(gameLevels[0].secretStars?.map(p=>({...p,collected:false}))??[]);
  const shieldRef = useRef(0);
  const speedRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastDamageRef = useRef(-1000);
  const [difficulty,setDifficulty]=useState<GameDifficulty>("normal");
  const difficultyRef=useRef<GameDifficulty>("normal");
  const [shield,setShield]=useState(0);
  const [speedBoost,setSpeedBoost]=useState(0);
  const [stars,setStars]=useState(0);
  const [elapsed,setElapsed]=useState(0);
  const [records,setRecords]=useState<Record<string,LevelRecord>>({});
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
    try {
      const raw = JSON.parse(localStorage.getItem(GAME_SAVE_KEY) || "{}") as Record<string, unknown>;
      const safe: Record<string, GameCheckpointSave> = {};
      for (const level of gameLevels) {
        const candidate = validateGameSave(raw?.[level.id], level);
        if (candidate) safe[level.id] = candidate;
      }
      setSaves(safe);
      const won = JSON.parse(localStorage.getItem(GAME_CLEAR_KEY) || "[]");
      if (Array.isArray(won)) setCleared(won.filter((x): x is string => typeof x === "string" && gameLevels.some(l => l.id === x)));
    } catch { /* Invalid local game data is safely ignored. */ }
    const previous = Number(localStorage.getItem("portfolio-best-score"));
    if (Number.isFinite(previous) && previous > 0) setBest(previous);
    try {
      const difficultySaved=localStorage.getItem(GAME_SETTINGS_KEY);
      if(difficultySaved==="casual"||difficultySaved==="normal"||difficultySaved==="expert"){
        difficultyRef.current=difficultySaved;setDifficulty(difficultySaved);
      }
      const rawRecords=JSON.parse(localStorage.getItem(GAME_RECORDS_KEY)||"{}");
      const validated:Record<string,LevelRecord>={};
      for(const level of gameLevels){const record=validateLevelRecord(rawRecords?.[level.id]);if(record)validated[level.id]=record;}
      setRecords(validated);
    }catch{/* Storage is optional and never needed to play. */}
  }, []);

  function updateMode(value: Mode) { modeRef.current = value; setMode(value); }
  function chooseLevel(index: number) {
    if (index < 0 || index >= gameLevels.length || modeRef.current === "running") return;
    levelRef.current = gameLevels[index];
    setLevelIndex(index);
    checkpointRef.current = -1; setCheckpoint(-1);
    playerRef.current = initialPlayer(); coinsRef.current = initialCoins(levelRef.current); enemiesRef.current = initialEnemies(levelRef.current);
    powersRef.current=levelRef.current.powerups?.map(p=>({...p,collected:false}))??[];
    starsRef.current=levelRef.current.secretStars?.map(p=>({...p,collected:false}))??[];
    shieldRef.current=0;speedRef.current=0;elapsedRef.current=0;lastDamageRef.current=-1000;
    scoreRef.current = 0; livesRef.current = difficultySettings(difficultyRef.current).lives; camRef.current = 0; tickRef.current = 0;
    setScore(0); setCoins(0); setLives(livesRef.current);setShield(0);setSpeedBoost(0);setElapsed(0);setStars(0);setPortal(null); setNotice("");
    keysRef.current = { left: false, right: false, jump: false, down: false };
    updateMode("ready");
  }
  function resetGame(resume = false) {
    const level = levelRef.current;
    const save = resume ? saves[level.id] : null;
    const player = initialPlayer();
    if (save) player.x = level.checkpoints[save.checkpointIndex] + 20;
    playerRef.current = player;
    coinsRef.current = initialCoins(level);
    enemiesRef.current = initialEnemies(level);
    powersRef.current=level.powerups?.map(p=>({...p,collected:false}))??[];
    starsRef.current=level.secretStars?.map(p=>({...p,collected:false}))??[];
    shieldRef.current=0;speedRef.current=0;elapsedRef.current=0;lastDamageRef.current=-1000;
    for (const i of save?.collected || []) coinsRef.current[i].collected = true;
    for (const i of save?.defeated || []) enemiesRef.current[i].alive = false;
    scoreRef.current = save?.score ?? 0;
    livesRef.current = save?.lives ?? difficultySettings(difficultyRef.current).lives;
    camRef.current = save ? Math.max(0, player.x - 270) : 0; tickRef.current = 0;
    checkpointRef.current = save?.checkpointIndex ?? -1; setCheckpoint(checkpointRef.current);
    keysRef.current = { left: false, right: false, jump: false, down: false };
    portalOpenRef.current = false; setPortal(null); setNotice(save ? "CHECKPOINT RESTORED" : "");
    setScore(scoreRef.current); setCoins(coinsRef.current.filter(x => x.collected).length); setLives(livesRef.current);
    setStars(0);setShield(0);setSpeedBoost(0);setElapsed(0);
    updateMode("running");
  }
  function saveCheckpoint(index: number) {
    const level = levelRef.current;
    checkpointRef.current = index; setCheckpoint(index);
    const nextSave: GameCheckpointSave = {
      levelId: level.id, checkpointIndex: index, score: scoreRef.current, lives: livesRef.current,
      collected: coinsRef.current.flatMap((coin, i) => coin.collected ? [i] : []),
      defeated: enemiesRef.current.flatMap((enemy, i) => !enemy.alive ? [i] : [])
    };
    setSaves(current => {
      const next = { ...current, [level.id]: nextSave };
      try { localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(next)); } catch { /* Persistence is optional. */ }
      return next;
    });
    setNotice("CHECKPOINT SAVED · " + (index + 1) + "/" + level.checkpoints.length);
  }
  function changeDifficulty(value:GameDifficulty){
    if(modeRef.current==="running"||modeRef.current==="paused")return;
    difficultyRef.current=value;setDifficulty(value);
    try{localStorage.setItem(GAME_SETTINGS_KEY,value);}catch{}
    livesRef.current=difficultySettings(value).lives;setLives(livesRef.current);
  }
  function closePortal() {
    portalOpenRef.current = false; setPortal(null); keysRef.current.down = false; updateMode("running");
  }
  useEffect(() => {
    if (portal !== null) portalCloseRef.current?.focus();
    else if (portalReturnFocusRef.current && mode === "running") {
      portalReturnFocusRef.current.focus();
      portalReturnFocusRef.current = null;
    }
  }, [portal, mode]);

  useEffect(() => {
    const map: Record<string, InputKey> = {
      ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
      ArrowUp: "jump", w: "jump", W: "jump", " ": "jump", ArrowDown: "down", s: "down", S: "down"
    };
    function keyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modeRef.current === "running") { modeRef.current = "paused"; setMode("paused"); keysRef.current = { left: false, right: false, jump: false, down: false }; return; }
      if (e.key === "Escape" && portalOpenRef.current) { portalOpenRef.current = false; setPortal(null); modeRef.current = "running"; setMode("running"); return; }
      if (!(e.key in map) || modeRef.current !== "running") return;
      const target = e.target as HTMLElement | null;
      if (target && (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName) || target.isContentEditable)) return;
      e.preventDefault(); keysRef.current[map[e.key]] = true;
    }
    function keyUp(e: KeyboardEvent) { if (e.key in map) keysRef.current[map[e.key]] = false; }
    function blur() { keysRef.current = { left: false, right: false, jump: false, down: false }; }
    function visibility() { if (document.hidden && modeRef.current === "running") { blur(); modeRef.current = "paused"; setMode("paused"); } }
    window.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); window.addEventListener("blur", blur); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); window.removeEventListener("blur", blur); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let last = 0, accumulator = 0;
    let lastDrawState = "";
    const step = () => {
      if (modeRef.current !== "running") return;
      const player = playerRef.current, keys = keysRef.current, coins = coinsRef.current;
      const level = levelRef.current;
      tickRef.current++;
      elapsedRef.current++;
      if(elapsedRef.current%60===0)setElapsed(Math.floor(elapsedRef.current/60));
      if (player.invulnerable) player.invulnerable--;
      if(shieldRef.current>0){shieldRef.current--;if(shieldRef.current%60===0)setShield(Math.ceil(shieldRef.current/60));}
      if(speedRef.current>0){speedRef.current--;if(speedRef.current%60===0)setSpeedBoost(Math.ceil(speedRef.current/60));}
      const target = (Number(keys.right) - Number(keys.left)) * (speedRef.current>0?6.1:4.3);
      player.vx += (target - player.vx) * 0.21;
      if (Math.abs(player.vx) < 0.07) player.vx = 0;
      if (player.vx !== 0) player.face = player.vx > 0 ? 1 : -1;
      if (keys.jump && player.grounded) {
        player.vy = -12.7; player.grounded = false; sound(460, soundRef.current);
      }
      if (!keys.jump && player.vy < -5) player.vy = -5;
      player.x = Math.max(0, Math.min(level.width - 35, player.x + player.vx));
      player.vy = Math.min(12, player.vy + 0.58);
      const previousBottom = player.y + 36;
      player.y += player.vy;
      player.grounded = false;
      if (player.y + 36 >= FLOOR) { player.y = FLOOR - 36; player.vy = 0; player.grounded = true; }
      for (const platform of level.platforms) {
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
      for(const power of powersRef.current){
        if(!power.collected && Math.abs(player.x+17-power.x)<28 && Math.abs(player.y+18-power.y)<33){
          power.collected=true;
          if(power.type==="shield"){shieldRef.current=60*12;setShield(12);setNotice("ENERGY SHIELD · 12 SECONDS");}
          if(power.type==="dash"){speedRef.current=60*10;setSpeedBoost(10);setNotice("SPEED BOOST · 10 SECONDS");}
          if(power.type==="heart"){livesRef.current=Math.min(5,livesRef.current+1);setLives(livesRef.current);setNotice("EXTRA LIFE FOUND");}
          scoreRef.current+=150;setScore(scoreRef.current);sound(1050,soundRef.current);
        }
      }
      for(const star of starsRef.current){
        if(!star.collected && Math.abs(player.x+17-star.x)<27 && Math.abs(player.y+18-star.y)<33){
          star.collected=true;setStars(starsRef.current.filter(x=>x.collected).length);
          scoreRef.current+=350;setScore(scoreRef.current);setNotice("SECRET STAR DISCOVERED ✦");sound(1200,soundRef.current);
        }
      }
      const damage=()=>{
        if(player.invulnerable||shieldRef.current>0||tickRef.current-lastDamageRef.current<35)return;
        lastDamageRef.current=tickRef.current;
        livesRef.current--;setLives(livesRef.current);
        player.invulnerable=difficultySettings(difficultyRef.current).damageCooldown;
        player.x=Math.max(0,player.x-76);player.vy=-6;sound(130,soundRef.current,.2);
        if(livesRef.current<=0){modeRef.current="ready";setMode("ready");setNotice("OUT OF LIVES · RESTART OR USE YOUR SAVED CHECKPOINT");}
      };
      for(const hazard of level.hazards??[]){
        if(rectHit({x:player.x+5,y:player.y+28,w:24,h:8},{x:hazard.x,y:FLOOR-13,w:hazard.w,h:13}))damage();
      }
      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        enemy.x += enemy.dir * 0.75 * difficultySettings(difficultyRef.current).enemySpeed;
        if (Math.abs(enemy.x - enemy.baseX) > 60) enemy.dir *= -1;
        if (rectHit({ x: player.x, y: player.y, w: 34, h: 36 }, { x: enemy.x, y: FLOOR - 25, w: 29, h: 25 })) {
          if (player.vy > 1 && previousBottom <= FLOOR - 8) {
            enemy.alive = false; player.vy = -8; scoreRef.current += 200; setScore(scoreRef.current); sound(220, soundRef.current);
          } else damage();
        }
      }
      if (keys.down && player.grounded) {
        const pipe = level.pipes.find((item) => Math.abs(item.x - player.x) < 58);
        if (pipe) {
          keys.down = false; portalReturnFocusRef.current = document.activeElement as HTMLElement | null; portalOpenRef.current = true; setPortal(pipe.projectIndex);
          modeRef.current = "paused"; setMode("paused"); sound(300, soundRef.current, 0.12);
        }
      }
      for (let i = 0; i < level.checkpoints.length; i++) {
        if (player.x >= level.checkpoints[i] && i > checkpointRef.current) saveCheckpoint(i);
      }
      if (player.x >= level.width - 155) {
        modeRef.current = "won"; setMode("won");
        const mission=rankMission(coins.filter(x=>x.collected).length,coins.length,starsRef.current.filter(x=>x.collected).length,livesRef.current);
        const missionBonus=Object.values(mission).filter(Boolean).length*350;
        const timeBonus=Math.max(0,2500-Math.floor(elapsedRef.current/60)*5);
        scoreRef.current += Math.floor((1000+missionBonus+timeBonus)*difficultySettings(difficultyRef.current).bonus); setScore(scoreRef.current);
        const levelRecord:LevelRecord={score:scoreRef.current,coins:coins.filter(x=>x.collected).length,stars:starsRef.current.filter(x=>x.collected).length,seconds:Math.floor(elapsedRef.current/60),difficulty:difficultyRef.current};
        setRecords(current=>{const older=current[level.id];const next=(!older||older.score<levelRecord.score)?{...current,[level.id]:levelRecord}:current;
          try{localStorage.setItem(GAME_RECORDS_KEY,JSON.stringify(next));}catch{}return next;});
        const stored = Number(localStorage.getItem("portfolio-best-score")) || 0;
        if (scoreRef.current > stored) { localStorage.setItem("portfolio-best-score", String(scoreRef.current)); setBest(scoreRef.current); }
        setCleared(current => {
          const next = Array.from(new Set([...current, level.id]));
          try { localStorage.setItem(GAME_CLEAR_KEY, JSON.stringify(next)); } catch { /* Browsers can disable storage. */ }
          return next;
        });
        setSaves(current => {
          const next = { ...current }; delete next[level.id];
          try { localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(next)); } catch { /* Optional save. */ }
          return next;
        });
        sound(950, soundRef.current, 0.25);
      }
      camRef.current = Math.max(0, Math.min(level.width - WIDTH, player.x - 270));
    };
    const draw = () => {
      const cam = camRef.current, tick = tickRef.current, level = levelRef.current;
      ctx.imageSmoothingEnabled = false;
      const skies:Record<string,string>={meadow:"#7acfff",sunset:"#ffc09d",midnight:"#23264d",neon:"#312452",frost:"#a2dcf5"};
      ctx.fillStyle=skies[level.theme];ctx.fillRect(0,0,WIDTH,HEIGHT);
      if(level.theme==="neon"||level.theme==="frost"){
        for(let i=0;i<15;i++){
          const x=i*125-(cam*.18)%125;
          ctx.fillStyle=level.theme==="neon"?(i%2?"#493d8c":"#564595"):(i%2?"#c5eafa":"#dcf6ff");
          ctx.fillRect(x,140+i%4*17,94,180);
          if(level.theme==="neon"){ctx.fillStyle="#e6b3fa";for(let y=165+i%4*17;y<270;y+=21)ctx.fillRect(x+18,y,8,8);}
        }
      }
      ctx.fillStyle = level.theme === "midnight" ? "#f5efff" : "#fff0a8"; ctx.beginPath(); ctx.arc(770, 68, level.theme === "midnight" ? 23 : 34, 0, Math.PI * 2); ctx.fill();
      if (level.theme === "midnight") for (let i = 0; i < 55; i++) { ctx.fillStyle = i % 3 ? "#b9b4df" : "#f5dfab"; ctx.fillRect((i * 181 + 34 - cam * .08) % WIDTH, 15 + (i * 37) % 185, 2 + i % 2, 2); }
      for (let i = 0; i < 11; i++) {
        const x = i * 490 + 50 - (cam * .3) % 490, y = 46 + (i % 3) * 24;
        ctx.fillStyle = "#fff"; ctx.fillRect(x, y + 15, 115, 25); ctx.fillRect(x + 24, y, 65, 25);
      }
      for (let i = 0; i < 13; i++) {
        const x = i * 390 + 30 - (cam * .55) % 390;
        ctx.fillStyle = level.theme === "midnight" ? (i % 2 ? "#44446e" : "#52507d") : level.theme === "sunset" ? (i % 2 ? "#e8a073" : "#eaba8d") : (i % 2 ? "#4bbd77" : "#57c77e");
        ctx.beginPath(); ctx.ellipse(x + 150, 330, 170, 110 + i % 3 * 15, 0, Math.PI, Math.PI * 2); ctx.fill();
      }
      ctx.save(); ctx.translate(-cam, 0);
      ctx.fillStyle = "#9f572f"; ctx.fillRect(cam, FLOOR + 5, WIDTH + 10, HEIGHT - FLOOR);
      for (let i = Math.floor(cam / 32) * 32; i < cam + WIDTH + 32; i += 32) {
        ctx.strokeStyle = "#7e4027"; ctx.strokeRect(i, FLOOR + 7, 32, 30); ctx.strokeRect(i + 16, FLOOR + 37, 32, 32);
      }
      ctx.fillStyle = "#42b968"; ctx.fillRect(cam, FLOOR, WIDTH + 10, 10);
      for (const platform of level.platforms) {
        ctx.fillStyle = "#ce8647"; ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        ctx.fillStyle = "#f3b16d"; ctx.fillRect(platform.x, platform.y, platform.w, 6);
        ctx.fillStyle = "#7f412b"; for (let x = platform.x + 30; x < platform.x + platform.w; x += 32) ctx.fillRect(x, platform.y + 7, 3, platform.h - 7);
      }
      for (const hazard of level.hazards??[]){
        ctx.fillStyle="#662b48";ctx.fillRect(hazard.x,FLOOR-7,hazard.w,9);
        ctx.fillStyle=level.theme==="frost"?"#e8faff":"#ff6f77";
        for(let x=hazard.x;x<hazard.x+hazard.w-9;x+=14){ctx.beginPath();ctx.moveTo(x,FLOOR-7);ctx.lineTo(x+7,FLOOR-24);ctx.lineTo(x+14,FLOOR-7);ctx.fill();}
      }
      for (const pipe of level.pipes) {
        ctx.fillStyle = "#268d4d"; ctx.fillRect(pipe.x, FLOOR - 48, 60, 48);
        ctx.fillStyle = "#39ba64"; ctx.fillRect(pipe.x - 6, FLOOR - 53, 72, 16);
        ctx.fillStyle = "#7cec9c"; ctx.fillRect(pipe.x + 5, FLOOR - 50, 8, 44);
        ctx.fillStyle = "#fff"; ctx.font = "bold 12px monospace"; ctx.fillText("↓", pipe.x + 25, FLOOR - 62);
      }
      for (const x of level.checkpoints) {
        ctx.fillStyle = "#ece8f6"; ctx.fillRect(x, FLOOR - 94, 5, 94);
        ctx.fillStyle = "#ffbd59"; ctx.fillRect(x + 5, FLOOR - 92, 52, 26);
        ctx.fillStyle = "#39334c"; ctx.font = "bold 12px monospace"; ctx.fillText("SAVE", x + 10, FLOOR - 74);
      }
      for (const coin of coinsRef.current) if (!coin.collected) drawCoin(ctx, coin.x, coin.y, tick);
      for(const power of powersRef.current)if(!power.collected){
        ctx.fillStyle=power.type==="shield"?"#6adbe0":power.type==="dash"?"#fcb76e":"#ff729a";
        ctx.fillRect(power.x-14,power.y-14,28,28);ctx.strokeStyle="#292344";ctx.lineWidth=3;ctx.strokeRect(power.x-14,power.y-14,28,28);
        ctx.fillStyle="#25213e";ctx.font="bold 19px monospace";ctx.fillText(power.type==="shield"?"◇":power.type==="dash"?"»":"♥",power.x-10,power.y+7);
      }
      for(const star of starsRef.current)if(!star.collected){
        ctx.fillStyle="#fff5a6";ctx.font="bold 28px monospace";ctx.fillText("✦",star.x-12,star.y+7+Math.sin(tick/12)*3);
      }
      for (const enemy of enemiesRef.current) if (enemy.alive) {
        ctx.fillStyle = "#875533"; ctx.fillRect(enemy.x + 2, FLOOR - 21, 25, 20);
        ctx.fillStyle = "#f9d5b1"; ctx.fillRect(enemy.x + 6, FLOOR - 16, 5, 6); ctx.fillRect(enemy.x + 18, FLOOR - 16, 5, 6);
        ctx.fillStyle = "#201b35"; ctx.fillRect(enemy.x + 8, FLOOR - 14, 2, 3); ctx.fillRect(enemy.x + 20, FLOOR - 14, 2, 3);
      }
      ctx.fillStyle = "#f9f6ed"; ctx.fillRect(level.width - 130, FLOOR - 170, 6, 170);
      ctx.fillStyle = "#f16b68"; ctx.fillRect(level.width - 124, FLOOR - 165, 70, 39);
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px monospace"; ctx.fillText("FINISH", level.width - 115, FLOOR - 143);
      const player = playerRef.current;
      if (player.invulnerable % 8 < 4) drawCharacter(ctx, player.x, player.y, player.face, player.vx ? tick : 0);
      if(shieldRef.current>0){ctx.strokeStyle="#72f7ed";ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(player.x+17,player.y+18,26,30,0,0,Math.PI*2);ctx.stroke();}
      if(speedRef.current>0){ctx.fillStyle="#ffde72";ctx.fillRect(player.x-player.face*13,player.y+10,7,5);ctx.fillRect(player.x-player.face*23,player.y+19,11,5);}
      ctx.restore();
      if (modeRef.current !== "running") {
        ctx.fillStyle = "rgba(21,21,45,.19)"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }
    };
    function animate(timestamp: number) {
      if (!last) last = timestamp;
      accumulator += Math.min(60, timestamp - last); last = timestamp;
      while (accumulator >= 1000 / 60) { step(); accumulator -= 1000 / 60; }
      // Canvas is expensive on mobile; don't repaint an unchanged, paused scene.
      const drawState = levelRef.current.id + ":" + tickRef.current + ":" + modeRef.current;
      if (drawState !== lastDrawState) { draw(); lastDrawState = drawState; }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  function press(key: InputKey, down: boolean) { keysRef.current[key] = down; }
  const level = gameLevels[levelIndex];
  const selectedProject = portal === null ? null : projects[portal];
  const missions=rankMission(coins,level.coins.length,stars,lives);
  const collectedMissions=[missions.collector,missions.explorer,missions.survivor,missions.perfect].filter(Boolean).length;
  const totalSeconds=String(Math.floor(elapsed/60)).padStart(2,"0")+":"+String(elapsed%60).padStart(2,"0");

  return <div className="game-shell">
    <div className="level-selector" role="group" aria-label="Choose a game world">
      {gameLevels.map((item, index) => <button key={item.id} type="button" disabled={mode === "running"} aria-pressed={levelIndex === index} className={levelIndex === index ? "level-tab active" : "level-tab"} onClick={() => chooseLevel(index)}>
        <span>WORLD {index + 1} / {gameLevels.length} {cleared.includes(item.id) ? "✓" : ""}</span><strong>{item.title}</strong><small>{item.subtitle}</small>
      </button>)}
    </div>
    <div className="game-adventure-options"><div className="game-difficulty-picker"><label htmlFor="game-difficulty">DIFFICULTY</label><select id="game-difficulty" value={difficulty} disabled={mode==="running"||mode==="paused"} onChange={e=>changeDifficulty(e.target.value as GameDifficulty)}><option value="casual">Explorer · 5 lives</option><option value="normal">Adventure · 3 lives</option><option value="expert">Hardcore · 2 lives</option></select></div><div className="game-campaign-status" aria-label="Campaign progress"><strong>{cleared.length} / {gameLevels.length} WORLDS CLEARED</strong><div className="game-campaign-track"><span style={{width:Math.min(100,cleared.length/gameLevels.length*100)+"%"}}/></div></div></div>
    <div className="game-a11y-info"><p>Five handcrafted worlds, hidden stars, timed records and project portals. Checkpoints save locally; all projects remain accessible without playing.</p>
      <button type="button" className="game-pause-button" disabled={mode === "ready" || mode === "won"} onClick={() => updateMode(mode === "running" ? "paused" : "running")}>{mode === "running" ? "Pause game II" : "Resume game ▶"}</button>
    </div>
    <div className="game-hud"><span>★ SCORE <strong>{String(score).padStart(5, "0")}</strong></span><span>◉ COINS <strong>{coins}/{level.coins.length}</strong></span><span>⚑ SAVE <strong>{checkpoint < 0 ? "—" : checkpoint + 1 + "/" + level.checkpoints.length}</strong></span><span>♥ LIVES <strong>{lives}</strong></span><span>✦ STARS <strong>{stars}/{level.secretStars?.length??0}</strong></span><span>◷ TIME <strong>{totalSeconds}</strong></span>{shield>0&&<span className="game-buff">◇ SHIELD <strong>{shield}s</strong></span>}{speedBoost>0&&<span className="game-buff">» DASH <strong>{speedBoost}s</strong></span>}<button type="button" className="sound-toggle" onClick={() => { soundRef.current = !soundRef.current; setSoundOn(soundRef.current); }} aria-pressed={soundOn}>{soundOn ? "♫ SOUND ON" : "♪ SOUND OFF"}</button></div>
    <div className="game-progress" aria-label="Level objective progress"><span>START</span><div><span style={{width:Math.min(100,Math.max(0,(checkpoint+1)/Math.max(1,level.checkpoints.length+1)*100))+"%"}}/></div><span>FINISH</span></div>
    <div className="game-screen">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} role="img" aria-label={"Pixel-art platform game, " + level.title + ". Move and jump using the controls beneath the canvas. The project links are also available without playing."} />
      {(mode === "ready" || (mode === "paused" && !selectedProject) || mode === "won") && <div className="game-overlay">
        <span className="eyebrow">{mode === "won" ? "LEVEL COMPLETE" : mode === "paused" ? "GAME PAUSED" : "WORLD " + (levelIndex + 1) + "-" + (levelIndex + 1) + " · " + level.title.toUpperCase()}</span>
        <h2>{mode === "won" ? "You made it! 🏁" : mode === "paused" ? "Adventure on hold" : lives === 0 ? "Game over · try again" : "Ready, player one?"}</h2>
        <p>{mode === "won" ? "World cleared! Collect stars, coins and mission rewards to raise your record." : "Gather coins and stars, avoid spikes, pick up abilities, stomp enemies and press ↓ near pipes to explore projects."}</p>
        {mode==="won"&&<div className="game-victory-stats"><span>★ {score.toLocaleString()} POINTS</span><span>✦ {stars} SECRETS</span><span>◷ {totalSeconds}</span><span>◆ {collectedMissions}/4 MISSIONS</span></div>}
        <div className="button-group"><button className="btn btn-primary" type="button" onClick={() => mode === "ready" || mode === "won" ? resetGame() : updateMode("running")}>{mode === "won" ? "Play again ↻" : mode === "paused" ? "Resume ▶" : "Start game ▶"}</button>
          {mode === "ready" && saves[level.id] && <button className="btn btn-outline" type="button" onClick={() => resetGame(true)}>Continue from checkpoint ⚑</button>}
          {mode === "won" && levelIndex < gameLevels.length - 1 && <button type="button" className="btn btn-outline" onClick={() => chooseLevel(levelIndex + 1)}>Next world →</button>}
          {mode === "won" && <Link className="btn btn-outline" href="/projects">Explore projects ↗</Link>}
        </div>
        {best > 0 && <small>YOUR ALL-TIME BEST SCORE: {best.toLocaleString()}</small>}
      </div>}
      {selectedProject && <div className="game-overlay pipe-overlay" role="dialog" aria-modal="true" aria-label={selectedProject.title + " project"} onKeyDown={e => { if (e.key === "Tab") { const focusable = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a,button")); const index = focusable.indexOf(document.activeElement as HTMLElement); if ((e.shiftKey && index === 0) || (!e.shiftKey && index === focusable.length - 1)) { e.preventDefault(); (e.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus(); } } }}>
        <span className="eyebrow">SECRET PROJECT ROOM · {String(portal! + 1).padStart(2,"0")}</span>
        <div className="pipe-emoji">{selectedProject.emoji}</div><h2>{selectedProject.title}</h2><p>{selectedProject.summary}</p>
        <div className="button-group"><Link className="btn btn-primary" href={"/projects/" + selectedProject.slug}>View case study ↗</Link><button ref={portalCloseRef} className="btn btn-outline" type="button" onClick={closePortal}>Back to game ←</button></div>
      </div>}
    </div>
    {notice && mode === "running" && <div className="game-save-notice" role="status">{notice}</div>}
    <div className="game-controls"><div className="game-control-left">{(["left", "right"] as const).map((key) => <button key={key} type="button" className="control-button" aria-label={key === "left" ? "Move left" : "Move right"} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(key, true); }} onPointerUp={() => press(key, false)} onPointerCancel={() => press(key, false)} onLostPointerCapture={() => press(key, false)}>{key === "left" ? "◀" : "▶"}</button>)}</div><span className="control-tip">MOVE: ← → / A D <span>·</span> JUMP: SPACE / W <span>·</span> PIPE: ↓ / S</span><div className="game-control-right"><button type="button" className="control-button" aria-label="Enter pipe" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("down", true); }} onPointerUp={() => press("down", false)} onPointerCancel={() => press("down", false)} onLostPointerCapture={() => press("down", false)}>↓</button><button type="button" className="control-button jump-button" aria-label="Jump" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("jump", true); }} onPointerUp={() => press("jump", false)} onPointerCancel={() => press("jump", false)} onLostPointerCapture={() => press("jump", false)}>A</button></div></div>
    <div className="game-mission-layout"><section className="game-missions" aria-label="World side quests"><h3>WORLD QUESTS</h3><div className="game-mission-grid"><span className={missions.collector?"complete":""}>◉ Collect 75% of coins {missions.collector?"✓":""}</span><span className={missions.explorer?"complete":""}>✦ Find a hidden star {missions.explorer?"✓":""}</span><span className={missions.survivor?"complete":""}>♥ Keep 2 lives {missions.survivor?"✓":""}</span><span className={missions.perfect?"complete":""}>★ Master the world (95% coins + 2 stars + 2 lives) {missions.perfect?"✓":""}</span></div></section><section className="game-records" aria-label="World record"><h3>YOUR BEST RUN</h3>{records[level.id]?<div><strong>{records[level.id].score.toLocaleString()} pts</strong><p>{records[level.id].coins} coins · {records[level.id].stars} stars · {Math.floor(records[level.id].seconds/60)}m {records[level.id].seconds%60}s · {records[level.id].difficulty}</p></div>:<p>No completed run yet. Every first clear is a new record.</p>}</section></div>
    <section className="game-accessible-projects" aria-label="All project entrances in this world"><h3>Skip the platformer. Explore these projects directly.</h3><div>{level.pipes.map(pipe => { const p = projects[pipe.projectIndex]; return <Link href={"/projects/" + p.slug} key={pipe.x}>{p.emoji} {p.title} ↗</Link>; })}</div></section>
    <div className="game-footnote"><span>BUILT FROM SCRATCH WITH CANVAS + REACT</span><Link href="/world">Prefer to explore the map? ↗</Link></div>
  </div>;
}
