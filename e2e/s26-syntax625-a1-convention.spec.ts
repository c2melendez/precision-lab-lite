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

test("EN-FR-13 — fracción sin llaves conserva convención explícita", async ({ page }) => {
  await page.goto("./");
  await setExpression(page, "\\frac123");
  const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
  await calculate.click();

  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  await expect(resultRegion).toBeVisible({ timeout: 12000 });
  const text = (await resultRegion.innerText()).replace(/\s+/g, " ").trim();

  if (/No se pudo calcular/i.test(text)) {
    expect(text).toMatch(/ambig|fracc|sintax|argument|interpret/i);
    return;
  }

  const status = resultRegion.locator('[role="status"]').first();
  const primary = status.locator(".a11y-scale-result-3xl").first();
  await expect(primary).toBeVisible({ timeout: 12000 });
  const raw = String(await primary.evaluate((el) => {
    const anyEl = el as HTMLElement & { value?: string };
    return anyEl.value ?? anyEl.innerText ?? "";
  })).replace("…", "").replace(",", ".").replace(/[^0-9eE+\-.]/g, "");
  const numeric = Number(raw);
  expect(numeric, `EN-FR-13 debe ser 1.5 o error claro; recibido: ${text}`).toBeCloseTo(1.5, 5);
});
