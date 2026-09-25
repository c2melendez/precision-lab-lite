import { expect, test } from "@playwright/test";

test("M29: geometría heredada de Flotante no reactiva un layout retirado", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "floating");
    localStorage.setItem(
      "precision-lab-floating-layout",
      JSON.stringify({
        keyboardWindow: { x: 5000, y: 5000, width: 1400, height: 1000 },
        graphWindow: { x: -500, y: 5000, width: 1200, height: 900 },
      }),
    );
  });

  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");
  await expect(page.getByRole("dialog", { name: "Gráfica" })).toHaveCount(0);

  await page.reload();
  await expect(page.locator("math-field").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode"))).toBe("fused");
});
