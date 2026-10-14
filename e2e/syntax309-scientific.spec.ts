import { test, expect } from "@playwright/test";

test("SY-N-31: scientific UI and exact reentry across viewport sizes", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node) => {
    const field = node as HTMLElement & { value: string };
    field.value = String.raw`\frac{1}{3000000}`;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "Calcular", exact: true }).click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex", /frac|3000000/);
  const scientific = result.getByRole("button", { name: "scn", exact: true });
  await scientific.click();
  await expect(scientific).toHaveAttribute("aria-pressed", "true");
  const rendered = result.locator("math-field[read-only]").first();
  await expect.poll(() => rendered.evaluate((element) => (element as HTMLElement & { value: string }).value))
    .toBe(String.raw`3.333333333\times10^{-7}`);
  await result.getByRole("button", { name: "frac", exact: true }).click();
  await expect.poll(() => rendered.evaluate((element) => (element as HTMLElement & { value: string }).value))
    .toMatch(/frac|3000000/);
  await expect(result).toHaveAttribute("data-result-reentry-latex", /frac|3000000/);
});
