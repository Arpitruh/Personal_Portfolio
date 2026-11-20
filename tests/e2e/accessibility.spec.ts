import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages=["/","/projects","/about","/contact","/recruiter","/room","/skills","/achievements","/assistant"];
for(const route of pages){
  test("accessible landmarks and automated WCAG checks: "+route,async ({page})=>{
    await page.goto(route);
    await expect(page.locator("#main")).toHaveCount(1);
    const scan=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
    expect(scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,3).map(n=>n.target)}))).toEqual([]);
  });
}
test("primary navigation is keyboard reachable at laptop viewport",async ({page})=>{
  await page.setViewportSize({width:1100,height:820});
  await page.goto("/");
  await page.getByRole("button",{name:"Open menu"}).click();
  const nav=page.getByRole("navigation",{name:"Main navigation"});
  await expect(nav.getByRole("link",{name:"Resume"})).toBeVisible();
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:document.documentElement.clientWidth}));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.view+2);
});

test("night theme maintains automated contrast and accessible names",async ({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Switch to night theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","night");
  const scan=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.slice(0,4).map(n=>n.target)}))).toEqual([]);
});
test("all internal navigation links resolve to real pages",async ({page,request})=>{
  const targets=new Set<string>();
  for(const route of ["/","/projects","/about","/contact","/room","/recruiter","/skills","/achievements","/assistant","/world","/play"]){
    await page.goto(route);
    const paths=await page.locator('a[href^="/"]').evaluateAll(els=>els.map(el=>(el as HTMLAnchorElement).pathname));
    paths.forEach(p=>targets.add(p));
  }
  for(const path of targets){
    const result=await request.get(path,{failOnStatusCode:false});
    expect(result.ok(),"Broken internal link: "+path).toBeTruthy();
  }
});
