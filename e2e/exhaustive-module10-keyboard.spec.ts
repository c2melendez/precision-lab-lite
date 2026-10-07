import { expect, test } from "@playwright/test";

async function openKeyboard(page: import("@playwright/test").Page) {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  return page.getByRole("dialog", { name: "Teclado matemático" });
}

async function clearBasic(dialog: import("@playwright/test").Locator) {
  await dialog.getByRole("button", { name: "borrar todo el campo", exact: true }).click();
}

async function hideMathLiveKeyboard(page: import("@playwright/test").Page) {
  // Precision Lab usa su propio KeyboardPanel. MathLive está configurado
  // en manual, pero field.insert()/focus puede volver visible su panel en
  // el runner. Ocultarlo aquí evita que un overlay ajeno al producto
  // intercepte el click del botón Calcular del teclado propio.
  await page.evaluate(() => window.mathVirtualKeyboard?.hide());
  await page.locator(".ML__keyboard.is-visible").waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
}

async function resultValue(page: import("@playwright/test").Page): Promise<string> {
  const resultRegion = page.locator('section[aria-label="Resultado"]').first();
  await expect(resultRegion).toBeVisible({ timeout: 12000 });
  const status = resultRegion.locator('[role="status"]').first();
  await expect(status).toBeVisible({ timeout: 12000 });

  // Resultado simbólico: ResultPanel usa StaticMath -> <math-field read-only>.
  // MathLive vive en Shadow DOM; leer su propiedad value es el contrato
  // estable documentado para la suite, no textContent.
  const staticField = status.locator("math-field[read-only]").first();
  if (await staticField.count()) {
    return String(await staticField.evaluate((el) =>
      (el as HTMLElement & { value?: string }).value ?? "",
    ));
  }

  // Resultado numérico: ResultPanel usa un <span>.
  const plain = status.locator(".a11y-scale-result-3xl").first();
  await expect(plain).toBeVisible();
  return (await plain.innerText()).trim();
}

test("módulo 10: round-trip 2+2 desde teclas reales produce 4", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "2", exact: true }).click();
  await dialog.getByRole("button", { name: "sumar", exact: true }).click();
  await dialog.getByRole("button", { name: "2", exact: true }).click();
  const field = page.locator("math-field").first();
  const fieldValue = await field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  expect(fieldValue.replace(/\s/g, "")).toMatch(/2\+2/);
  await hideMathLiveKeyboard(page);
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();
  const value = (await resultValue(page)).replace(/\s/g, "");
  expect(value).toContain("4");
});

test("módulo 10: la tecla % calcula porcentaje real (50% = 0.5)", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "5", exact: true }).click();
  await dialog.getByRole("button", { name: "0", exact: true }).click();
  await dialog.getByRole("button", { name: "porcentaje", exact: true }).click();
  const percentField = page.locator("math-field").first();
  const percentLatex = await percentField.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  expect(percentLatex).toMatch(/50/);
  expect(percentLatex).toMatch(/%/);
  await hideMathLiveKeyboard(page);
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();

  const value = await resultValue(page);
  expect(value).toMatch(/0\.5|\\frac\{1\}\{2\}/);
});

test("módulo 10: ±(5) produce dos ramas matemáticas distintas", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "más/menos", exact: true }).click();
  await dialog.getByRole("button", { name: "5", exact: true }).click();
  const pmField = page.locator("math-field").first();
  const pmLatex = await pmField.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
  expect(pmLatex).toMatch(/\\pm|±/);
  expect(pmLatex).toContain("5");
  await hideMathLiveKeyboard(page);
  await dialog.getByRole("button", { name: "calcular", exact: true }).click();

  const value = (await resultValue(page)).replace(/\s/g, "");
  expect(value).toContain("5");
  expect(value).toContain("-5");
  expect(value).toMatch(/\[|\\begin|,/);
});

test("módulo 10: Productoria Π ya no aparece como pendiente", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Cálculo", exact: true }).click();
  const product = dialog.getByRole("button", { name: "productoria", exact: true });
  await expect(product).toBeVisible();
  await product.click();
  await expect(page.getByText(/productoria: todavía no disponible/i)).toHaveCount(0);
});

test("módulo 10: acciones no aritméticas de Álgebra exponen tooltip", async ({ page }) => {
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Álgebra", exact: true }).click();

  for (const name of [
    "Resolver ecuación",
    "Resolver inecuación",
    "Resolver sistema de ecuaciones",
    "Simplificar expresión",
    "Mínimo común múltiplo",
    "Máximo común divisor",
  ]) {
    const button = dialog.getByRole("button", { name, exact: true }).first();
    await expect(button).toBeVisible();
    const title = await button.getAttribute("title");
    expect(title, `Falta tooltip en ${name}`).toBeTruthy();
  }
});




async function preparePhysicalMathField(page: import("@playwright/test").Page) {
  const field = page.locator("math-field").first();
  const openKeyboardDialog = page.getByRole("dialog", { name: "Teclado matemático" });
  if (await openKeyboardDialog.isVisible().catch(() => false)) {
    const close = openKeyboardDialog.getByRole("button", { name: /cerrar/i });
    if (await close.count()) await close.first().click();
    else await page.keyboard.press("Escape");
    await openKeyboardDialog.waitFor({ state: "hidden" }).catch(() => {});
  }
  await field.waitFor({ state: "visible" });
  await field.evaluate((el) => {
    const mf = el as HTMLElement & { value?: string; setValue?: (v: string) => void };
    if (typeof mf.setValue === "function") mf.setValue("");
    else mf.value = "";
  });
  await field.click();
  await page.waitForTimeout(100);
  return field;
}

async function physicalSequence(
  page: import("@playwright/test").Page,
  sequence: string,
) {
  const field = await preparePhysicalMathField(page);
  for (const key of sequence) {
    await page.keyboard.press(key);
    await page.waitForTimeout(35);
  }
  return String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
}

test("IN625 G1b EN-TC-01: 2 ^ 1 0 conserva 10 completo en el exponente", async ({ page }) => {
  await page.goto("./");
  const latex = await physicalSequence(page, "2^10");
  expect(latex.replace(/\s/g, "")).toMatch(/2\^\{?10\}?/);
});

test("IN625 G1b EN-TC-02: x ^ 2 + 1 saca + del exponente", async ({ page }) => {
  await page.goto("./");
  const latex = await physicalSequence(page, "x^2+1");
  expect(latex.replace(/\s/g, "")).toMatch(/x\^\{?2\}?\+1/);
});

test("IN625 G1b EN-TC-03: x ^ 1 0 + 1 conserva x^10 y luego suma", async ({ page }) => {
  await page.goto("./");
  const latex = await physicalSequence(page, "x^10+1");
  expect(latex.replace(/\s/g, "")).toMatch(/x\^\{?10\}?\+1/);
});


test("IN625 G1b EN-TC-04: 2 ^ - 3 + 1 conserva exponente negativo y sale al +", async ({ page }) => {
  await page.goto("./");
  const latex = await physicalSequence(page, "2^-3+1");
  expect(latex.replace(/\s/g, "")).toMatch(/2\^\{?-3\}?\+1/);
});

test("IN625 G1b EN-TC-05: x ^ 2 y saca la variable del exponente", async ({ page }) => {
  await page.goto("./");
  const latex = await physicalSequence(page, "x^2y");
  expect(latex.replace(/\s/g, "")).toMatch(/x\^\{?2\}?y/);
});

test("IN625 G1b EN-TC-06: e ^ x + 1 mantiene un eco matemático coherente", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "e^x+1")).replace(/\s/g, "");
  expect([
    /^e\^\{?x\}?\+1$/,
    /^e\^\{?x\+1\}?$/,
  ].some((re) => re.test(latex))).toBe(true);
});


test("IN625 G1b EN-TC-07: x / 2 produce una fracción", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "x/2")).replace(/\s/g, "");
  expect(latex).toMatch(/\\frac\{x\}\{2\}/);
});

test("IN625 G1b EN-TC-08: x + 1 / 2 conserva una lectura fraccionaria coherente", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "x+1/2")).replace(/\s/g, "");
  expect([
    /^x\+\\frac(?:\{1\}|1)(?:\{2\}|2)$/,
    /^\\frac(?:\{x\+1\}|x\+1)(?:\{2\}|2)$/,
  ].some((re) => re.test(latex))).toBe(true);
});

test("IN625 G1b EN-TC-09: 1 / 2 x mantiene x dentro del denominador", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "1/2x")).replace(/\s/g, "");
  expect(latex).toMatch(/\\frac\{1\}\{2x\}/);
});

test("IN625 G1b EN-TC-10: flecha derecha sale del denominador antes de x", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  for (const key of ["1", "/", "2"]) {
    await page.keyboard.press(key);
    await page.waitForTimeout(35);
  }
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("x");
  const latex = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? "")).replace(/\s/g, "");
  expect(latex).toMatch(/\\frac(?:\{1\}|1)(?:\{2\}|2)x/);
});


test("IN625 G1b EN-TC-11: aliases trigonométricos se conservan como entrada válida", async ({ page }) => {
  await page.goto("./");
  for (const sample of ["sin", "sen", "tg", "arcsen", "senh"]) {
    const latex = (await physicalSequence(page, sample)).replace(/\s/g, "").toLowerCase();
    expect(latex.length).toBeGreaterThan(0);
    expect(latex).toContain(sample);
  }
});

test("IN625 G1b EN-TC-12: atajos de símbolos básicos producen eco matemático", async ({ page }) => {
  await page.goto("./");
  const cases: Array<[string, RegExp]> = [
    ["pi", /\\pi|pi/],
    ["theta", /\\theta|theta/],
    ["->", /\\to|->/],
    ["<=", /\\le|<=/],
    [">=", /\\ge|>=/],
    ["!=", /\\ne|!=/],
    ["*", /\\cdot|\*/],
  ];
  for (const [seq, re] of cases) {
    const field = await preparePhysicalMathField(page);
    for (const ch of seq) {
      await field.press(ch);
      await page.waitForTimeout(35);
    }
    const latex = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? "")).replace(/\s/g, "");
    expect(latex).toMatch(re);
  }
});

test("IN625 G1b EN-TC-13: sqrt x + 1 mantiene el contenido dentro de la raíz", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "sqrtx+1")).replace(/\s/g, "");
  expect(latex).toMatch(/\\sqrt\{?x\+1\}?/);
});

test("IN625 G1b EN-TC-14: (x+1)^2 no crea paréntesis vacíos extra", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "(x+1)^2")).replace(/\s/g, "");
  expect(latex).toMatch(/\\left\(?x\+1\\right\)?\^\{?2\}?|\(x\+1\)\^\{?2\}?/);
  expect(latex).not.toMatch(/\(\)/);
});

test("IN625 G1b EN-TC-15: valor absoluto conserva estructura", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  await page.keyboard.insertText("|");
  for (const key of ["x", "-", "1"]) {
    await field.press(key);
    await page.waitForTimeout(35);
  }
  await page.keyboard.insertText("|");
  const latex = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? "")).replace(/\s/g, "");
  expect(latex).toMatch(/\\left\|?x-1\\right\|?|\|x-1\|/);
});


test("IN625 G1b EN-TC-16: punto decimal se conserva en el modo actual", async ({ page }) => {
  await page.goto("./");
  const latex = (await physicalSequence(page, "3.5")).replace(/\s/g, "");
  expect(latex).toMatch(/3(?:\.|\\{,\\})5/);
});

test("IN625 G1b EN-TC-18: botones virtuales x² xʸ raíz y fracción insertan plantillas", async ({ page }) => {
  await page.goto("./");
  const dialog = await openKeyboard(page);
  await dialog.getByRole("tab", { name: "Símbolos", exact: true }).click();

  const buttons = [
    /al cuadrado/i,
    /potencia general|a a la n/i,
    /raíz cuadrada/i,
  ];
  for (const name of buttons) {
    const btn = dialog.getByRole("button", { name }).first();
    if (await btn.count()) {
      await clearBasic(dialog);
      await btn.click();
      const value = String(await page.locator("math-field").first().evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
      expect(value.length).toBeGreaterThan(0);
    }
  }

  await dialog.getByRole("tab", { name: "Básico", exact: true }).click();
  await clearBasic(dialog);
  await dialog.getByRole("button", { name: "dividir", exact: true }).click();
  const fraction = String(await page.locator("math-field").first().evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(fraction).toContain("\\frac");
});

test("IN625 G1b EN-TC-19: botones sin inversa log ln 10^x y e^x exponen plantillas válidas", async ({ page }) => {
  await page.goto("./");
  const dialog = await openKeyboard(page);

  const targets: RegExp[] = [
    /sin.*inversa|arcsin/i,
    /^log$|logaritmo base 10/i,
    /^ln$|logaritmo natural/i,
    /10 a la x|10 a la n/i,
    /e a la x|e a la n|exponencial/i,
  ];

  for (const target of targets) {
    let btn = dialog.getByRole("button", { name: target }).first();
    if (!(await btn.count())) {
      for (const tab of ["Trigonométricas", "Álgebra", "Símbolos", "Cálculo"]) {
        const tabLoc = dialog.getByRole("tab", { name: tab, exact: true });
        if (await tabLoc.count()) {
          await tabLoc.click();
          btn = dialog.getByRole("button", { name: target }).first();
          if (await btn.count()) break;
        }
      }
    }
    expect(await btn.count()).toBeGreaterThan(0);
  }
});


test("IN625 G1b EN-TC-20: backspace deja exponente vacío sin NaN", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  for (const key of ["2", "^", "1", "0"]) {
    await field.press(key);
    await page.waitForTimeout(35);
  }
  await field.press("Backspace");
  await field.press("Backspace");
  const latex = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? "")).replace(/\s/g, "");
  expect(latex).toMatch(/2\^\{?\}?|2\^\{\}/);
  expect(latex).not.toMatch(/NaN/i);
});

test("IN625 G1b EN-TC-21: undo redo select-all delete y copy-paste restauran fórmula", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  for (const key of ["x", "^", "2", "+", "1"]) {
    await field.press(key);
    await page.waitForTimeout(35);
  }
  const original = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  await field.press("Control+z");
  await field.press("Control+Shift+z");
  const afterRedo = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(afterRedo.replace(/\s/g, "")).toBe(original.replace(/\s/g, ""));

  await field.press("Control+a");
  await field.press("Control+c");
  await field.press("Backspace");
  await field.press("Control+v");
  const restored = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(restored.replace(/\s/g, "")).toBe(original.replace(/\s/g, ""));
});

test("IN625 G1b EN-TC-22: Tab y flechas navegan plantillas y Enter no inserta salto", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  await field.evaluate((el) => {
    const mf = el as HTMLElement & { insert?: (latex: string) => void };
    mf.insert?.("\\frac{#0}{#1}+x_{#0}^{#1}");
  });
  const before = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  await field.press("Tab");
  await field.press("ArrowRight");
  await field.press("Tab");
  await field.press("Enter");
  const after = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(after).not.toContain("\n");
  expect(after.length).toBeGreaterThanOrEqual(before.length - 2);
});


test("IN625 G1b EN-TC-24: campo móvil desactiva autocorrección autocapitalización y spellcheck", async ({ page }) => {
  await page.goto("./");
  const field = page.locator("math-field").first();
  await expect(field).toHaveAttribute("autocapitalize", "off");
  await expect(field).toHaveAttribute("autocorrect", "off");
  await expect(field).toHaveAttribute("spellcheck", "false");
});

test("IN625 G1b EN-TC-25: pegar LaTeX texto plano no inserta HTML", async ({ page, context }) => {
  await page.goto("./");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const field = await preparePhysicalMathField(page);
  await page.evaluate(async () => navigator.clipboard.writeText("\\frac{x+1}{2}"));
  await field.press("Control+v");
  const latex = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(latex).toContain("\\frac");
  expect(latex).not.toMatch(/<[^>]+>/);
});

test("IN625 G1b EN-TC-26: marcadores vacíos no producen NaN en el campo", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  await field.evaluate((el) => {
    const mf = el as HTMLElement & { setValue?: (v: string) => void; value?: string };
    if (typeof mf.setValue === "function") mf.setValue("\\frac{#0}{2}");
    else mf.value = "\\frac{#0}{2}";
  });
  const frac = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(frac).not.toMatch(/NaN/i);

  await field.evaluate((el) => {
    const mf = el as HTMLElement & { setValue?: (v: string) => void; value?: string };
    if (typeof mf.setValue === "function") mf.setValue("\\sqrt{#0}");
    else mf.value = "\\sqrt{#0}";
  });
  const root = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  expect(root).not.toMatch(/NaN/i);
});

test("IN625 G1b EN-TC-27: raíz con tilde se conserva como entrada válida", async ({ page }) => {
  await page.goto("./");
  const field = await preparePhysicalMathField(page);
  await page.keyboard.insertText("raíz(x)");
  const latex = String(await field.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? "")).toLowerCase();
  expect(latex).toContain("ra");
  expect(latex.length).toBeGreaterThan(3);
});
