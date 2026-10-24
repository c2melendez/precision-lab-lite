import { test, expect } from "@playwright/test";

test("SY-Q-10: real scientific UI solves strict absolute inequality", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node => {
    const field = node as HTMLElement & { value: string };
    field.value = String.raw`\lvert x\rvert<3`;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(async () => result.locator("math-field[read-only]").first()
    .evaluate(node => (node as HTMLElement & { value: string }).value))
    .toMatch(/x\\in\s*\(-3,3\)/);
});
