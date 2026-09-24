import { expect, test } from "@playwright/test";

test("los seis módulos mantienen controles dentro de la pantalla", async ({ page }, testInfo) => {
  await page.goto("./");
  for (const name of ["Científica", "Matrices", "Gráficas", "Estadística", "Geometría", "Unidades"]) {
    const navigation = page.locator("nav").getByRole("button", { name, exact: true });
    await navigation.click();
    await expect(navigation).toHaveAttribute("aria-current", "page");
    await expect(page.locator("main")).toBeVisible();
    const keyboardToggle = page.getByRole("button", { name: /Abrir teclado|Expandir teclado|Cerrar teclado/ }).first();
    await expect(keyboardToggle, `${name}: teclado global`).toBeVisible();
    const overflow = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      elements: Array.from(document.querySelectorAll("main *"))
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .map((el) => ({ tag: el.tagName, classes: el.className })).slice(0, 15),
    }));
    expect(overflow.scroll, `${name}: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.width + 1);
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
  }
  // El fallback global debe insertar sobre inputs nativos.
  await page.locator("nav").getByRole("button", { name: "Geometría", exact: true }).click();
  const base = page.getByLabel("Base");
  await base.fill("");
  await base.focus();
  await page.getByRole("button", { name: /Abrir teclado|Expandir teclado/ }).first().click();
  const keyboard = page.getByRole("dialog", { name: /Teclado/ }).first();
  await expect(keyboard).toBeVisible();
  await keyboard.getByRole("button", { name: "7", exact: true }).first().click();
  await expect(base).toHaveValue("7");

  // Al regresar a Científica, el teclado propietario recupera prioridad.
  await page.keyboard.press("Escape");
  await page.locator("nav").getByRole("button", { name: "Científica", exact: true }).click();
  await page.getByRole("button", { name: /Abrir teclado|Expandir teclado/ }).first().click();
  await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Básico", exact: true })).toBeVisible();
});
