import { expect, test } from "@playwright/test";

test("los cinco módulos mantienen controles dentro de la pantalla", async ({ page }, testInfo) => {
  await page.goto("./");
  for (const name of ["Científica", "Matrices", "Gráficas", "Estadística", "Unidades"]) {
    const navigation = page.locator("nav").getByRole("button", { name, exact: true });
    await navigation.click();
    await expect(navigation).toHaveAttribute("aria-current", "page");
    await expect(page.locator("main")).toBeVisible();
    if (name !== "Científica") {
      await expect(page.getByRole("button", { name: /Abrir teclado|Expandir teclado|Cerrar teclado/ })).toHaveCount(0);
      await expect(page.locator("main")).toHaveClass(/pb-8/);
    }
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
  // El registro del teclado debe recuperarse después de cambiar de módulo.
  await page.locator("nav").getByRole("button", { name: "Científica", exact: true }).click();
  await page.getByRole("button", { name: /Abrir teclado|Expandir teclado/ }).first().click();
  await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Básico", exact: true })).toBeVisible();
});
