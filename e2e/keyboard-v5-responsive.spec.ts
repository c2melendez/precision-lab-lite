import { expect, test } from "@playwright/test";

test("el teclado V5 conserva acceso y geometría responsive", async ({ page }, testInfo) => {
  await page.goto("./");

  const openKeyboard = page.getByRole("button", { name: /Abrir teclado|Expandir teclado/i }).first();
  await expect(openKeyboard).toBeVisible();
  await openKeyboard.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();

  const basicTab = dialog.getByRole("tab", { name: "Básico" });
  const functionsTab = dialog.getByRole("tab", { name: "Funciones" });
  await expect(basicTab).toHaveAttribute("aria-selected", "true");
  await expect(functionsTab).toHaveAttribute("aria-selected", "false");

  await expect(dialog.getByRole("button", { name: "borrar todo el campo" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "igual", exact: true })).toHaveAttribute(
    "title",
    "inserta un signo de igualdad sin ejecutar el cálculo",
  );
  await expect(dialog.getByRole("button", { name: "calcular" })).toBeVisible();

  await functionsTab.click();
  await expect(functionsTab).toHaveAttribute("aria-selected", "true");
  await expect(dialog.getByRole("button", { name: "Símbolos" })).toBeVisible();

  await dialog.getByRole("button", { name: "Símbolos" }).click();
  await expect(dialog.getByText("Variables", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Constantes y valores", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Phi mayúscula", exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "número áureo phi", exact: true })).toBeVisible();

  const viewport = page.viewportSize();
  const bounds = await dialog.boundingBox();
  expect(viewport).not.toBeNull();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 1);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport!.height + 1);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.screenshot({ path: testInfo.outputPath("teclado-v5-abierto.png"), fullPage: true });
  await dialog.getByRole("button", { name: "Cerrar teclado" }).click();
  await expect(dialog).not.toBeVisible();
});
