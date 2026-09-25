import { expect, test } from "@playwright/test";

async function openSettings(page: import("@playwright/test").Page) {
  const button = page.getByRole("button", { name: "Ajustes", exact: true });
  await expect(button).toBeVisible();
  await button.click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  return { button, menu };
}

async function clickSettingRow(menu: import("@playwright/test").Locator, label: string) {
  const labelNode = menu.getByText(label, { exact: true });
  await expect(labelNode).toBeVisible();
  const row = labelNode.locator("..");
  const button = row.getByRole("button");
  await expect(button).toBeVisible();
  await button.click();
}

test("M12: preferencias visuales se aplican y persisten tras recarga", async ({ page }) => {
  await page.goto("./");
  const { menu } = await openSettings(page);

  await menu.getByRole("button", { name: "Claro", exact: true }).click();
  await menu.getByRole("button", { name: "Compacta", exact: true }).click();
  await menu.getByRole("button", { name: "Extendido", exact: true }).click();

  await menu.getByRole("button", { name: "Accesibilidad", exact: true }).click();
  await menu.getByRole("button", { name: "Muy grande", exact: true }).click();
  await clickSettingRow(menu, "Espaciado amigable con dislexia");
  await clickSettingRow(menu, "Reducir movimiento");

  await menu.getByRole("button", { name: "Gráficas", exact: true }).click();
  await menu.getByRole("button", { name: /Apta para daltonismo/i }).click();

  const attrs = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    density: document.documentElement.getAttribute("data-density"),
    textSize: document.documentElement.getAttribute("data-text-size"),
    dyslexia: document.documentElement.getAttribute("data-dyslexia-friendly"),
    reduced: document.documentElement.getAttribute("data-reduced-motion"),
    lsTheme: localStorage.getItem("precision-lab-theme"),
    lsDensity: localStorage.getItem("precision-lab-density"),
    lsText: localStorage.getItem("precision-lab-text-size"),
    lsDyslexia: localStorage.getItem("precision-lab-dyslexia-friendly"),
    lsReduced: localStorage.getItem("precision-lab-reduced-motion"),
    lsPalette: localStorage.getItem("precision-lab-graph-palette"),
    lsLayout: localStorage.getItem("precision-lab-layout-mode"),
  }));

  expect(attrs.theme).toBe("light");
  expect(attrs.density).toBe("compact");
  expect(attrs.textSize).toBe("xlarge");
  expect(attrs.dyslexia).toBe("true");
  expect(attrs.reduced).toBe("true");
  expect(attrs.lsTheme).toBe("light");
  expect(attrs.lsDensity).toBe("compact");
  expect(attrs.lsText).toBe("xlarge");
  expect(attrs.lsDyslexia).toBe("true");
  expect(attrs.lsReduced).toBe("true");
  expect(attrs.lsPalette).toBe("colorblind-safe");
  expect(attrs.lsLayout).toBe("separated");

  await page.reload();
  await expect(page.locator("math-field").first()).toBeVisible();
  const persisted = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    density: document.documentElement.getAttribute("data-density"),
    textSize: document.documentElement.getAttribute("data-text-size"),
    dyslexia: document.documentElement.getAttribute("data-dyslexia-friendly"),
    reduced: document.documentElement.getAttribute("data-reduced-motion"),
  }));
  expect(persisted).toEqual({
    theme: "light",
    density: "compact",
    textSize: "xlarge",
    dyslexia: "true",
    reduced: "true",
  });
});

test("M12: tema Automático sigue prefers-color-scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("./");
  let opened = await openSettings(page);
  await opened.menu.getByRole("button", { name: "Sistema", exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.getAttribute("data-theme"))).toBe("dark");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-theme"))).toBe("auto");

  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(async () => page.evaluate(() => document.documentElement.getAttribute("data-theme"))).toBe("light");
});

test("M12: Ajustes expone estado y cierra con Escape", async ({ page }) => {
  await page.goto("./");
  const { button, menu } = await openSettings(page);
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("M12: teclado propio tiene diálogo nombrado y cierra con Escape", async ({ page }) => {
  await page.goto("./");
  const input = page.locator("math-field").first();
  await input.focus();
  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("M12: campo matemático principal tiene nombre accesible", async ({ page }) => {
  await page.goto("./");
  const input = page.locator("math-field").first();
  await expect(input).toBeVisible();
  const aria = await input.getAttribute("aria-label");
  expect((aria ?? "").trim().length).toBeGreaterThan(0);
});

test("M12: resultado calculado en Fusionada queda dentro de una región anunciable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
  await page.goto("./");
  const input = page.locator("math-field").first();
  await input.focus();
  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();
  await input.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, "2+2");
  await keyboard.getByRole("button", { name: "calcular", exact: true }).click();

  const renderedResult = page.locator(".a11y-scale-result-3xl").first();
  await expect(renderedResult).toBeVisible({ timeout: 12000 });
  const announced = await renderedResult.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node) {
      if (node.hasAttribute("aria-live") || node.getAttribute("role") === "status" || node.getAttribute("role") === "alert") {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  });
  expect(announced).toBe(true);
});


test("M12: vibración y sonido guardan preferencia y sobreviven recarga", async ({ page }) => {
  await page.goto("./");
  const { menu } = await openSettings(page);
  await menu.getByRole("button", { name: "Teclado", exact: true }).click();
  await clickSettingRow(menu, "Vibración al presionar tecla");
  await clickSettingRow(menu, "Sonido de clic");

  expect(await page.evaluate(() => localStorage.getItem("precision-lab-key-vibration"))).toBe("false");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-key-sound"))).toBe("true");

  await page.reload();
  await expect(page.locator("math-field").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-key-vibration"))).toBe("false");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-key-sound"))).toBe("true");

  const reopened = await openSettings(page);
  await reopened.menu.getByRole("button", { name: "Teclado", exact: true }).click();
  const vibrationRow = reopened.menu.getByText("Vibración al presionar tecla", { exact: true }).locator("..");
  const soundRow = reopened.menu.getByText("Sonido de clic", { exact: true }).locator("..");
  await expect(vibrationRow.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  await expect(soundRow.getByRole("button")).toHaveAttribute("aria-pressed", "true");
});



test("M12: Configuración es ventana independiente, limita temas y el sidebar sigue el tema", async ({ page }) => {
  await page.goto("./");
  const sidebar = page.locator('aside[aria-label="Navegación principal"]');
  const { menu } = await openSettings(page);

  expect(await menu.evaluate((node) => Boolean(node.closest("aside")))).toBe(false);
  await expect(menu.getByRole("button", { name: "Claro", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: "Oscuro", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: "Sistema", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: "Sepia Cuaderno", exact: true })).toHaveCount(0);
  await expect(menu.locator("[data-layout-option]")).toHaveCount(6);

  await menu.getByRole("button", { name: "Claro", exact: true }).click();
  await expect(sidebar).toHaveCSS("background-color", "rgb(7, 43, 82)");

  await menu.getByRole("button", { name: "Oscuro", exact: true }).click();
  await expect(sidebar).toHaveCSS("background-color", "rgb(2, 22, 44)");

  await menu.getByRole("button", { name: "Sistema", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-theme"))).toBe("auto");
});
