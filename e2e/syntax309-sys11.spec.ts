import { test, expect } from "@playwright/test";

test("SY-S-11 Spanish inline substitution renders exact half in native UI", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const field = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(field).toBeVisible();
  await field.evaluate((node, latex) => {
    (node as HTMLElement & { value: string }).value = latex;
    node.dispatchEvent(new Event("input", { bubbles: true }));
  }, String.raw`sen(x)\ \text{con}\ x=\frac{\pi}{6}`);
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(async () =>
    result.locator("math-field[read-only]").first().evaluate(node => (node as HTMLElement & { value: string }).value)
  ).toBe(String.raw`\frac{1}{2}`);
});
