import { expect, test } from "@playwright/test";

test("M37: Flotante cruza el breakpoint en vivo sin perder teclado ni gráfica", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "floating");
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  const graphDialog = page.getByRole("dialog", { name: "Gráfica" });
  await expect(graphDialog).toBeVisible();

  const openKeyboard = page.getByRole("button", { name: "Abrir teclado", exact: true });
  const floatingKeyboard = page.getByRole("dialog", { name: "Teclado", exact: true });
  const sheetKeyboard = page.getByRole("dialog", { name: "Teclado matemático", exact: true });

  await expect(openKeyboard).toBeVisible();
  await openKeyboard.click();
  await expect(floatingKeyboard).toBeVisible();

  // Al bajar de 1024px, Flotante debe degradar a Enfoque en la misma
  // sesión. La ventana flotante desaparece, pero el estado abierto del
  // teclado se conserva y reaparece como panel del dock, sin duplicarse.
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(graphDialog).toHaveCount(0);
  await expect(floatingKeyboard).toHaveCount(0);
  await expect(sheetKeyboard).toBeVisible();
  await expect(page.getByRole("button", { name: "Calcular", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Borrar", exact: true })).toBeVisible();

  // El panel degradado se puede cerrar y reabrir desde el dock compacto.
  await sheetKeyboard.getByRole("button", { name: "Cerrar teclado", exact: true }).click();
  await expect(sheetKeyboard).toHaveCount(0);
  const expand = page.getByRole("button", { name: "Expandir teclado", exact: true }).first();
  await expect(expand).toBeVisible();
  await expand.click();
  await expect(sheetKeyboard).toBeVisible();

  // Al volver a escritorio, debe restaurarse Flotante sin recargar y el
  // mismo estado abierto migra de vuelta a la ventana flotante.
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(graphDialog).toBeVisible();
  await expect(sheetKeyboard).toHaveCount(0);
  await expect(floatingKeyboard).toBeVisible();

  const box = await graphDialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(1281);
  expect(box!.y + box!.height).toBeLessThanOrEqual(801);

  // El layout persistido sigue siendo "floating": el cambio de viewport
  // no debe reescribir la preferencia del usuario.
  expect(
    await page.evaluate(() => localStorage.getItem("precision-lab-layout-mode")),
  ).toBe("floating");
});
