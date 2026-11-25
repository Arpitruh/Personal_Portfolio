import { test, expect } from "@playwright/test";

test("scroll journey has all eight chapters and direct navigation", async ({ page, isMobile }) => {
  await page.goto("/");
  const sections = await page.locator(".scroll-portfolio > section").evaluateAll(nodes => nodes.map(node => node.id));
  expect(sections).toEqual(["top","about","experience","projects","skills","life","explore","contact"]);
  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects h2")).toBeInViewport();
  if (isMobile) await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  else await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current","location");
  await page.locator("#explore").scrollIntoViewIfNeeded();
  await expect(page.locator("#explore").getByRole("link", { name: /Arcade/ })).toBeVisible();
});

test("reduced motion preserves all content and no horizontal overflow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".journey-pending")).toHaveCount(0);
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 2);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact h2")).toBeVisible();
});
