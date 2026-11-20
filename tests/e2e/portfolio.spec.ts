import { test, expect } from "@playwright/test";

test("homepage renders real links and a working command palette", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /hi, i.m arpit/i })).toBeVisible();
  const quick = page.getByRole("button", { name: /Open quick navigation/ });
  await quick.click();
  const dialog = page.getByRole("dialog", { name: "Quick navigation" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox", { name: "Search pages" }).fill("projects");
  await expect(dialog.getByRole("link", { name: /projects/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(quick).toBeFocused();
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Projects" })).toBeVisible();
  }
});

test("game worlds and all direct portals work without canvas gameplay", async ({ page }) => {
  await page.goto("/play");
  const selector = page.getByRole("group", { name: "Choose a game world" });
  for (const title of ["Pixel Meadows", "Sunset Circuit", "Midnight Systems"]) {
    await selector.getByRole("button", { name: new RegExp(title) }).click();
    await expect(page.getByRole("heading", { name: /skip the platformer/i })).toBeVisible();
    await expect(page.locator(".game-accessible-projects a")).toHaveCount(4);
  }
  await page.getByRole("button", { name: /Pixel Meadows/ }).click();
  await page.getByRole("button", { name: /Start game/ }).click();
  await expect(page.getByRole("button", { name: "Pause game II" })).toBeEnabled();
  await page.getByRole("button", { name: "Pause game II" }).click();
  await expect(page.getByRole("heading", { name: /Adventure on hold/ })).toBeVisible();
});

test("project case studies and SEO assets are generated", async ({ page, request }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: /Built with purpose/i })).toBeVisible();
  await page.goto("/projects/cacheloom");
  await expect(page.getByRole("heading", { name: /CacheLoom/i })).toBeVisible();
  const [robots, sitemap, image] = await Promise.all([
    request.get("/robots.txt"),request.get("/sitemap.xml"),request.get("/projects/gemini-clone.png")
  ]);
  expect(robots.ok()).toBeTruthy();
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/projects/cacheloom");
  expect(image.ok()).toBeTruthy();
});

test("theme preference persists and core pages have no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to night theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");

  for (const route of ["/", "/world", "/about", "/projects", "/contact"]) {
    await page.goto(route);
    // Compare the document to the viewport; a single overflowing panel should not break navigation.
    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      view: document.documentElement.clientWidth
    }));
    expect(width.scroll, "Horizontal overflow at " + route).toBeLessThanOrEqual(width.view + 2);
  }
});

test("touch controls work and do not leave movement stuck", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch smoke test runs in the mobile browser project");
  await page.goto("/play");
  await page.getByRole("button", { name: /Start game/ }).click();
  const right = page.getByRole("button", { name: "Move right" });
  const jump = page.getByRole("button", { name: "Jump" });
  await right.tap();
  await jump.tap();
  await expect(page.getByRole("button", { name: "Pause game II" })).toBeEnabled();
  await page.getByRole("button", { name: "Pause game II" }).click();
  await expect(page.getByRole("heading", { name: /Adventure on hold/ })).toBeVisible();
});

test("canonical metadata and content discovery are valid", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\//);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /frontend engineer/i);
  await page.goto("/projects/cacheloom");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/projects\/cacheloom$/);
});

test("Phase 5 bookmarks survive reload and comparison URLs restore", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Save CacheLoom" }).click();
  await expect(page.getByRole("button", { name: "Unsave CacheLoom" })).toHaveAttribute("aria-pressed","true");
  await page.reload();
  await expect(page.getByRole("button", { name: "Unsave CacheLoom" })).toBeVisible();
  await page.getByRole("button", { name: /Saved quests/ }).click();
  await expect(page.locator(".discovery-card")).toHaveCount(1);
  await page.getByRole("button", { name: /Saved quests/ }).click();
  await page.getByRole("button", { name: "Compare CacheLoom" }).click();
  await page.getByRole("button", { name: "Compare LeadLoop CRM" }).click();
  await expect(page.getByRole("region", { name: "Project comparison" }).locator(".compare-column")).toHaveCount(2);
  await expect(page).toHaveURL(/compare=cacheloom%2Cleadloop-crm/);
  await page.reload();
  await expect(page.locator(".compare-column")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear selection" }).click();
  await expect(page.locator(".compare-column")).toHaveCount(0);
});

test("Phase 5 ignores unknown shared slugs", async ({ page }) => {
  await page.goto("/projects?compare=cacheloom,invalid,leadloop-crm");
  await expect(page.locator(".compare-column")).toHaveCount(2);
  await expect(page).not.toHaveURL(/invalid/);
});

test("new experience routes respect mobile viewport, reduced motion, and print styles",async ({page})=>{
 for(const route of ["/room","/recruiter","/skills","/achievements","/assistant"]){
  await page.goto(route);
  const widths=await page.evaluate(()=>({view:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  expect(widths.scroll,route+" must not overflow the viewport").toBeLessThanOrEqual(widths.view+2);
 }
 await page.emulateMedia({media:"print"});
 await page.goto("/recruiter");
 await expect(page.locator(".resume-sheet")).toBeVisible();
 const headerDisplay=await page.locator(".site-header").evaluate(e=>getComputedStyle(e).display);
 expect(headerDisplay).toBe("none");
 await page.emulateMedia({media:"screen",reducedMotion:"reduce"});
 await page.goto("/room");
 const duration=await page.locator(".room-object").first().evaluate(e=>getComputedStyle(e).transitionDuration);
 expect(Number.parseFloat(duration)).toBeLessThan(0.001);
});

test("Phase 14 personal-life page and social links are accessible",async ({page})=>{
 await page.goto("/life");
 await expect(page.getByRole("heading",{name:/More than just code/i})).toBeVisible();
 await expect(page.getByRole("heading",{name:/Things I enjoy/i})).toBeVisible();
 await expect(page.locator(".life-social-grid a")).toHaveCount(1);
 await expect(page.locator(".life-social-grid")).toContainText("GitHub");
 await expect(page.getByText(/No filler hobbies or placeholder photographs/i)).toBeVisible();
 await page.goto("/about");
 await expect(page.getByRole("link",{name:/Beyond the Code/})).toBeVisible();
});
test("Phase 14 recruiter offers print until a verified PDF has been uploaded",async ({page})=>{
 await page.goto("/recruiter");
 await expect(page.getByRole("button",{name:/Print \/ Save as PDF/})).toBeVisible();
 await expect(page.getByRole("link",{name:/Download latest resume/})).toHaveCount(0);
});
test("Phase 14 life route appears in navigation and sitemap",async ({page,request})=>{
 await page.goto("/");
 const sitemap=await (await request.get("/sitemap.xml")).text();
 expect(sitemap).toContain("/life");
 await page.goto("/life");
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",/\/life$/);
});

test("Phase 15 uses accessible pixel fallback until approved media is uploaded",async ({page})=>{
 await page.goto("/life");
 await expect(page.locator(".personal-portrait-life .personal-portrait-placeholder")).toBeVisible();
 await expect(page.locator(".personal-gallery-empty")).toBeVisible();
 await expect(page.locator(".personal-gallery-card")).toHaveCount(0);
 await page.goto("/about");
 await expect(page.locator(".personal-portrait-about .personal-portrait-placeholder")).toBeVisible();
 await page.goto("/");
 await expect(page.locator(".hero-avatar")).toBeVisible();
});

test("character poses render when approved CMS files exist, with fallback when absent",async ({page})=>{
 const {readFileSync}=await import("node:fs");
 const config=JSON.parse(readFileSync("content/character-pack.json","utf8"));
 for(const [route,pose] of [["/","standing"],["/projects","sitting"],["/skills","coding"],["/life","casual"]] as const){
   await page.goto(route);
   const published=Boolean(config[pose]?.src&&config[pose]?.alt?.trim());
   await expect(page.locator(".character-pose")).toHaveCount(published?1:0);
   if(published){
     await expect(page.locator(".character-pose img")).toBeVisible();
     await expect(page.locator(".character-pose img")).toHaveAttribute("alt",config[pose].alt);
   }
   await expect(page.locator("#main")).toHaveCount(1);
 }
});

test("expanded arcade campaign supports difficulty, five worlds, quests and records",async({page})=>{
 await page.goto("/play");
 const chooser=page.getByRole("group",{name:"Choose a game world"});
 await expect(chooser.getByRole("button")).toHaveCount(5);
 await chooser.getByRole("button",{name:/Neon Nexus/}).click();
 await expect(page.getByText(/No completed run yet/)).toBeVisible();
 await expect(page.getByRole("region",{name:"All project entrances in this world"}).locator("a")).toHaveCount(4);
 const select=page.getByLabel("DIFFICULTY");
 await select.selectOption("expert");
 await expect(select).toHaveValue("expert");
 await page.getByRole("button",{name:/Start game/}).click();
 await expect(select).toBeDisabled();
 await expect(page.getByRole("button",{name:"Pause game II"})).toBeEnabled();
 await page.getByRole("button",{name:"Pause game II"}).click();
 await expect(page.getByRole("heading",{name:"Adventure on hold"})).toBeVisible();
});

test("dash touch control and guardian finish gate are explained to players",async({page})=>{
 await page.goto("/play");
 await page.getByRole("group",{name:"Choose a game world"}).getByRole("button",{name:/Frostbyte Summit/}).click();
 await expect(page.getByText(/No completed run yet/)).toBeVisible();
 await page.locator("summary").filter({hasText:/HOW TO PLAY/}).click();
 await expect(page.getByText(/guardians in Neon Nexus and Frostbyte Summit/)).toBeVisible();
 await page.getByRole("button",{name:/Start game/}).click();
 await expect(page.getByRole("button",{name:"Dash"})).toBeVisible();
 await page.getByRole("button",{name:"Dash"}).click();
 await expect(page.getByRole("button",{name:"Pause game II"})).toBeEnabled();
});

test("arcade keyboard movement advances level progress and dash enters cooldown",async({page,isMobile})=>{
 test.skip(isMobile,"Keyboard movement physics is validated with desktop Chromium; mobile uses the touch smoke test.");
 await page.goto("/play");
 await page.getByRole("button",{name:/Start game/}).click();
 await page.locator(".game-screen canvas").click();
 await page.keyboard.down("ArrowRight");
 await expect.poll(async()=>Number(await page.getByRole("progressbar",{name:"Distance to level finish"}).getAttribute("aria-valuenow")),{timeout:7000}).toBeGreaterThan(5);
 await page.keyboard.up("ArrowRight");
 await page.keyboard.press("Shift");
 await expect(page.locator(".game-hud")).toContainText("COOLDOWN");
});

test("public contact details open mail and dial actions without a paid backend",async ({page})=>{
 await page.goto("/contact");
 await expect(page.getByRole("link",{name:/Email arpitruh112@gmail.com/})).toHaveAttribute("href","mailto:arpitruh112@gmail.com");
 await expect(page.getByRole("link",{name:/Phone \+91 8707884517/})).toHaveAttribute("href","tel:+918707884517");
 await expect(page.getByRole("button",{name:/Copy email address/})).toBeVisible();
 await expect(page.getByRole("button",{name:/Open email draft/})).toBeVisible();
 await expect(page.getByText(/does not submit or store your message/)).toBeVisible();
});
