import { expect, test } from "@playwright/test";

test("M14: Lite conserva branding e icono propios y no adopta el nombre Plus", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Precision Lab Lite");
  await expect(page.locator("header")).toContainText("Precision Lab");
  await expect(page.locator("header")).toContainText("Lite");
  await expect(page.locator("body")).not.toContainText("Precision Lab Plus");

  const iconHref = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(iconHref).toBeTruthy();
  expect(iconHref).toContain("icons/precision-lab-lite.svg");
  const icon = await page.request.get(new URL(iconHref!, page.url()).toString());
  expect(icon.ok()).toBeTruthy();

  const brandImage = page.locator('header img[src*="precision-lab-lite.svg"]');
  await expect(brandImage).toBeVisible();
});
