import { expect, test } from "@playwright/test";

async function openKeyboard(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  return page.getByRole("dialog", { name: "Teclado matemático" });
}

async function clearBasic(dialog: import("@playwright/test").Locator) {
  await dialog.getByRole("button", { name: "borrar todo el campo", exact: true }).click();
}

async function resultValue(page: import("@playwright/test").Page): Promise<string> {
  const result = page.locator(".a11y-scale-result-3xl").first();
  try {
    await expect(result).toBeVisible({ timeout: 12000 });
  } catch {
    const bodyText = await page.locator("body").innerText();
    throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
  }
  return String(await result.evaluate((el) => {
    const maybeField = el as HTMLElement & { value?: string };
    return typeof maybeField.value === "string" && maybeField.value
      ? maybeField.value
      : (el.textContent ?? "");
  }));
}

test("módulo 10 diagnóstico: 2+2 desde teclas reales produce 4", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "2", exact: true }).click();
  await dialog.getByRole("button", { name: "sumar", exact: true }).click();
  await dialog.getByRole("button", { name: "2", exact: true }).click();
  const field = page.locator("math-field").first();
  const fieldValue = await field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  expect(fieldValue.replace(/\s/g, "")).toMatch(/2\+2/);
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();
  const value = (await resultValue(page)).replace(/\s/g, "");
  expect(value).toContain("4");
});

test("módulo 10: la tecla % calcula porcentaje real (50% = 0.5)", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "5", exact: true }).click();
  await dialog.getByRole("button", { name: "0", exact: true }).click();
  await dialog.getByRole("button", { name: "porcentaje", exact: true }).click();
  const percentField = page.locator("math-field").first();
  const percentLatex = await percentField.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  expect(percentLatex).toMatch(/50/);
  expect(percentLatex).toMatch(/%/);
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();

  const value = await resultValue(page);
  expect(value).toMatch(/0\.5|\\frac\{1\}\{2\}/);
});

test("módulo 10: ±(5) produce dos ramas matemáticas distintas", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "más/menos", exact: true }).click();
  await dialog.getByRole("button", { name: "5", exact: true }).click();
  const pmField = page.locator("math-field").first();
  const pmLatex = await pmField.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  expect(pmLatex).toMatch(/\\pm|±/);
  expect(pmLatex).toContain("5");
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();

  const value = (await resultValue(page)).replace(/\s/g, "");
  expect(value).toContain("5");
  expect(value).toContain("-5");
  expect(value).toMatch(/\[|\\begin|,/);
});

test("módulo 10: Productoria Π ya no aparece como pendiente", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Cálculo", exact: true }).click();
  const product = dialog.getByRole("button", { name: "productoria", exact: true });
  await expect(product).toBeVisible();
  await product.click();
  await expect(page.getByText(/productoria: todavía no disponible/i)).toHaveCount(0);
});

test("módulo 10: acciones no aritméticas de Álgebra exponen tooltip", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Álgebra", exact: true }).click();

  for (const name of [
    "Resolver ecuación",
    "Resolver inecuación",
    "Resolver sistema de ecuaciones",
    "Simplificar expresión",
    "Mínimo común múltiplo",
    "Máximo común divisor",
  ]) {
    const button = dialog.getByRole("button", { name, exact: true }).first();
    await expect(button).toBeVisible();
    const title = await button.getAttribute("title");
    expect(title, `Falta tooltip en ${name}`).toBeTruthy();
  }
});
