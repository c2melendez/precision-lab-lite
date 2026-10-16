import { test, expect } from "@playwright/test";

test("SY-S-14 exp(0) returns exact 1 through MathLive UI", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node => {
    (node as HTMLElement & { value: string }).value = "exp(0)";
    node.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(async () =>
    result.locator("math-field[read-only]").first().evaluate(node => (node as HTMLElement & { value: string }).value)
  ).toBe("1");
});
