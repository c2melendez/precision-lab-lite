import { expect, test } from "@playwright/test";

async function openComplex(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  await page.getByRole("tab", { name: "Complejos", exact: true }).click();
}

async function setExpression(page: import("@playwright/test").Page, value: string) {
  const field = page.locator("math-field").first();
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test("suite original módulo 5: inventario complejo compartido está activo", async ({ page }) => {
  await openComplex(page);
  for (const name of [
    "parte real",
    "parte imaginaria",
    "argumento",
    "conjugado",
    "módulo",
    "convertir a forma polar",
    "logaritmo complejo (rama principal)",
    "potencia compleja",
    "raíz n-ésima compleja (rama principal)",
    "residuo en un polo (funciones racionales)",
    "singularidades (funciones racionales)",
    "graficar en el plano de Argand",
  ]) {
    const key = page.getByRole("button", { name, exact: true }).first();
    await expect(key).toBeVisible();
    expect(await key.isDisabled()).toBe(false);
  }
});

test("suite original módulo 5: Argand 3+4i usa ejes Re e Im", async ({ page }) => {
  await openComplex(page);
  await setExpression(page, "3+4i");
  const graph = page.getByRole("button", { name: "graficar en el plano de Argand", exact: true }).first();
  await graph.click();

  await expect(page.getByText("Re", { exact: true }).first()).toBeVisible({ timeout: 12000 });
  await expect(page.getByText("Im", { exact: true }).first()).toBeVisible({ timeout: 12000 });
});


test("M20: Res y Sing funcionan por el flujo real del math-field", async ({ page }) => {
  await openComplex(page);

  await setExpression(page, "\\mathrm{Res}\\left(\\frac{1}{z-2},z=2\\right)");
  await page.getByRole("button", { name: "calcular", exact: true }).first().click();
  await expect(page.getByText("1", { exact: true }).first()).toBeVisible({ timeout: 12000 });

  await setExpression(page, "\\mathrm{Sing}\\left(\\frac{1}{(z-1)(z+2)}\\right)");
  await page.getByRole("button", { name: "calcular", exact: true }).first().click();
  await expect(page.getByText(/-2/).first()).toBeVisible({ timeout: 12000 });
  await expect(page.getByText(/1/).first()).toBeVisible({ timeout: 12000 });
});
