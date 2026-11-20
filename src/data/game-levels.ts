export type LevelTheme = "meadow" | "sunset" | "midnight" | "neon" | "frost";
export type GamePowerup = "shield" | "dash" | "heart";
export type GameDifficulty = "casual" | "normal" | "expert";
export const GAME_RECORDS_KEY = "arpit-portfolio-records-v1";
export const GAME_SETTINGS_KEY = "arpit-portfolio-difficulty-v1";
export type GameLevel = {
  id: string; title: string; subtitle: string; theme: LevelTheme; width: number;
  platforms: { x: number; y: number; w: number; h: number }[];
  coins: { x: number; y: number }[];
  enemies: number[];
  pipes: { x: number; projectIndex: number }[];
  checkpoints: number[];
  hazards?: { x:number; w:number }[];
  powerups?: { x:number; y:number; type:GamePowerup }[];
  secretStars?: { x:number; y:number }[];
  difficulty?: number;
};

// Fixed layouts are easy to test, deterministic across reloads and don't rely on a network.
const meadowCoins = [240,365,410,640,690,740,1100,1260,1320,1440,1870,2020,2090,2260,2650,2810,2880,3030,3450,3600,3670,3890];
export const gameLevels: GameLevel[] = [
  {
    id: "meadow", title: "Pixel Meadows", subtitle: "Discover the first quests", theme: "meadow", width: 4300,
    platforms: [{x:340,y:230,w:110,h:22},{x:620,y:192,w:140,h:22},{x:1240,y:215,w:130,h:22},{x:1990,y:195,w:150,h:22},{x:2790,y:225,w:150,h:22},{x:3600,y:205,w:130,h:22}],
    coins: meadowCoins.map((x,i) => ({x,y:i%3===0?180:i%3===1?160:245})),
    enemies:[560,1160,1530,2230,2970,3500],
    pipes:[{x:950,projectIndex:0},{x:1680,projectIndex:1},{x:2490,projectIndex:2},{x:3230,projectIndex:3}],
    checkpoints:[1450,2900],
    hazards:[{x:820,w:50},{x:2340,w:65},{x:3350,w:55}],
    powerups:[{x:780,y:260,type:"shield"},{x:2120,y:155,type:"heart"}],
    secretStars:[{x:720,y:150},{x:2840,y:195}], difficulty:1
  },
  {
    id:"sunset", title:"Sunset Circuit", subtitle:"Follow the product trail", theme:"sunset", width:4500,
    platforms:[{x:300,y:244,w:135,h:22},{x:720,y:186,w:150,h:22},{x:1210,y:215,w:130,h:22},{x:1880,y:228,w:130,h:22},{x:2350,y:181,w:150,h:22},{x:3110,y:215,w:155,h:22},{x:3690,y:178,w:135,h:22}],
    coins:[300,370,750,800,860,1090,1300,1380,1580,1770,1930,2040,2260,2380,2470,2720,3020,3160,3230,3400,3720,3780,3890,4120].map((x,i)=>({x,y:i%4===0?155:i%3===0?200:241})),
    enemies:[470,1020,1440,2110,2660,3340,3970],
    pipes:[{x:1000,projectIndex:4},{x:1830,projectIndex:5},{x:2800,projectIndex:6},{x:3620,projectIndex:7}],
    checkpoints:[1600,3170],
    hazards:[{x:550,w:60},{x:1700,w:70},{x:2960,w:65},{x:4000,w:55}],
    powerups:[{x:840,y:150,type:"dash"},{x:2660,y:250,type:"shield"},{x:3740,y:150,type:"heart"}],
    secretStars:[{x:800,y:140},{x:3200,y:170}], difficulty:2
  },
  {
    id:"midnight", title:"Midnight Systems", subtitle:"Explore the hidden infrastructure", theme:"midnight", width:4700,
    platforms:[{x:430,y:210,w:145,h:22},{x:890,y:170,w:155,h:22},{x:1420,y:225,w:145,h:22},{x:1950,y:175,w:145,h:22},{x:2530,y:225,w:145,h:22},{x:3150,y:181,w:150,h:22},{x:3770,y:212,w:150,h:22},{x:4200,y:168,w:145,h:22}],
    coins:[330,480,555,910,975,1080,1310,1470,1540,1740,1980,2040,2250,2440,2580,2660,2890,3150,3210,3300,3540,3800,3860,4060,4230,4320].map((x,i)=>({x,y:i%4===0?145:i%3===0?182:244})),
    enemies:[660,1190,1690,2290,2780,3490,3980,4340],
    pipes:[{x:1090,projectIndex:8},{x:2110,projectIndex:9},{x:3330,projectIndex:0},{x:4090,projectIndex:4}],
    checkpoints:[1550,3170],
    hazards:[{x:770,w:70},{x:1840,w:85},{x:3020,w:70},{x:4110,w:70}],
    powerups:[{x:930,y:145,type:"shield"},{x:2010,y:145,type:"dash"},{x:3430,y:250,type:"heart"}],
    secretStars:[{x:990,y:145},{x:4260,y:135}], difficulty:3
  },
  {
    id:"neon", title:"Neon Nexus", subtitle:"Race through the digital skyline", theme:"neon", width:4900,
    platforms:[{x:350,y:228,w:135,h:22},{x:800,y:183,w:150,h:22},{x:1410,y:217,w:130,h:22},{x:1980,y:185,w:160,h:22},{x:2620,y:224,w:140,h:22},{x:3290,y:181,w:150,h:22},{x:3990,y:200,w:160,h:22}],
    coins:[260,350,440,620,830,890,1080,1250,1440,1520,1780,2030,2090,2320,2630,2700,2900,3110,3330,3400,3600,3840,4040,4120,4350,4570].map((x,i)=>({x,y:i%4===0?153:i%3===0?196:245})),
    enemies:[610,1140,1610,2280,2740,3590,4040,4470],
    pipes:[{x:1050,projectIndex:3},{x:1920,projectIndex:6},{x:3010,projectIndex:8},{x:3930,projectIndex:1}],
    checkpoints:[1680,3300],
    hazards:[{x:720,w:60},{x:1500,w:70},{x:2430,w:75},{x:3490,w:80},{x:4310,w:70}],
    powerups:[{x:910,y:145,type:"dash"},{x:2050,y:150,type:"shield"},{x:3360,y:150,type:"heart"}],
    secretStars:[{x:880,y:138},{x:4050,y:164}],difficulty:4
  },
  {
    id:"frost", title:"Frostbyte Summit", subtitle:"Reach the final project summit", theme:"frost", width:5100,
    platforms:[{x:400,y:222,w:145,h:22},{x:890,y:175,w:145,h:22},{x:1490,y:208,w:145,h:22},{x:2150,y:174,w:155,h:22},{x:2800,y:221,w:160,h:22},{x:3470,y:168,w:145,h:22},{x:4150,y:205,w:160,h:22},{x:4600,y:165,w:155,h:22}],
    coins:[310,450,515,690,930,995,1150,1330,1540,1610,1810,2010,2180,2240,2480,2690,2860,2930,3160,3370,3510,3590,3810,4080,4220,4300,4590,4690].map((x,i)=>({x,y:i%4===0?146:i%3===0?190:242})),
    enemies:[680,1280,1760,2460,3090,3760,4330,4750],
    pipes:[{x:1060,projectIndex:9},{x:2060,projectIndex:5},{x:3170,projectIndex:7},{x:4200,projectIndex:2}],
    checkpoints:[1720,3430],
    hazards:[{x:780,w:65},{x:1660,w:75},{x:2580,w:80},{x:3620,w:80},{x:4460,w:70}],
    powerups:[{x:950,y:145,type:"shield"},{x:2260,y:150,type:"dash"},{x:3550,y:145,type:"heart"}],
    secretStars:[{x:960,y:130},{x:4640,y:130}],difficulty:5
  }
];
export type GameCheckpointSave = {
  levelId: string; checkpointIndex: number; score: number; lives: number;
  collected: number[]; defeated: number[];
};
export const GAME_SAVE_KEY = "arpit-portfolio-checkpoints-v3";
export const GAME_CLEAR_KEY = "arpit-portfolio-cleared-v3";

export function validateGameSave(value: unknown, level: GameLevel): GameCheckpointSave | null {
  if (!value || typeof value !== "object") return null;
  const save = value as Partial<GameCheckpointSave>;
  if (save.levelId !== level.id || !Number.isInteger(save.checkpointIndex) || (save.checkpointIndex ?? -1) < 0 || (save.checkpointIndex ?? -1) >= level.checkpoints.length) return null;
  if (!Number.isInteger(save.score) || (save.score ?? -1) < 0 || (save.score ?? Infinity) > 10000000) return null;
  if (!Number.isInteger(save.lives) || (save.lives ?? 0) < 1 || (save.lives ?? Infinity) > 3) return null;
  if (!Array.isArray(save.collected) || !Array.isArray(save.defeated)) return null;
  if (!save.collected.every((n) => Number.isInteger(n) && n >= 0 && n < level.coins.length)) return null;
  if (!save.defeated.every((n) => Number.isInteger(n) && n >= 0 && n < level.enemies.length)) return null;
  return save as GameCheckpointSave;
}

// Game records never go to a server. Validate localStorage before displaying scores.
export type LevelRecord={score:number;coins:number;stars:number;seconds:number;difficulty:GameDifficulty};
export function validateLevelRecord(value:unknown):LevelRecord|null {
 if(!value||typeof value!=="object")return null;
 const r=value as Partial<LevelRecord>;
 if(!Number.isInteger(r.score)||r.score!<0||r.score!>10000000)return null;
 if(!Number.isInteger(r.coins)||r.coins!<0||r.coins!>100)return null;
 if(!Number.isInteger(r.stars)||r.stars!<0||r.stars!>3)return null;
 if(typeof r.seconds!=="number"||!Number.isFinite(r.seconds)||r.seconds!<0||r.seconds!>36000)return null;
 if(r.difficulty!=="casual"&&r.difficulty!=="normal"&&r.difficulty!=="expert")return null;
 return r as LevelRecord;
}
export function rankMission(coins:number,total:number,stars:number,hearts:number) {
 const fraction=total?coins/total:0;
 return {collector:fraction>=.75,explorer:stars>=1,survivor:hearts>=2,perfect:fraction>=.95&&stars>=2&&hearts>=2};
}
export function difficultySettings(mode:GameDifficulty) {
 return mode==="casual"?{lives:5,damageCooldown:145,enemySpeed:.65,bonus:1}:
 mode==="expert"?{lives:2,damageCooldown:65,enemySpeed:1.55,bonus:1.5}:
 {lives:3,damageCooldown:90,enemySpeed:1,bonus:1.2};
}
