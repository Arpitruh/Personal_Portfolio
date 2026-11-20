import { projects, skills } from "./portfolio.ts";
export const skillFamilies=skills.map(group=>({
  group:group.group,
  skills:group.items.map(name=>({
    name, projects:projects.filter(p=>p.stack.some(tool=>tool.toLowerCase()===name.toLowerCase()||tool.toLowerCase().includes(name.toLowerCase())||name.toLowerCase().includes(tool.toLowerCase()))).map(p=>({slug:p.slug,title:p.title}))
  }))
}));
export function projectSkillConnections(skill:string):string[] {
  const name=skill.toLowerCase();
  return projects.filter(p=>p.stack.some(s=>s.toLowerCase()===name||s.toLowerCase().includes(name)||name.includes(s.toLowerCase()))).map(p=>p.slug);
}
