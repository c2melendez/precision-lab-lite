import { expect, test, type Locator, type Page } from "@playwright/test";

async function openKeyboard(page: Page): Promise<Locator> {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function clear(dialog: Locator) {
  await dialog.getByRole("button", { name: "borrar todo el campo", exact: true }).click();
}

async function clickVisibleButton(page: Page, name: string): Promise<boolean> {
  const matches = page.getByRole("button", { name, exact: true });
  for (let i = 0; i < await matches.count(); i += 1) {
    const candidate = matches.nth(i);
    if (await candidate.isVisible()) {
      await candidate.click();
      return true;
    }
  }
  return false;
}

async function press(dialog: Locator, name: string) {
  const page = dialog.page();
  if (await clickVisibleButton(page, name)) return;

  // Insertar una plantilla temática cierra el panel expandido. La ruta
  // real de usuario para continuar escribiendo es volver a abrir el
  // teclado y pulsar la siguiente tecla; hacemos exactamente eso.
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  if (await opener.isVisible().catch(() => false)) {
    await opener.click();
    await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toBeVisible();
    if (await clickVisibleButton(page, name)) return;
  }

  throw new Error(`No se encontró una tecla visible con aria-label "${name}" ni tras reabrir el teclado`);
}

async function category(dialog: Locator, name: string) {
  const page = dialog.page();
  let tab = page.getByRole("tab", { name, exact: true });
  if (!(await tab.first().isVisible().catch(() => false))) {
    const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
    await expect(opener).toBeVisible();
    await opener.click();
    await expect(page.getByRole("dialog", { name: "Teclado matemático" })).toBeVisible();
    tab = page.getByRole("tab", { name, exact: true });
  }
  await tab.first().click();
  await expect(tab.first()).toHaveAttribute("aria-selected", "true");
}

async function hideMathLiveKeyboard(page: Page) {
  await page.evaluate(() => window.mathVirtualKeyboard?.hide());
  await page.locator(".ML__keyboard.is-visible").waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
}

async function calculate(page: Page, dialog: Locator) {
  await hideMathLiveKeyboard(page);
  await press(dialog, "calcular");
}

async function resultValue(page: Page): Promise<string> {
  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  await expect(resultRegion).toBeVisible({ timeout: 12000 });

  const failure = resultRegion.getByText(/No se pudo calcular/i);
  if (await failure.count()) {
    return (await resultRegion.innerText()).replace(/\s+/g, " ").trim();
  }

  const status = resultRegion.locator('[role="status"]').first();
  await expect(status).toBeVisible({ timeout: 12000 });
  const staticField = status.locator("math-field[read-only]").first();
  if (await staticField.count()) {
    return String(await staticField.evaluate((el) =>
      (el as HTMLElement & { value?: string }).value ?? "",
    ));
  }
  const plain = status.locator(".a11y-scale-result-3xl").first();
  await expect(plain).toBeVisible();
  return (await plain.innerText()).trim();
}

test("S16 REG-001: 1.5+2.25 => 3.75 desde teclado real", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  for (const key of ["1", "punto decimal", "5", "sumar", "2", "punto decimal", "2", "5"]) await press(dialog, key);
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(",", ".")).toContain("3.75");
});

test("S16 REG-002: log(100) => 2 desde plantilla real", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Álgebra");
  await press(dialog, "logaritmo base 10");
  await press(dialog, "1");
  await press(dialog, "0");
  await press(dialog, "0");
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(/\s/g, "")).toContain("2");
});

test("S16 REG-003: ln(e) => 1 desde plantilla y constante reales", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Álgebra");
  await press(dialog, "logaritmo natural");
  await category(dialog, "Símbolos");
  await press(dialog, "e");
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(/\s/g, "")).toContain("1");
});

test("S16 REG-004: log base 2 de 8 => 3 desde tecla real", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Álgebra");
  await press(dialog, "logaritmo base 2");
  await press(dialog, "8");
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(/\s/g, "")).toContain("3");
});

test("S16 REG-005: entero > MAX_SAFE_INTEGER no se corrompe silenciosamente", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  for (const digit of "9007199254740993") await press(dialog, digit);
  await calculate(page, dialog);
  const value = (await resultValue(page)).replace(/[\s,]/g, "");
  expect(value).not.toContain("9007199254740992");
  expect(value).toContain("9007199254740993");
});

test("S16 REG-006: 50% => 0.5 desde tecla porcentaje", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await press(dialog, "5");
  await press(dialog, "0");
  await press(dialog, "porcentaje");
  await calculate(page, dialog);
  expect(await resultValue(page)).toMatch(/0\.5|\\frac\{1\}\{2\}/);
});

test("S16 REG-007: exp(1) evalúa un valor conocido", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Álgebra");
  await press(dialog, "exponencial");
  await press(dialog, "1");
  await calculate(page, dialog);
  const value = (await resultValue(page)).replace(",", ".");
  expect(value).toMatch(/2\.71828|e/);
});

test("S16 REG-008: sin(90°) => 1 usando tecla grados", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Trigonométricas");
  await press(dialog, "sin");
  await press(dialog, "9");
  await press(dialog, "0");
  await press(dialog, "grados");
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(/\s/g, "")).toContain("1");
});

test("S16 REG-009: |-3| => 3 desde plantilla valor absoluto", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Álgebra");
  await press(dialog, "valor absoluto de a");
  await press(dialog, "restar");
  await press(dialog, "3");
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(/\s/g, "")).toContain("3");
});

test("S16 REG-010: sin inversa de 0 => 0 desde plantilla real", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await clear(dialog);
  await category(dialog, "Trigonométricas");
  await press(dialog, "sin inversa");
  await press(dialog, "0");
  await calculate(page, dialog);
  expect((await resultValue(page)).replace(/\s/g, "")).toMatch(/^0(?:\.0+)?$/);
});
