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
  await page.getByRole("button", { name: /calcular|evaluar/i }).first().click();
  const result = page.locator('section[aria-label="Resultado"]').first();
  await expect(result).toBeVisible({ timeout: 12000 });
  await expect
    .poll(async () => (await result.innerText()).replace(/\s+/g, " ").trim(), { timeout: 12000 })
    .not.toMatch(/Escribe una expresión y presiona Calcular/i);
  return (await result.innerText()).replace(/\s+/g, " ").trim();
}

test("EN-DL-03 — llaves agrupación o error claro", async ({ page }) => {
  const text = await calculateText(page, "2\\left\\{3+4\\right\\}");
  if (/No se pudo calcular/i.test(text)) {
    expect(text).toMatch(/llave|conjunto|agrup|sintax|no soport/i);
  } else {
    expect(text).toMatch(/14/);
  }
});

for (const tc of [
  { id: "EN-DL-18", input: "\\left(1,3\\right]" },
  { id: "EN-DL-19", input: "[1,3)" },
]) {
  test(`${tc.id} — intervalo semiabierto no se confunde con desbalance`, async ({ page }) => {
    const text = await calculateText(page, tc.input);
    expect(text).not.toMatch(/desbalance|sin balance|cierre.*par[eé]nt|par[eé]ntesis.*cierre/i);
    if (/No se pudo calcular/i.test(text)) {
      expect(text).toMatch(/interval|no soport|sintax|entrada/i);
    }
  });
}

test("EN-DL-20 — norma vectorial 3-4-5 o error claro", async ({ page }) => {
  const text = await calculateText(page, "\\lVert\\begin{pmatrix}3\\\\4\\end{pmatrix}\\rVert");
  if (/No se pudo calcular/i.test(text)) {
    expect(text).toMatch(/norma|vector|matriz|no soport|sintax/i);
  } else {
    expect(text).toMatch(/5/);
  }
});
