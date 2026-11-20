import { test, expect } from "@playwright/test";

test("homepage renders real links and a working command palette", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /hi, i.m arpit/i })).toBeVisible();
  const quick = page.getByRole("button", { name: "Open quick navigation" });
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
 expect(duration).toBe("0s");
});
