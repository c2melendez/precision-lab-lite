import { expect, test } from "@playwright/test";
type Page = import("@playwright/test").Page;

async function setInput(page: Page, value: string) {
  const field = page.locator("math-field").first();
  await field.waitFor({ state: "visible" });
  await field.evaluate((el, v) => {
    const mf = el as HTMLElement & { setValue?: (value: string) => void; value?: string };
    if (typeof mf.setValue === "function") mf.setValue(String(v));
    else mf.value = String(v);
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: String(v) }));
  }, value);
  await page.waitForTimeout(120);
}

async function readOutcome(page: Page): Promise<{ kind: "result" | "error"; value: string }> {
  const region = page.locator('section[aria-label="Resultado"]').first();
  const alert = region.locator('[role="alert"]').first();
  const status = region.locator('[role="status"]').first();

  await expect.poll(async () => {
    if (await alert.count()) {
      const txt = ((await alert.textContent().catch(() => "")) ?? "").trim();
      if (txt) return "error";
    }
    if (await status.count()) {
      const txt = ((await status.textContent().catch(() => "")) ?? "").trim();
      if (txt && !/calculando/i.test(txt)) return "result";
    }
    return "pending";
  }, { timeout: 15000 }).not.toBe("pending");

  if (await alert.count()) {
    const txt = ((await alert.textContent().catch(() => "")) ?? "").trim();
    if (txt) return { kind: "error", value: txt };
  }

  const staticField = status.locator("math-field[read-only]").first();
  if (await staticField.count()) {
    const value = String(await staticField.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
    if (value.trim()) return { kind: "result", value };
  }

  const text = ((await status.textContent()) ?? "").trim();
  return { kind: "result", value: text };
}

async function submit(page: Page) {
  await page.evaluate(() => window.mathVirtualKeyboard?.hide());
  const button = page.getByRole("region", { name: "Entrada" }).getByRole("button", { name: "Calcular", exact: true });
  await expect(button).toBeEnabled();
  await button.click();
  return readOutcome(page);
}

async function roundTrip(page: Page, id: string, input: string) {
  await setInput(page, input);
  const first = await submit(page);
  expect(first.kind, id + " primera evaluación: " + first.value).toBe("result");
  expect(first.value.trim(), id + " salida vacía").not.toBe("");

  await setInput(page, first.value);
  const reinjected = await page.locator("math-field").first().evaluate((el) =>
    String((el as HTMLElement & { value?: string }).value ?? "")
  );
  const second = await submit(page);
  expect(second.kind, id + " S1=" + first.value + " REINJECTED=" + reinjected + " S2=" + second.value).toBe("result");
  return { s1: first.value, s2: second.value, reinjected };
}

test.describe("IN625 H1b reentrada estructural", () => {
  test("EN-RE-09 integral indefinida reingresa", async ({ page }) => {
    await page.goto("./");
    const r = await roundTrip(page, "EN-RE-09", "\\int\\frac{1}{x}\\,dx");
    expect(r.reinjected.length).toBeGreaterThan(0);
  });

  test("EN-RE-10 solución de ecuación reingresa", async ({ page }) => {
    await page.goto("./");
    const r = await roundTrip(page, "EN-RE-10", "x^{2}=4");
    expect(r.reinjected.length).toBeGreaterThan(0);
  });

  test("EN-RE-11 solución de sistema reingresa", async ({ page }) => {
    await page.goto("./");
    const r = await roundTrip(page, "EN-RE-11", "x+y=3,\\ x-y=1");
    expect(r.reinjected.length).toBeGreaterThan(0);
  });

  test("EN-RE-12 intervalo de inecuación reingresa", async ({ page }) => {
    await page.goto("./");
    const r = await roundTrip(page, "EN-RE-12", "x^{2}>4");
    expect(r.reinjected.length).toBeGreaterThan(0);
  });

  test("EN-RE-13 matriz inversa reingresa", async ({ page }) => {
    await page.goto("./");
    const r = await roundTrip(page, "EN-RE-13", "\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}^{-1}");
    expect(r.reinjected.length).toBeGreaterThan(0);
  });

  test("EN-RE-14 aproximación con approx no rompe el flujo", async ({ page }) => {
    await page.goto("./");
    await setInput(page, "\\approx0.333333333");
    const outcome = await submit(page);
    expect(outcome.value.trim()).not.toBe("");
    if (outcome.kind === "error") {
      expect(outcome.value).toMatch(/aprox|símbolo|inválid|interpret|expresión|carácter/i);
    }
  });

  test("EN-RE-15 notación científica reingresa", async ({ page }) => {
    await page.goto("./");
    await setInput(page, "1.267650600\\times10^{30}");
    const outcome = await submit(page);
    expect(outcome.kind, outcome.value).toBe("result");
  });

  test("EN-RE-16 agrupación con espacio fino reingresa", async ({ page }) => {
    await page.goto("./");
    await setInput(page, "1\\,234\\,567");
    const outcome = await submit(page);
    expect(outcome.kind, outcome.value).toBe("result");
    expect(outcome.value.replace(/[^0-9]/g, "")).toContain("1234567");
  });
});
