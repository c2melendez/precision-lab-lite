import { test, expect } from "@playwright/test";
test("SY-R-09 native antiderivative reentry and differentiation", async ({ page }) => {
 await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
 await page.goto("./");
 const input = page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const result = page.locator("[data-result-request-id]").first();
 let previous = "";
 async function calculate(source: string) {
  await input.evaluate((node, latex) => { (node as HTMLElement & { value: string }).value = latex; }, source);
  await input.dispatchEvent("input", { bubbles: true });
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  await expect(result).toBeVisible();
  if (previous) await expect(result).not.toHaveAttribute("data-result-request-id", previous);
  previous = (await result.getAttribute("data-result-request-id")) ?? "";
  expect(previous).not.toBe("");
  const display = result.locator("math-field[read-only]").first();
  await expect(display).toBeVisible();
  return display;
 }
 const original = String.raw`\frac{x^{3}}{3}+C`;
 const first = await calculate(original);
 await expect.poll(() => first.evaluate(node => (node as HTMLElement & {value:string}).value)).toMatch(/C/);
 const reentry = (await result.getAttribute("data-result-reentry-latex")) ?? "";
 expect(reentry).toMatch(/C/);
 const differentiated = await calculate(String.raw`\frac{d}{dx}\left(` + reentry + String.raw`\right)`);
 await expect.poll(() => differentiated.evaluate(node => (node as HTMLElement & {value:string}).value))
  .toMatch(/^x\^(?:\{2\}|2)$/);
 const derivativeLatex = (await result.getAttribute("data-result-reentry-latex")) ?? "";
 const restored = await calculate(derivativeLatex);
 await expect.poll(() => restored.evaluate(node => (node as HTMLElement & {value:string}).value))
  .toMatch(/^x\^(?:\{2\}|2)$/);
 console.log("SY-R-09 native chain", {original, reentry, derivativeLatex, finalRequest:previous});
});
