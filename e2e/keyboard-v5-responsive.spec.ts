import { expect, test } from "@playwright/test";

test("respeta el tema oscuro guardado", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-theme", "dark"));
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const chrome = await page.locator("html").evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--color-chrome").trim(),
  );
  expect(chrome).toBe("15 23 42");
});

test("la tarjeta Entrada calcula sin abrir el teclado", async ({ page }, testInfo) => {
  await page.goto("./");
  const entry = page.getByRole("region", { name: "Entrada", exact: true });
  const calculate = entry.getByRole("button", { name: "Calcular", exact: true });
  await expect(calculate).toBeDisabled();
  await page.locator("math-field").first().evaluate((field) => {
    (field as HTMLElement & { value: string }).value = "2+2";
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(calculate).toBeEnabled();
  await calculate.click();
  await expect(page.getByRole("region", { name: "Resultado", exact: true })).toContainText("4");
  await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath("entrada-resultado.png"), fullPage: true });
});

test("el teclado V5 conserva acceso y geometría responsive", async ({ page }, testInfo) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("math-field").first()).toHaveClass(/w-full/);

  const overflow = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    elements: Array.from(document.querySelectorAll("body *"))
      .filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .map((element) => ({ tag: element.tagName, className: element.className })),
  }));
  expect(overflow.scrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.width + 1);

  const openKeyboard = page.getByRole("button", { name: /Abrir teclado|Expandir teclado/i }).first();
  await expect(openKeyboard).toBeVisible();
  await openKeyboard.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();

  const algebraTab = dialog.getByRole("tab", { name: "Álgebra" });
  const symbolsTab = dialog.getByRole("tab", { name: "Símbolos" });
  await expect(algebraTab).toHaveAttribute("aria-selected", "true");
  await expect(symbolsTab).toHaveAttribute("aria-selected", "false");
  await expect(dialog.getByTestId("keyboard-b6-core")).toBeVisible();

  await expect(dialog.getByRole("button", { name: "borrar todo el campo" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "igual", exact: true })).toHaveAttribute(
    "title",
    "inserta un signo de igualdad sin ejecutar el cálculo",
  );
  await expect(dialog.getByRole("button", { name: "calcular" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("teclado-v5-basico.png"), fullPage: true });

  for (const category of ["Álgebra", "Trigonométricas", "Cálculo", "Complejos", "Unidades", "Más"]) {
    const tab = dialog.getByRole("tab", { name: category, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(dialog.getByRole("tabpanel")).toBeVisible();
    expect(await dialog.getByRole("tabpanel").getByRole("button").count()).toBeGreaterThan(3);
  }
  await symbolsTab.click();
  await expect(symbolsTab).toHaveAttribute("aria-selected", "true");
  await symbolsTab.press("Home");
  await expect(algebraTab).toBeFocused();
  await algebraTab.press("ArrowRight");
  await expect(dialog.getByRole("tab", { name: "Trigonométricas" })).toBeFocused();
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
  if (viewport!.width >= 1440) {
    const sidebar = await page.locator('aside[aria-label="Navegación principal"]').boundingBox();
    const dock = await page.getByTestId("keyboard-dock").boundingBox();
    expect(sidebar).not.toBeNull();
    expect(dock).not.toBeNull();

    const sidebarRight = sidebar!.x + sidebar!.width;
    expect(dock!.x).toBeCloseTo(sidebarRight, 0);
    expect(bounds!.x).toBeGreaterThanOrEqual(sidebarRight);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 1);
    expect(bounds!.height).toBeLessThanOrEqual(viewport!.height * 0.45 + 1);
    expect(dock!.y - (bounds!.y + bounds!.height)).toBeCloseTo(12, 0);
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.screenshot({ path: testInfo.outputPath("teclado-v5-abierto.png"), fullPage: true });
  await dialog.getByRole("button", { name: "Cerrar teclado" }).click();
  await expect(dialog).not.toBeVisible();
  await openKeyboard.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});


test("B6: Enter físico ejecuta el mismo cálculo que Enter virtual", async ({ page }) => {
  await page.goto("./");
  const field = page.locator("math-field").first();
  await field.evaluate((node) => {
    const mathField = node as HTMLElement & { setValue?: (value: string) => void; value?: string };
    if (typeof mathField.setValue === "function") mathField.setValue("2+2");
    else mathField.value = "2+2";
    node.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await field.press("Enter");
  await expect(page.getByRole("region", { name: "Resultado", exact: true })).toContainText("4");
});


test("B6: los seis módulos comparten núcleo y siete familias", async ({ page }) => {
  await page.goto("./");

  for (const name of ["Científica", "Gráficas", "Matrices", "Estadística", "Geometría", "Unidades"]) {
    const navigation = page.locator("nav").getByRole("button", { name, exact: true });
    await navigation.click();
    await expect(navigation).toHaveAttribute("aria-current", "page");

    const opener = page.getByRole("button", { name: /Abrir teclado|Expandir teclado|^Teclado$/i }).first();
    await expect(opener, `${name}: apertura global`).toBeVisible();
    await opener.click();

    const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
    await expect(keyboard, `${name}: panel global`).toBeVisible();
    await expect(keyboard.getByTestId("keyboard-b6-core"), `${name}: núcleo B6`).toBeVisible();
    await expect(keyboard.getByRole("tab"), `${name}: siete familias B6`).toHaveCount(7);
    for (const family of ["Álgebra", "Trigonométricas", "Cálculo", "Complejos", "Símbolos", "Unidades", "Más"]) {
      await expect(keyboard.getByRole("tab", { name: family, exact: true }), `${name}: ${family}`).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(keyboard).toBeHidden();
  }
});
