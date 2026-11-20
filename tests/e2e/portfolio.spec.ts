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
