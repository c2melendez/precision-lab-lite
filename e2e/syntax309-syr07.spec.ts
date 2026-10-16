import { test, expect } from "@playwright/test";
test("SY-R-07 official numeric value and native result reentry", async ({ page }) => {
 await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
 await page.goto("./");
 const input = page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const result = page.locator("[data-result-request-id]").first();
 let source = "1.5\\times10^{-7}";
 let previous = "";
 for (let pass = 0; pass < 2; pass++) {
  await input.evaluate((node, latex) => { (node as HTMLElement & { value: string }).value = latex; }, source);
  await input.dispatchEvent("input", { bubbles: true });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  await expect(result).toBeVisible();
  console.log("SY-R-07 native source", await input.evaluate(node => (node as HTMLElement & { value: string }).value));
  if (previous) await expect(result).not.toHaveAttribute("data-result-request-id", previous);
  await result.getByRole("button", { name: "dec", exact: true }).click();
  await expect.poll(async () => {
   const text = await result.locator(".a11y-scale-result-3xl").first().innerText();
   const value = Number(text.trim().replace(/(?:…|\.\.\.)$/, ""));
   return Number.isFinite(value) ? Math.abs(value - 0.00000015) : Infinity;
  }).toBeLessThanOrEqual(1e-9 * Math.abs(0.00000015));
  source = (await result.getAttribute("data-result-reentry-latex")) ?? "";
  expect(source).not.toBe("");
  previous = (await result.getAttribute("data-result-request-id")) ?? "";
 }
});
