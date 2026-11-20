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
  await expect(nav.getByRole("link",{name:"Recruiter"})).toBeVisible();
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:document.documentElement.clientWidth}));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.view+2);
});
