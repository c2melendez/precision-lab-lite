import { expect, test } from "@playwright/test";

test("M14: Lite conserva branding e icono propios y no adopta el nombre Plus", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Precision Lab Lite");
  await expect(page.locator("header")).toContainText("Precision Lab");
  await expect(page.locator("header")).toContainText("Lite");
  await expect(page.locator("body")).not.toContainText("Precision Lab Plus");

  const touchHref = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect(touchHref).toBeTruthy();
  expect(touchHref).toContain("icons/icon-192.png");
  const icon = await page.request.get(new URL(touchHref!, page.url()).toString());
  expect(icon.ok()).toBeTruthy();
});
