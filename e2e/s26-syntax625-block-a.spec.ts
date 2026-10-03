import { expect, test, type Page } from "@playwright/test";

type Case = { id: string; input: string; expected: RegExp };

const CASES: Case[] = [
  { id: "EN-FR-01", input: "\\frac{1}{2}", expected: /0\.5|\\frac\{1\}\{2\}/ },
  { id: "EN-FR-02", input: "\\dfrac{1}{2}", expected: /0\.5|\\frac\{1\}\{2\}/ },
  { id: "EN-FR-03", input: "\\tfrac{1}{2}", expected: /0\.5|\\frac\{1\}\{2\}/ },
  { id: "EN-FR-06", input: "1/2", expected: /0\.5|\\frac\{1\}\{2\}/ },
  { id: "EN-FR-10", input: "\\frac12", expected: /0\.5|\\frac\{1\}\{2\}/ },
  { id: "EN-FR-12", input: "\\frac{12}3", expected: /^4(?:\.0+)?$/ },
  { id: "EN-FR-14", input: "\\frac{\\frac{1}{2}}{3}", expected: /0\.166666|\\frac\{1\}\{6\}/ },
  { id: "EN-FR-15", input: "\\frac{1}{\\frac{1}{2}}", expected: /^2(?:\.0+)?$/ },
  { id: "EN-FR-21", input: "\\frac{2}{3}+\\frac{3}{4}", expected: /1\.41666|\\frac\{17\}\{12\}/ },
  { id: "EN-FR-22", input: "\\frac{1.5}{2}", expected: /0\.75/ },
  { id: "EN-FR-23", input: "\\frac{\\pi}{2}", expected: /1\.570796|\\frac\{\\pi\}\{2\}/ },
  { id: "EN-FR-24", input: "\\frac{\\sqrt{2}}{2}", expected: /0\.707106|\\frac\{\\sqrt\{2\}\}\{2\}/ },

  { id: "EN-DL-05", input: "\\Bigl(\\frac{1}{2}\\Bigr)^{3}", expected: /0\.125|\\frac\{1\}\{8\}/ },
  { id: "EN-DL-08", input: "\\left(2+3\\right)\\left(4-1\\right)", expected: /^15(?:\.0+)?$/ },
  { id: "EN-DL-09", input: "\\left(\\frac{1}{2}\\right)^{-2}", expected: /^4(?:\.0+)?$/ },
  { id: "EN-DL-17", input: "\\lceil 2.1\\rceil", expected: /^3(?:\.0+)?$/ },

  { id: "EN-OP-01", input: "2\\cdot3", expected: /^6(?:\.0+)?$/ },
  { id: "EN-OP-02", input: "2\\times3", expected: /^6(?:\.0+)?$/ },
  { id: "EN-OP-03", input: "2*3", expected: /^6(?:\.0+)?$/ },
  { id: "EN-OP-05", input: "6\\div3", expected: /^2(?:\.0+)?$/ },
  { id: "EN-OP-06", input: "6/3", expected: /^2(?:\.0+)?$/ },
  { id: "EN-OP-17", input: "5!!", expected: /^15(?:\.0+)?$/ },
  { id: "EN-OP-18", input: "3!^{2}", expected: /^36(?:\.0+)?$/ },
  { id: "EN-OP-19", input: "-3!", expected: /^-6(?:\.0+)?$/ },
  { id: "EN-OP-20", input: "2^{3!}", expected: /^64(?:\.0+)?$/ },
  { id: "EN-OP-21", input: "\\binom{5}{2}", expected: /^10(?:\.0+)?$/ },
  { id: "EN-OP-23", input: "17\\bmod5", expected: /^2(?:\.0+)?$/ },

  { id: "EN-RD-01", input: "\\sqrt{4}", expected: /^2(?:\.0+)?$/ },
  { id: "EN-RD-02", input: "\\sqrt4", expected: /^2(?:\.0+)?$/ },
  { id: "EN-RD-03", input: "\\sqrt2", expected: /1\.414213|\\sqrt\{2\}/ },
  { id: "EN-RD-06", input: "\\sqrt[3]{8}", expected: /^2(?:\.0+)?$/ },
  { id: "EN-RD-07", input: "\\sqrt[3]{-8}", expected: /^-2(?:\.0+)?$/ },
  { id: "EN-RD-08", input: "\\sqrt[3]4", expected: /1\.587401/ },
  { id: "EN-RD-09", input: "\\sqrt[10]{1024}", expected: /^2(?:\.0+)?$/ },
  { id: "EN-RD-11", input: "\\sqrt{\\sqrt{\\sqrt{256}}}", expected: /^2(?:\.0+)?$/ },
  { id: "EN-RD-12", input: "2\\sqrt{3}", expected: /3\.464101|2\\sqrt\{3\}/ },
  { id: "EN-RD-13", input: "\\sqrt{2}\\sqrt{3}", expected: /2\.449489|\\sqrt\{6\}/ },
];

async function setExpression(page: Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

async function resultValue(page: Page): Promise<string> {
  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  await expect(resultRegion).toBeVisible({ timeout: 12000 });
  const failure = resultRegion.getByText(/No se pudo calcular/i);
  if (await failure.count()) return (await resultRegion.innerText()).replace(/\s+/g, " ").trim();
  const status = resultRegion.locator('[role="status"]').first();
  await expect(status).toBeVisible({ timeout: 12000 });
  const staticField = status.locator("math-field[read-only]").first();
  if (await staticField.count()) {
    return String(await staticField.evaluate((el) =>
      (el as HTMLElement & { value?: string }).value ?? "",
    )).replace(/\s+/g, "");
  }
  const plain = status.locator(".a11y-scale-result-3xl").first();
  await expect(plain).toBeVisible();
  return (await plain.innerText()).replace(/\s+/g, "");
}

test.describe("S26 Sintaxis 625 — Bloque A determinista", () => {
  for (const tc of CASES) {
    test(tc.id, async ({ page }) => {
      await page.goto("./");
      await setExpression(page, tc.input);
      const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
      await expect(calculate).toBeEnabled();
      await calculate.click();
      const value = await resultValue(page);
      expect(value, `${tc.id}: ${tc.input} -> ${value}`).toMatch(tc.expected);
    });
  }
});
