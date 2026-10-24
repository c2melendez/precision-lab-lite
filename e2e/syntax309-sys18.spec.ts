import { test, expect } from "@playwright/test";

test("SY-S-18 sqrt(16) returns exact 4 through MathLive UI", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node => {
    (node as HTMLElement & { value: string }).value = "sqrt(16)";
    node.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await result.getByRole("button", { name: "sqrt", exact: true }).click();
  await expect.poll(async () =>
    result.locator("math-field[read-only]").first().evaluate(node => (node as HTMLElement & { value: string }).value)
  ).toBe("4");
});
