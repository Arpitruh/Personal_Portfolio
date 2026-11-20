export type LevelTheme = "meadow" | "sunset" | "midnight";
export type GameLevel = {
  id: string; title: string; subtitle: string; theme: LevelTheme; width: number;
  platforms: { x: number; y: number; w: number; h: number }[];
  coins: { x: number; y: number }[];
  enemies: number[];
  pipes: { x: number; projectIndex: number }[];
  checkpoints: number[];
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
    checkpoints:[1450,2900]
  },
  {
    id:"sunset", title:"Sunset Circuit", subtitle:"Follow the product trail", theme:"sunset", width:4500,
    platforms:[{x:300,y:244,w:135,h:22},{x:720,y:186,w:150,h:22},{x:1210,y:215,w:130,h:22},{x:1880,y:228,w:130,h:22},{x:2350,y:181,w:150,h:22},{x:3110,y:215,w:155,h:22},{x:3690,y:178,w:135,h:22}],
    coins:[300,370,750,800,860,1090,1300,1380,1580,1770,1930,2040,2260,2380,2470,2720,3020,3160,3230,3400,3720,3780,3890,4120].map((x,i)=>({x,y:i%4===0?155:i%3===0?200:241})),
    enemies:[470,1020,1440,2110,2660,3340,3970],
    pipes:[{x:1000,projectIndex:4},{x:1830,projectIndex:5},{x:2800,projectIndex:6},{x:3620,projectIndex:7}],
    checkpoints:[1600,3170]
  },
  {
    id:"midnight", title:"Midnight Systems", subtitle:"Explore the hidden infrastructure", theme:"midnight", width:4700,
    platforms:[{x:430,y:210,w:145,h:22},{x:890,y:170,w:155,h:22},{x:1420,y:225,w:145,h:22},{x:1950,y:175,w:145,h:22},{x:2530,y:225,w:145,h:22},{x:3150,y:181,w:150,h:22},{x:3770,y:212,w:150,h:22},{x:4200,y:168,w:145,h:22}],
    coins:[330,480,555,910,975,1080,1310,1470,1540,1740,1980,2040,2250,2440,2580,2660,2890,3150,3210,3300,3540,3800,3860,4060,4230,4320].map((x,i)=>({x,y:i%4===0?145:i%3===0?182:244})),
    enemies:[660,1190,1690,2290,2780,3490,3980,4340],
    pipes:[{x:1090,projectIndex:8},{x:2110,projectIndex:9},{x:3330,projectIndex:0},{x:4090,projectIndex:4}],
    checkpoints:[1550,3170]
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
