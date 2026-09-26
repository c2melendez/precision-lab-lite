import { expect, test } from "@playwright/test";

test("M37: una preferencia Flotante heredada migra a Default y permanece estable al cambiar viewport", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "floating");
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");
  await expect(page.getByRole("dialog", { name: "Gráfica" })).toHaveCount(0);

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(page.locator("math-field").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator("math-field").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");
});
