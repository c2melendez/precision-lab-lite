import { expect, test, type Page } from "@playwright/test";

type StructuralCase = {
  id: string;
  input: string;
  mustContain: string[];
  mustNotContain?: string[];
  mustContainAny?: string[][];
};

const CASES: StructuralCase[] = [
  { id: "EN-FR-07", input: "\\frac{x+1}{x-1}", mustContain: ["x+1", "x-1"] },
  { id: "EN-FR-08", input: "(x+1)/(x-1)", mustContain: ["x+1", "x-1"] },
  { id: "EN-FR-09", input: "x+1\\over x-1", mustContain: ["x+1", "x-1"] },
  { id: "EN-FR-11", input: "\\frac1x", mustContain: ["1/x"] },
  { id: "EN-FR-16", input: "\\frac{1}{\\frac{1}{x}+\\frac{1}{y}}", mustContain: ["x", "y"] },
  { id: "EN-FR-19", input: "\\frac{a}{b}\\frac{c}{d}", mustContain: ["a", "b", "c", "d"] },

  { id: "EN-FR-17", input: "\\frac{1}{2}x", mustContain: ["x"], mustNotContain: ["2x"] },
  { id: "EN-FR-18", input: "\\frac{1}{2x}", mustContain: ["2x"] },
  { id: "EN-FR-20", input: "x+1/x-1", mustContain: ["x", "1/x"] },
  { id: "EN-DL-01", input: "\\left(x+1\\right)^{2}", mustContain: ["(x+1)", "^2"] },
  { id: "EN-DL-02", input: "\\left[x+1\\right]^{2}", mustContain: ["x+1", "^2"] },
  { id: "EN-DL-04", input: "\\bigl(x+1\\bigr)^{2}", mustContain: ["(x+1)", "^2"] },
  { id: "EN-DL-06", input: "\\mleft(x+1\\mright)^{2}", mustContain: ["(x+1)", "^2"] },
  { id: "EN-DL-11", input: "\\|x-1\\|", mustContain: ["|x-1|"] },
  { id: "EN-DL-12", input: "\\left\\| x-1 \\right\\|", mustContain: ["|x-1|"] },
  { id: "EN-DL-13", input: "\\|\\|x\\|-1\\|", mustContain: ["x", "1"] },
  { id: "EN-DL-14", input: "\\lvert\\lvert x\\rvert-1\\rvert", mustContain: ["x", "1"] },
  { id: "EN-DL-15", input: "\\lvert x\\rvert\\lvert y\\rvert", mustContain: ["x", "y"] },
  { id: "EN-DL-07", input: "((x))", mustContain: ["x"] },
  { id: "EN-DL-10", input: "\\lvert x-1\\rvert", mustContain: ["|x-1|"] },
  { id: "EN-OP-08", input: "2\\cdot x\\cdot y", mustContain: ["2", "x", "y"] },
  { id: "EN-OP-09", input: "x\\times y", mustContain: ["x", "y"] },
  { id: "EN-RD-04", input: "\\sqrt x", mustContain: ["sqrt", "x"] },
  { id: "EN-RD-05", input: "\\sqrt{x}y", mustContain: ["sqrt", "x", "y"] },
  { id: "EN-RD-10", input: "\\sqrt[n]{x}", mustContain: ["x", "n"] },
  { id: "EN-RD-14", input: "x^{\\frac{1}{2}}", mustContain: ["x"], mustContainAny: [["sqrt", "x"], ["x", "1/2"]] },
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
  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  await expect(resultRegion).toBeVisible({ timeout: 12000 });

  const original = page.getByRole("button", { name: "Original", exact: true }).first();
  let hasOriginal = false;
  try {
    await expect(original).toBeVisible({ timeout: 2000 });
    hasOriginal = true;
  } catch {
    hasOriginal = false;
  }
  if (hasOriginal) {
    await original.click();
    const field = resultRegion.locator('math-field[read-only]').first();
    await expect(field).toBeVisible();
    return String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""))
      .replace(/\\left|\\right/g, "")
      .replace(/\s+/g, "");
  }

  // Algunos resultados simbólicos no generan una vista contextual "Original".
  // En ese caso validamos la expresión matemática principal renderizada.
  const primary = resultRegion.locator(".a11y-scale-result-3xl").first();
  try {
    await expect(primary).toBeVisible({ timeout: 12000 });
  } catch (error) {
    const debugText = (await resultRegion.innerText()).replace(/\s+/g, " ").trim();
    const fields = await resultRegion.locator("math-field").count();
    throw new Error(`Resultado sin selector primario. text=${debugText} mathFields=${fields}; ${String(error)}`);
  }
  const raw = await primary.evaluate((el) => {
    const node = el as HTMLElement & { value?: string };
    return node.value ?? node.innerText ?? "";
  });
  return String(raw)
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
      if (tc.mustContainAny?.length) {
        const matched = tc.mustContainAny.some((option) => option.every((fragment) => plain.includes(fragment)));
        expect(matched, `${tc.id}: ${echo}`).toBe(true);
      }
    });
  }
});
