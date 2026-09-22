import { expect, test } from "@playwright/test";

async function openCalculus(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  await page.getByRole("tab", { name: "Cálculo", exact: true }).click();
}

async function setExpression(page: import("@playwright/test").Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.focus();
  // MathLive 0.110 actualiza el custom element de forma asíncrona.
  // Esperar un turno tras el foco garantiza que NaturalInput ya registró
  // su listener "input" antes de la inyección del valor del centinela.
  await page.waitForTimeout(100);
  await field.evaluate(async (node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
    // React y MathLive pueden consumir el primer evento en turnos distintos
    // bajo carga del runner. Dos frames permiten que el listener/estado se
    // estabilice; un segundo input conserva la misma expresión y elimina
    // la carrera sin alterar el producto.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  }, value);
  await expect.poll(
    async () => field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? "")),
    { timeout: 10000 },
  ).toBe(value);
}

async function calculateExpression(page: import("@playwright/test").Page, value: string) {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  await setExpression(page, value);

  // El foco del math-field abre deliberadamente el teclado propio. Para M3
  // no necesitamos certificar aquí la tecla Enter del teclado (eso ya lo
  // cubre M10): necesitamos una barrera observable de que React consumió
  // el último evento input antes de calcular.
  const keyboardDialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboardDialog).toBeVisible({ timeout: 10000 });
  await page.evaluate(() => window.mathVirtualKeyboard?.hide());
  await page.locator(".ML__keyboard.is-visible").waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);

  // Cerrar el bottom-sheet deja accesible el botón de pantalla también en
  // móvil. En layout split ese botón depende de `latex.trim()`: esperar a
  // que esté habilitado prueba directamente que el estado React ya contiene
  // la expresión inyectada, no solo que math-field.value fue actualizado.
  await keyboardDialog.getByRole("button", { name: "Cerrar teclado" }).click();
  await expect(keyboardDialog).toBeHidden({ timeout: 10000 });

  const inputRegion = page.locator('section[aria-label="Entrada"]').first();
  const calculate = inputRegion.getByRole("button", { name: "Calcular", exact: true });
  await expect(calculate).toBeVisible({ timeout: 10000 });
  await expect(calculate).toBeEnabled({ timeout: 10000 });
  await calculate.click();
}

test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
  await openCalculus(page);

  for (const name of [
    "integral indefinida",
    "integral definida",
    "sumatoria",
    "derivada",
    "derivada segunda",
    "límite",
    "límite al infinito",
    "límite lateral (edita + o - en el exponente)",
  ]) {
    await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /derivada de orden n/i }).first()).toBeVisible();

  const product = page.getByRole("button", { name: "productoria", exact: true }).first();
  await expect(product).toBeVisible();
  await product.click();
  await expect(page.getByText(/productoria: todavía no disponible/i)).toHaveCount(0);
});

async function renderedResultValue(page: import("@playwright/test").Page): Promise<string> {
  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  await expect(resultRegion).toBeVisible({ timeout: 20000 });
  const status = resultRegion.locator('[role="status"]').first();
  await expect(status).toBeVisible({ timeout: 20000 });
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

test("suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI", async ({ page }) => {
  await calculateExpression(page, "\\prod_{i=1}^{5}i");
  expect((await renderedResultValue(page)).replace(/\\s/g, "")).toContain("120");
});

test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
  await calculateExpression(page, "\\sum_{i=1}^{5}i");
  expect((await renderedResultValue(page)).replace(/\\s/g, "")).toContain("15");
});
