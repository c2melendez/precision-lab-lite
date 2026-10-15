import { test, expect } from "@playwright/test";

test("SY-Q-08: real scientific UI routes bounded chained inequality to worker", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node) => {
    const field = node as HTMLElement & { value: string };
    field.value = String.raw`1<x\le3`;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(() => result.getAttribute("data-result-reentry-latex")).toMatch(/1|3/);
  await expect.poll(async () => {
    const elements = result.locator("math-field[read-only]");
    return elements.count() ? elements.first().evaluate(el => (el as HTMLElement & { value: string }).value) : "";
  }).toMatch(/1.*x.*3/);
});

test("SY-Q-08 negative control: incompatible chained bounds are not a valid interval", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node => {
    const field = node as HTMLElement & { value: string };
    field.value = String.raw`3<x<1`;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(async () => {
    const el = result.locator("math-field[read-only]").first();
    return el.evaluate(node => (node as HTMLElement & { value: string }).value);
  }).toMatch(/No tiene solución real/i);
});
