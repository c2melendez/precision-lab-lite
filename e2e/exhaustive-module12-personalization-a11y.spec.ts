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
  await menu.getByRole("button", { name: "Muy grande", exact: true }).click();
  await clickSettingRow(menu, "Espaciado amigable con dislexia");
  await clickSettingRow(menu, "Reducir movimiento");
  await menu.getByRole("button", { name: /Apta para daltonismo/i }).click();
  await menu.getByRole("button", { name: "Separada", exact: true }).click();

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
  await opened.menu.getByRole("button", { name: "Automático (sistema)", exact: true }).click();
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

test("M12: resultado calculado queda dentro de una región anunciable", async ({ page }) => {
  await page.goto("./");
  const input = page.locator("math-field").first();
  await input.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, "2+2");
  const form = input.locator("xpath=ancestor::form[1]");
  if (await form.count()) {
    await form.evaluate((el) => (el as HTMLFormElement).requestSubmit());
  } else {
    await page.getByRole("button", { name: /calcular|evaluar/i }).first().click();
  }

  // Debe existir una región live/status/alert que represente el resultado dinámico.
  await expect.poll(async () => {
    return page.locator('[aria-live], [role="status"], [role="alert"]').evaluateAll((els) =>
      els.some((el) => {
        const text = (el.textContent ?? "").replace(/\s+/g, " ");
        return text.includes("4") || text.includes("2+2");
      }),
    );
  }).toBe(true);
});
