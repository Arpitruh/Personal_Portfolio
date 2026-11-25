import {test,expect} from "@playwright/test";
const sizes=[{width:320,height:568},{width:360,height:640},{width:390,height:844},{width:430,height:932},{width:768,height:1024},{width:820,height:1180},{width:1024,height:768},{width:1366,height:768},{width:1920,height:1080},{width:2560,height:1440},{width:844,height:390}];
const routes=["/","/projects","/projects/cacheloom","/about","/skills","/life","/contact","/recruiter","/world","/room","/play","/now","/achievements","/assistant"];
for(const size of sizes){
 test("responsive layout "+size.width+"x"+size.height,async({page},info)=>{
  test.skip(info.project.name!=="desktop-chromium","Viewport matrix runs once per size.");
  test.setTimeout(120000);
  await page.setViewportSize(size);
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const route of routes){
   await page.goto(route);
   await expect(page.locator("#main")).toBeVisible();
   const metrics=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,overflow:Array.from(document.querySelectorAll("main *")).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&!e.closest(".showcase-track")}).slice(0,8).map(e=>e.className?.toString().slice(0,100))}));
   expect(metrics.scroll,route+" "+JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.width+2);
  }
  await page.goto("/");
  const menu=page.getByRole("button",{name:"Open menu"});
  if(await menu.isVisible()){
   await menu.click();
   const nav=page.getByRole("navigation",{name:"Main navigation"});
   await expect(nav.getByRole("link",{name:"Resume"})).toBeVisible();
   await nav.getByRole("link",{name:"Projects"}).click();
   await expect(page).toHaveURL(/#projects$/);
  }
  const showcase=page.getByRole("region",{name:"Featured project showcase"});
  await showcase.scrollIntoViewIfNeeded();
  const next=showcase.getByRole("button",{name:"Next project"});
  if(await next.isEnabled()){
   await next.click();
   await expect.poll(()=>showcase.locator(".showcase-track").evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  }
 });
}
