import type { PortfolioProject } from "./portfolio.ts";

// A deliberately high-level model based only on published project metadata.
// Do not imply this is a diagram of the private deployment or infrastructure.
export function architectureOverview(p:PortfolioProject):{step:string; detail:string}[] {
  const stack=p.stack;
  const ui=stack.filter(x=>/react|next|html|css|javascript|web ui|frontend|chakra|tailwind/i.test(x));
  const server=stack.filter(x=>/express|node|rest api|better auth|jwt|bullmq|websocket/i.test(x));
  const data=stack.filter(x=>/postgres|mysql|prisma|google sheets/i.test(x));
  const other=stack.filter(x=>!ui.includes(x)&&!server.includes(x)&&!data.includes(x));
  return [
    {step:"Experience",detail:ui.join(" · ")||"User-facing interface / client"},
    {step:"Logic & integrations",detail:server.join(" · ")||"Application behavior, forms & services"},
    {step:"Data & tools",detail:[...data,...other].join(" · ")||"No documented persistence layer in this summary"}
  ];
}
