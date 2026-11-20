import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages=["/","/projects","/about","/contact","/recruiter","/room","/skills","/achievements","/assistant"];
for(const route of pages){
  test("accessible landmarks and automated WCAG checks: "+route,async ({page})=>{
    await page.goto(route);
    await expect(page.locator("#main")).toHaveCount(1);
    const scan=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
    const failures=scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,6).map(n=>({target:n.target,summary:n.failureSummary,checks:n.any.map(c=>c.data)}))}));
    if(failures.length) console.log("AXE_FAILURES "+route+" "+JSON.stringify(failures));
    expect(failures).toEqual([]);
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
  const failures=scan.violations.map(v=>({id:v.id,nodes:v.nodes.slice(0,6).map(n=>({target:n.target,summary:n.failureSummary,checks:n.any.map(c=>c.data)}))}));
  if(failures.length) console.log("AXE_NIGHT_FAILURES "+JSON.stringify(failures));
  expect(failures).toEqual([]);
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

test("capture lab layout shifts for the homepage",async ({page,isMobile})=>{
  if(!isMobile)await page.setViewportSize({width:1350,height:940});
  await page.addInitScript(()=>{
    (window as typeof window & {__layoutShifts?:unknown[]}).__layoutShifts=[];
    new PerformanceObserver(list=>{
      for(const entry of list.getEntries()){
        const shift=entry as PerformanceEntry & {value:number;hadRecentInput:boolean;sources?:{node?:Element;previousRect?:DOMRectReadOnly;currentRect?:DOMRectReadOnly}[]};
        if(shift.hadRecentInput)continue;
        (window as typeof window & {__layoutShifts?:unknown[]}).__layoutShifts?.push({
          score:shift.value,
          sources:shift.sources?.map(s=>({
            tag:s.node?.tagName,
            selector:s.node?.className?.toString().slice(0,140),
            text:s.node?.textContent?.trim().slice(0,65),
            prev:s.previousRect && {x:s.previousRect.x,y:s.previousRect.y,w:s.previousRect.width,h:s.previousRect.height},
            next:s.currentRect && {x:s.currentRect.x,y:s.currentRect.y,w:s.currentRect.width,h:s.currentRect.height}
          }))
        });
      }
    }).observe({type:"layout-shift",buffered:true});
  });
  await page.goto("/");
  await page.waitForTimeout(2200);
  const shifts=await page.evaluate(()=>(window as typeof window & {__layoutShifts?:unknown[]}).__layoutShifts??[]);
  console.log("HOME_LAYOUT_SHIFTS "+JSON.stringify(shifts));
  const total=shifts.reduce((sum,entry)=>sum+((entry as {score:number}).score||0),0);
  expect(total,"Unexpected above-the-fold layout shifts").toBeLessThan(0.1);
});
