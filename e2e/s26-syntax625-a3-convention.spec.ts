import { expect, test, type Page } from "@playwright/test";

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

async function calculateText(page: Page, input: string): Promise<string> {
  await page.goto("./");
  await setExpression(page, input);
  const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();
  const result = page.locator('section[aria-label="Resultado"]').first();
  await expect(result).toBeVisible({ timeout: 12000 });
  await expect.poll(async () => (await result.innerText()).replace(/\s+/g, " ").trim(), { timeout: 12000 })
    .not.toMatch(/Escribe una expresión y presiona Calcular|Calculando/i);
  return (await result.innerText()).replace(/\s+/g, " ").trim();
}

test("EN-OP-07 — división con dos puntos: 2 o error claro", async ({ page }) => {
  const text = await calculateText(page, "6:3");
  if (/No se pudo calcular/i.test(text)) {
    expect(text).toMatch(/divis|dos puntos|:|sintax|no soport/i);
  } else {
    expect(text).toMatch(/2/);
  }
});

test("EN-OP-10 — producto cruz vectorial o error claro", async ({ page }) => {
  const text = await calculateText(page, "\\vec{i}\\times\\vec{j}");
  if (/No se pudo calcular/i.test(text)) {
    expect(text).toMatch(/vector|producto cruz|cross|no soport|sintax/i);
  } else {
    expect(text).toMatch(/k|vector/i);
  }
});

test("EN-OP-11 — ± produce ambas ramas", async ({ page }) => {
  const text = await calculateText(page, "5\\pm2");
  expect(text).not.toMatch(/No se pudo calcular|PARSE_ERROR/i);
  expect(text).toMatch(/7/);
  expect(text).toMatch(/3/);
});

for (const [id, inputs] of [
  ["EN-OP-12", ["2\\le3", "2\\leq3", "2≤3"]],
  ["EN-OP-13", ["3\\ge2", "3\\geq2", "3≥2"]],
  ["EN-OP-14", ["2\\ne3", "2\\neq3", "2≠3"]],
  ["EN-OP-15", ["2<3", "3>2", "2\\lt3", "3\\gt2"]],
] as const) {
  test(`${id} — variantes relacionales se reconocen`, async ({ page }) => {
    for (const input of inputs) {
      const text = await calculateText(page, input);
      expect(text, `${id}: ${input} -> ${text}`).not.toMatch(/No se pudo calcular|PARSE_ERROR|Carácter no reconocido/i);
    }
  });
}
