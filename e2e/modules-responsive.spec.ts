import { expect, test } from "@playwright/test";

test("los cinco módulos mantienen controles dentro de la pantalla", async ({ page }, testInfo) => {
  await page.goto("./");
  for (const name of ["Científica", "Matrices", "Gráficas", "Estadística", "Unidades"]) {
    const navigation = page.locator("nav").getByRole("button", { name, exact: true });
    await navigation.click();
    await expect(navigation).toHaveAttribute("aria-current", "page");
    await expect(page.locator("main")).toBeVisible();
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
});
