import { expect, test, type Locator, type Page } from "@playwright/test";

const COMMON_THEMES: Array<[string, string]> = [
  ["Claro", "light"],
  ["Oscuro", "dark"],
  ["Alto contraste", "high-contrast"],
  ["Azul SaaS", "saas-blue"],
  ["Medianoche Púrpura", "midnight-purple"],
  ["Grafito Monocromo", "graphite"],
  ["Cian Tecnológico", "cyan-tech"],
  ["Bosque Profundo", "deep-forest"],
  ["Menta", "mint"],
  ["Sepia Cuaderno", "sepia"],
  ["Coral", "coral"],
  ["Ámbar Claro", "amber-light"],
  ["Alto Contraste Azul", "high-contrast-blue"],
];

async function openHome(page: Page) {
  await page.goto("./");
  await expect(page.getByRole("button", { name: "Ajustes", exact: true })).toBeVisible();
}

async function openSettings(page: Page): Promise<Locator> {
  const trigger = page.getByRole("button", { name: "Ajustes", exact: true });
  if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  return menu;
}

function menuButton(menu: Locator, label: string): Locator {
  return menu.getByRole("button", { name: label, exact: true }).first();
}

function settingRowButton(page: Page, label: string): Locator {
  return page.getByText(label, { exact: true }).locator("..").getByRole("button").first();
}

test("M12: todos los temas manuales comunes se aplican y persisten", async ({ page }) => {
  await openHome(page);
  const menu = await openSettings(page);

  for (const [label, id] of COMMON_THEMES) {
    const button = menuButton(menu, label);
    await expect(button, label).toBeVisible();
    await button.click();
    await expect(page.locator("html"), label).toHaveAttribute("data-theme", id);
    expect(await page.evaluate(() => localStorage.getItem("precision-lab-theme")), label).toBe(id);
    const token = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim());
    expect(token, label + ": --color-paper").not.toBe("");
  }

  const liteBlue = menu.getByRole("button").filter({ hasText: "Azul claro" });
  if (await liteBlue.count()) {
    await liteBlue.first().click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "v4-blue");
    expect(await page.evaluate(() => localStorage.getItem("precision-lab-theme"))).toBe("v4-blue");
  }

  const stored = await page.evaluate(() => localStorage.getItem("precision-lab-theme"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", stored!);
});

test("M12: tema Automático sigue prefers-color-scheme y persiste la selección auto", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await openHome(page);
  const menu = await openSettings(page);
  await menuButton(menu, "Automático (sistema)").click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-theme"))).toBe("auto");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-theme"))).toBe("auto");
});

test("M12: densidad, texto, dislexia, feedback, paleta y layout persisten tras recarga", async ({ page }) => {
  await openHome(page);
  let menu = await openSettings(page);

  await menuButton(menu, "Compacta").click();
  await menuButton(menu, "Muy grande").click();
  await settingRowButton(page, "Espaciado amigable con dislexia").click();
  await settingRowButton(page, "Vibración al presionar tecla").click();
  await settingRowButton(page, "Sonido de clic").click();
  await menu.getByText("Apta para daltonismo", { exact: true }).locator("..").click();
  await menuButton(menu, "Enfoque").click();

  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "xlarge");
  await expect(page.locator("html")).toHaveAttribute("data-dyslexia-friendly", "true");

  const storage = await page.evaluate(() => ({
    density: localStorage.getItem("precision-lab-density"),
    text: localStorage.getItem("precision-lab-text-size"),
    dyslexia: localStorage.getItem("precision-lab-dyslexia-friendly"),
    vibration: localStorage.getItem("precision-lab-key-vibration"),
    sound: localStorage.getItem("precision-lab-key-sound"),
    palette: localStorage.getItem("precision-lab-graph-palette"),
    layout: localStorage.getItem("precision-lab-layout-mode"),
  }));
  expect(storage).toEqual({
    density: "compact",
    text: "xlarge",
    dyslexia: "true",
    vibration: "false",
    sound: "true",
    palette: "colorblind-safe",
    layout: "focus",
  });

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "xlarge");
  await expect(page.locator("html")).toHaveAttribute("data-dyslexia-friendly", "true");

  menu = await openSettings(page);
  await expect(menuButton(menu, "Compacta")).toHaveAttribute("aria-pressed", "true");
  await expect(menuButton(menu, "Muy grande")).toHaveAttribute("aria-pressed", "true");
  await expect(menu.getByText("Apta para daltonismo", { exact: true }).locator("..")).toHaveAttribute("aria-pressed", "true");
  await expect(menuButton(menu, "Enfoque")).toHaveAttribute("aria-pressed", "true");
  await expect(settingRowButton(page, "Espaciado amigable con dislexia")).toHaveAttribute("aria-pressed", "true");
  await expect(settingRowButton(page, "Vibración al presionar tecla")).toHaveAttribute("aria-pressed", "false");
  await expect(settingRowButton(page, "Sonido de clic")).toHaveAttribute("aria-pressed", "true");
});

test("M12: reducir movimiento sigue al sistema hasta que existe override manual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "true");

  await openSettings(page);
  const toggle = settingRowButton(page, "Reducir movimiento");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();

  await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "false");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-reduced-motion"))).toBe("false");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "false");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "false");
});

test("M12: Ajustes y teclado tienen nombres/estado accesibles y cierran con Escape", async ({ page }) => {
  await openHome(page);
  const settings = page.getByRole("button", { name: "Ajustes", exact: true });
  await expect(settings).toHaveAttribute("aria-expanded", "false");
  await settings.click();
  await expect(settings).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(settings).toHaveAttribute("aria-expanded", "false");

  const field = page.locator("math-field:not([read-only])").first();
  await expect(field).toBeVisible();
  const explicitName = await field.evaluate((el) => el.getAttribute("aria-label") || el.getAttribute("aria-labelledby"));
  expect(explicitName, "El campo matemático principal debe tener nombre accesible explícito").toBeTruthy();

  await field.focus();
  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(keyboard).toHaveCount(0);
});

test("M12: el resultado dinámico es anunciable en las seis disposiciones", async ({ page }) => {
  await openHome(page);
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  const basic = dialog.getByRole("tab", { name: "Básico", exact: true });
  if (await basic.count()) await basic.click();

  const clear = dialog.getByRole("button", { name: "borrar todo el campo", exact: true });
  if (await clear.count()) await clear.click();

  await dialog.getByRole("button", { name: "2", exact: true }).click();
  await dialog.getByRole("button", { name: "sumar", exact: true }).click();
  await dialog.getByRole("button", { name: "2", exact: true }).click();
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();

  const resultNode = page.locator(".a11y-scale-result-3xl").last();
  await expect(resultNode).toBeVisible({ timeout: 12000 });
  await expect(resultNode).toContainText("4");

  // M11 ya certificó que Flotante degrada a Enfoque por debajo de 1024 px.
  // No intentamos activar una disposición no disponible en móvil: eso sería
  // un falso positivo del harness, no un defecto de accesibilidad.
  const isNarrow = (page.viewportSize()?.width ?? 1440) < 1024;
  const layouts = isNarrow
    ? ["Fusionada", "Separada", "Dividida", "Enfoque", "Apilado"]
    : ["Fusionada", "Separada", "Dividida", "Enfoque", "Apilado", "Flotante"];
  const missing: string[] = [];

  for (const layout of layouts) {
    const menu = await openSettings(page);
    await menu.getByRole("button", { name: layout, exact: true }).click();
    await expect(resultNode).toBeVisible();

    const announcement = await resultNode.evaluate((el) => {
      let node: Element | null = el;
      while (node) {
        const live = node.getAttribute("aria-live");
        const role = node.getAttribute("role");
        if (live || role === "status" || role === "alert") return { live, role };
        node = node.parentElement;
      }
      return null;
    });
    if (!announcement) missing.push(layout);
  }

  expect(missing, "Disposiciones sin aria-live/status/alert para el resultado").toEqual([]);
});


test("M12: la primera curva usa visualmente la paleta Azul SaaS por defecto", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Gráficas", exact: true }).click();

  const field = page.locator("math-field").first();
  await field.evaluate((node) => {
    const el = node as HTMLElement & { value: string };
    el.value = "x^2";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "Graficar esta expresión", exact: true }).first().click();

  const curve = page.locator('svg[viewBox="0 0 340 280"] path').first();
  await expect(curve).toBeVisible({ timeout: 15000 });
  expect((await curve.getAttribute("stroke"))?.toLowerCase()).toBe("#2563eb");
  expect(await page.evaluate(() => localStorage.getItem("precision-lab-graph-palette"))).toBeNull();
});

