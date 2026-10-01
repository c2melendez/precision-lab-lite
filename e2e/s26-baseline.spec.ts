import { expect, test, type Page, type TestInfo } from "@playwright/test";

const VIEWPORTS = [
  { id: "desktop-1440", width: 1440, height: 900 },
  { id: "laptop-1280", width: 1280, height: 800 },
  { id: "tablet-768", width: 768, height: 1024 },
  { id: "mobile-390", width: 390, height: 844 },
] as const;

const MODES = [
  { id: "cientifica", label: "Científica" },
  { id: "matrices", label: "Matrices" },
  { id: "graficas", label: "Gráficas" },
  { id: "estadistica", label: "Estadística" },
  { id: "geometria", label: "Geometría" },
  { id: "unidades", label: "Unidades" },
] as const;

const LAYOUTS = ["fused", "stacked", "split"] as const;

async function capture(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage: true, animations: "disabled" });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth, `${label}: horizontal overflow`).toBeLessThanOrEqual(metrics.viewport + 2);
}

test("S26 baseline: superficies visibles en cuatro viewports", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chromium", "S26 baseline se ejecuta una sola vez por workflow");
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("./");
    await expect(page.getByRole("navigation", { name: "Modos de la calculadora" })).toBeVisible();
    await expectNoHorizontalOverflow(page, viewport.id);

    for (const mode of MODES) {
      const tab = page.locator("nav").getByRole("button", { name: mode.label, exact: true });
      await tab.click();
      await expect(tab).toHaveAttribute("aria-current", "page");
      await expect(page.locator("main")).toBeVisible();
      await expectNoHorizontalOverflow(page, `${viewport.id}/${mode.id}`);
      await capture(page, testInfo, `${viewport.id}--${mode.id}`);
    }

    const history = page.getByRole("button", { name: "Historial", exact: true }).first();
    await history.click();
    await expect(history).toHaveAttribute("aria-expanded", "true");
    await capture(page, testInfo, `${viewport.id}--historial-abierto`);
    await page.keyboard.press("Escape");
    if (await history.getAttribute("aria-expanded") === "true") await history.click();

    const settings = page.getByRole("button", { name: "Ajustes", exact: true });
    await settings.click();
    await expect(settings).toHaveAttribute("aria-expanded", "true");
    await capture(page, testInfo, `${viewport.id}--ajustes-abierto`);
    await page.keyboard.press("Escape");

    await page.locator("nav").getByRole("button", { name: "Científica", exact: true }).click();
    const openKeyboard = page.getByRole("button", { name: /Abrir teclado|Expandir teclado/i }).first();
    if (await openKeyboard.count()) {
      await openKeyboard.click();
      const keyboard = page.getByRole("dialog", { name: /Teclado/ }).or(page.getByRole("region", { name: "Teclado matemático" })).first();
      await expect(keyboard).toBeVisible();
      await capture(page, testInfo, `${viewport.id}--teclado-abierto`);
      await page.keyboard.press("Escape");
    }
  }
});

test("S26 baseline: tres layouts aprobados", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chromium", "S26 baseline se ejecuta una sola vez por workflow");
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const layout of LAYOUTS) {
    for (const viewport of [
      { id: "desktop", width: 1440, height: 900 },
      { id: "mobile", width: 390, height: 844 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("./");
      await page.evaluate((value) => localStorage.setItem("precision-lab-layout-mode", value), layout);
      await page.reload();
      await expect(page.locator("main")).toBeVisible();
      await expectNoHorizontalOverflow(page, `${layout}/${viewport.id}`);
      await capture(page, testInfo, `layout--${layout}--${viewport.id}`);
    }
  }
});