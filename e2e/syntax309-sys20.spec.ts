import { test, expect } from "@playwright/test";
for (const mode of ["RAD", "GRAD"] as const) {
 test("SY-S-20 sen(30°) exact half in " + mode, async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  if (mode === "GRAD") {
   await page.getByRole("button", { name: "Modo de ángulo: RAD. Abrir ajustes.", exact: true }).click();
   await page.getByRole("switch").click();
   await page.getByRole("button", { name: "Modo de ángulo: GRAD. Abrir ajustes.", exact: true }).click();
  }
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node => {
   (node as HTMLElement & { value: string }).value = "sen(30°)";
  });
  await input.dispatchEvent("input", { bubbles: true });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  console.log("SY-S-20", mode, {
   input: await input.evaluate(node => (node as HTMLElement & { value: string }).value),
   reentry: await result.getAttribute("data-result-reentry-latex")
  });
  await expect(result).toHaveAttribute("data-result-reentry-latex", /\\frac\{1\}\{2\}/);
  await result.getByRole("button", { name: "frac", exact: true }).click();
  const field = result.locator("math-field[read-only]").first();
  await expect(field).toBeVisible();
  await expect.poll(() => field.evaluate(node => (node as HTMLElement & { value: string }).value))
   .toBe(String.raw`\frac{1}{2}`);
 });
}
