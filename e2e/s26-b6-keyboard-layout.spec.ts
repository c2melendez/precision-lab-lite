import { expect, test } from "@playwright/test";

async function openKeyboard(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  return dialog;
}

test("S26 B6: anexo contextual no oculta el teclado básico", async ({ page }) => {
  const dialog = await openKeyboard(page);

  await dialog.getByRole("tab", { name: "Álgebra", exact: true }).click();
  await dialog.getByLabel("Subcategorías de Álgebra").getByRole("button", { name: "Ecuaciones", exact: true }).click();

  await expect(dialog.getByRole("button", { name: "Resolver ecuación", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "7", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "calcular", exact: true })).toBeVisible();

  await dialog.getByRole("tab", { name: "Cálculo", exact: true }).click();
  await dialog.getByLabel("Subcategorías de Cálculo").getByRole("button", { name: "Límites", exact: true }).click();

  await expect(dialog.getByRole("button", { name: "7", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "calcular", exact: true })).toBeVisible();
});

test("S26 B6: categorías y subcategorías muestran icono y texto", async ({ page }) => {
  const dialog = await openKeyboard(page);

  const algebra = dialog.getByRole("tab", { name: "Álgebra", exact: true });
  await expect(algebra).toContainText("x²");
  await algebra.click();

  const arithmetic = dialog.getByLabel("Subcategorías de Álgebra").getByRole("button", { name: "Aritmética", exact: true });
  await expect(arithmetic).toContainText("a!");
  await arithmetic.click();

  await expect(dialog.getByRole("button", { name: "mínimo común múltiplo", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "máximo común divisor", exact: true })).toBeVisible();
});
