import { expect, test, type Locator, type Page } from "@playwright/test";

const COMMON_THEMES: Array<[string, string]> = [
  ["Oscuro", "dark"],
  ["Claro", "light"],
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
  return menu.getByRole("button").filter({ hasText: label }).first();
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
  await menuButton(menu, "Apta para daltonismo").click();
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
  await expect(menuButton(menu, "Apta para daltonismo")).toHaveAttribute("aria-pressed", "true");
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

test("M12: el resultado dinámico queda dentro de una región anunciable", async ({ page }) => {
  await openHome(page);
  const field = page.locator("math-field:not([read-only])").first();
  await field.evaluate((el) => {
    const math = el as HTMLElement & { value: string };
    math.value = "2+2";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });

  const form = field.locator("xpath=ancestor::form[1]");
  const submit = form.getByRole("button", { name: /Evaluar|Calcular/i }).first();
  await expect(submit).toBeEnabled();
  await submit.click();

  const readonlyMath = page.locator("math-field[read-only]").last();
  const katex = page.locator(".katex").last();
  await expect.poll(async () => (await readonlyMath.count()) + (await katex.count()), { timeout: 12000 }).toBeGreaterThan(0);

  const resultNode = (await readonlyMath.count()) ? readonlyMath : katex;
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
  expect(announcement, "El resultado debe estar contenido en aria-live/status/alert").not.toBeNull();
});
