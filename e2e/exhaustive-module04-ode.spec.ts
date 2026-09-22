import { expect, test } from "@playwright/test";

async function openODE(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  await page.getByRole("tab", { name: "Cálculo", exact: true }).click();
}

async function setExpression(page: import("@playwright/test").Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.focus();
  await page.waitForTimeout(100);
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  }, value);
}

test("suite original módulo 4: teclas EDO activas y alcanzables", async ({ page }) => {
  await openODE(page);

  for (const name of [
    /ecuación diferencial de primer orden/i,
    /ecuación diferencial lineal homogénea de segundo orden/i,
    /ecuación diferencial lineal no homogénea de segundo orden/i,
    /condición inicial/i,
    /notación alternativa de derivada/i,
  ]) {
    const key = page.getByRole("button", { name }).first();
    await expect(key).toBeVisible();
    expect(await key.isDisabled()).toBe(false);
  }
});

test("suite original módulo 4: y'=2x se resuelve desde la UI", async ({ page }) => {
  await page.goto("./");
  await setExpression(page, "y'=2x");

  const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  await expect(result).toContainText(/x.{0,6}2|x²/i, { timeout: 12000 });
});
