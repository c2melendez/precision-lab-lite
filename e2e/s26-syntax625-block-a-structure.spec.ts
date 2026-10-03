import { expect, test, type Page } from "@playwright/test";

type StructuralCase = {
  id: string;
  input: string;
  mustContain: string[];
  mustNotContain?: string[];
};

const CASES: StructuralCase[] = [
  { id: "EN-FR-07", input: "\\frac{x+1}{x-1}", mustContain: ["x+1", "x-1"] },
  { id: "EN-FR-17", input: "\\frac{1}{2}x", mustContain: ["x"], mustNotContain: ["2x"] },
  { id: "EN-FR-18", input: "\\frac{1}{2x}", mustContain: ["2x"] },
  { id: "EN-FR-20", input: "x+1/x-1", mustContain: ["x", "1/x"] },
  { id: "EN-DL-01", input: "\\left(x+1\\right)^{2}", mustContain: ["(x+1)", "^2"] },
  { id: "EN-DL-07", input: "((x))", mustContain: ["x"] },
  { id: "EN-DL-10", input: "\\lvert x-1\\rvert", mustContain: ["|x-1|"] },
  { id: "EN-OP-08", input: "2\\cdot x\\cdot y", mustContain: ["2", "x", "y"] },
  { id: "EN-RD-05", input: "\\sqrt{x}y", mustContain: ["sqrt", "x", "y"] },
  { id: "EN-RD-10", input: "\\sqrt[n]{x}", mustContain: ["x", "n"] },
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

async function originalLatex(page: Page): Promise<string> {
  const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
  await calculate.click();
  const original = page.getByRole("button", { name: "Original", exact: true }).first();
  await expect(original).toBeVisible({ timeout: 12000 });
  await original.click();
  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  const field = resultRegion.locator('math-field[read-only]').first();
  await expect(field).toBeVisible();
  return String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""))
    .replace(/\\left|\\right/g, "")
    .replace(/\s+/g, "");
}

test.describe("S26 Sintaxis 625 — Bloque A eco estructural", () => {
  for (const tc of CASES) {
    test(tc.id, async ({ page }) => {
      await page.goto("./");
      await setExpression(page, tc.input);
      const echo = await originalLatex(page);
      const plain = echo
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
        .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
        .replace(/[{}]/g, "");
      for (const fragment of tc.mustContain) expect(plain, `${tc.id}: ${echo}`).toContain(fragment);
      for (const fragment of tc.mustNotContain ?? []) expect(plain, `${tc.id}: ${echo}`).not.toContain(fragment);
    });
  }
});
