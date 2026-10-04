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

async function renderedResult(page: Page): Promise<{ text: string; math: string }> {
  const region = page.locator('section[aria-label="Resultado"]').first();
  await expect(region).toBeVisible({ timeout: 12000 });
  await expect.poll(async () => (await region.innerText()).replace(/\s+/g, " ").trim(), { timeout: 12000 })
    .not.toMatch(/Escribe una expresión y presiona Calcular|Calculando/i);
  const text = (await region.innerText()).replace(/\s+/g, " ").trim();
  const field = region.locator('math-field[read-only]').first();
  const math = await field.count()
    ? String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""))
    : "";
  return { text, math };
}

test("EN-RD-15 — raíz cuadrada negativa: error real claro o 2i", async ({ page }) => {
  await page.goto("./");
  await setExpression(page, "\\sqrt{-4}");
  await page.getByRole("button", { name: /calcular|evaluar/i }).first().click();
  const { text, math } = await renderedResult(page);

  if (/No se pudo calcular/i.test(text)) {
    expect(text).toMatch(/dominio|real|negativ|ra[ií]z|complej|no definida|no soport/i);
    return;
  }

  const value = (math || text).replace(/\s+/g, "");
  expect(value).toMatch(/2/);
  expect(value).toMatch(/i/i);
});
