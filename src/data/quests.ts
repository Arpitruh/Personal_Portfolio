export const QUEST_KEY="portfolio-achievements-v1";
export type QuestId = "room"|"recruiter"|"projects"|"case-study"|"skills"|"game"|"assistant"|"world"|"contact";
export const questDefinitions: {id:QuestId; title:string; description:string; emoji:string; href:string}[] = [
  {id:"room",title:"Curious Visitor",description:"Explore the interactive developer room",emoji:"🖥️",href:"/room"},
  {id:"recruiter",title:"Career Detective",description:"Read the recruiter profile",emoji:"📄",href:"/recruiter"},
  {id:"projects",title:"Quest Collector",description:"Open the projects catalog",emoji:"🗂️",href:"/projects"},
  {id:"case-study",title:"Behind the Build",description:"Read an individual project case study",emoji:"🔎",href:"/projects"},
  {id:"skills",title:"Skill Explorer",description:"Explore how skills connect to projects",emoji:"🧩",href:"/skills"},
  {id:"game",title:"Player One",description:"Visit the playable platformer",emoji:"🎮",href:"/play"},
  {id:"assistant",title:"Ask Away",description:"Try the local portfolio assistant",emoji:"💬",href:"/assistant"},
  {id:"world",title:"Map Maker",description:"Open the interactive world map",emoji:"🗺️",href:"/world"},
  {id:"contact",title:"Next Conversation",description:"Open the contact page",emoji:"✉️",href:"/contact"}
];
const pathQuest:Record<string,QuestId>={"/room":"room","/recruiter":"recruiter","/projects":"projects","/skills":"skills","/play":"game","/assistant":"assistant","/world":"world","/contact":"contact"};
export function questForPath(path:string):QuestId|null {if(path.startsWith("/projects/"))return "case-study";return pathQuest[path]??null;}
export function safeQuests(value:unknown):QuestId[] {
  if(!Array.isArray(value))return [];
  const known=new Set<string>(questDefinitions.map(q=>q.id));
  return [...new Set(value.filter((x):x is QuestId=>typeof x==="string"&&known.has(x)))];
}
