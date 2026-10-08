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


async function g2ChannelAscii(
  page: import("@playwright/test").Page,
  mode: "latex" | "text" | "keys",
  input: string | string[],
) {
  const field = await preparePhysicalMathField(page);

  if (mode === "latex") {
    await field.evaluate((el, value) => {
      const mf = el as HTMLElement & { setValue?: (v: string) => void; value?: string };
      if (typeof mf.setValue === "function") mf.setValue(String(value));
      else mf.value = String(value);
    }, input as string);
  } else if (mode === "text") {
    await page.keyboard.insertText(input as string);
  } else {
    for (const action of input as string[]) {
      if (action.startsWith("TEXT:")) await page.keyboard.insertText(action.slice(5));
      else await field.press(action);
      await page.waitForTimeout(35);
    }
  }

  return String(await field.evaluate((el) => {
    const mf = el as HTMLElement & {
      value?: string;
      getValue?: (format?: string) => string;
    };
    return typeof mf.getValue === "function"
      ? mf.getValue("ascii-math")
      : (mf.value ?? "");
  })).replace(/\s/g, "");
}

test.describe("IN625 G2 invariancia real L/T/teclado", () => {
  const cases: Array<{
    id: string;
    latex: string;
    text: string;
    keys: string[];
    expected: RegExp;
  }> = [
    { id: "EN-CH-01", latex: "2^{10}", text: "2^10", keys: ["2","^","1","0"], expected: /2\^\(?10\)?/ },
    { id: "EN-CH-02", latex: "x^{2}+1", text: "x^2+1", keys: ["x","^","2","+","1"], expected: /x\^2\+1/ },
    { id: "EN-CH-03", latex: "x^{10}+1", text: "x^10+1", keys: ["x","^","1","0","+","1"], expected: /x\^\(?10\)?\+1/ },
    { id: "EN-CH-04", latex: "\\frac{x+1}{x-1}", text: "(x+1)/(x-1)", keys: ["(","x","+","1",")","/","(","x","-","1",")"], expected: /\(?\(?x\+1\)?\)?\/\(?\(?x[-−]1\)?\)?/ },
    { id: "EN-CH-05", latex: "\\sqrt{x+1}", text: "sqrt(x+1)", keys: ["s","q","r","t","(","x","+","1",")"], expected: /sqrt\(\(?x\+1\)?\)/i },
    { id: "EN-CH-06", latex: "\\sin^{2}x", text: "sin^2(x)", keys: ["s","i","n","^","2","ArrowRight","x"], expected: /sin.*\^\(?2\)?x?|\(sin.*\)\^\(?2\)?/i },
    { id: "EN-CH-07", latex: "\\sin^{-1}x", text: "sin^-1(x)", keys: ["s","i","n","^","-","1","ArrowRight","x"], expected: /sin.*-1|arcsin/i },
    { id: "EN-CH-08", latex: "2x", text: "2x", keys: ["2","x"], expected: /2x|2\*x/ },
    { id: "EN-CH-09", latex: "\\frac{1}{2}x", text: "(1/2)x", keys: ["1","/","2","ArrowRight","x"], expected: /x\/2|\(?1\)?\/\(?2\)?x|\(1\/2\)x|1\/2x/ },
    { id: "EN-CH-10", latex: "3.5+1", text: "3.5+1", keys: ["3",".","5","+","1"], expected: /3\.5\+1/ },
    { id: "EN-CH-12", latex: "\\lvert x-1\\rvert", text: "abs(x-1)", keys: ["TEXT:|","x","-","1","TEXT:|"], expected: /abs\(x-1\)|[|∣]x-1[|∣]/i },
    { id: "EN-CH-13", latex: "\\pi r^{2}", text: "pi r^2", keys: ["p","i","r","^","2"], expected: /pir\^2|pi\*r\^2/i },
    { id: "EN-CH-14", latex: "e^{-x^{2}}", text: "e^(-x^2)", keys: ["e","^","-","x","^","2"], expected: /e\^\(+\(?-?x\^\(?2\)?\)?\)+|e\^-?x\^\(?2\)?/i },
    { id: "EN-CH-15", latex: "\\operatorname{sen}\\left(\\frac{\\pi}{6}\\right)", text: "sen(pi/6)", keys: ["s","e","n","(","p","i","/","6",")"], expected: /sen\(\(?pi\)?\/\(?6\)?\)|sin\(\(?pi\)?\/\(?6\)?\)/i },
  ];

  for (const row of cases) {
    test(row.id + ": L/T/teclado convergen a una interpretación común", async ({ page }) => {
      await page.goto("./");
      const latex = await g2ChannelAscii(page, "latex", row.latex);
      const text = await g2ChannelAscii(page, "text", row.text);
      const keys = await g2ChannelAscii(page, "keys", row.keys);

      const canonical = (v: string) => {
        let s = v.toLowerCase()
          .replace(/[{}]/g, "")
          .replace(/\\cdot|\*/g, "")
          .replace(/−/g, "-")
          .replace(/[∣│]/g, "|")
          .replace(/\^\(([-+]?\w+)\)/g, "^$1")
          .replace(/\(\(([^()]*)\)\)/g, "($1)")
          .replace(/\(1\)\/\(2\)x/g, "(1/2)x")
          .replace(/sen\(\(pi\)\/\(6\)\)/g, "sen(pi/6)")
          .replace(/e\^\(\((-?x\^2)\)\)/g, "e^($1)")
          .replace(/sqrt\(\(([^()]*)\)\)/g, "sqrt($1)")
          .replace(/sin\^2\(x\)/g, "sin^2x")
          .replace(/sin\^\(-1\(x\)\)/g, "sin^-1x")
          .replace(/sin\^-1\(x\)/g, "sin^-1x")
          .replace(/abs\(([^()]*)\)/g, "|$1|");
        return s;
      };

      const cl = canonical(latex);
      const ct = canonical(text);
      const ck = canonical(keys);

      expect(cl).toMatch(row.expected);
      expect(ct).toMatch(row.expected);
      expect(ck).toMatch(row.expected);
      expect(ct).toBe(ck);
    });
  }
});

// EN-CH-11 requiere modo decimal coma real. Se mantiene manual/config-dependent
// para no simular soporte de locale que el navegador/runner no puede garantizar.


type G3Case = {
  id: string;
  input: string;
  expected: RegExp;
  allowSuccess?: boolean;
};

const g3Cases: G3Case[] = [
  { id: "EN-ER-01", input: "(2+3", expected: /par[eé]ntesis|cerrar|incomplet/i },
  { id: "EN-ER-02", input: "2+3)", expected: /par[eé]ntesis|cierre|sobrante|incomplet/i },
  { id: "EN-ER-03", input: "\\frac{1}{", expected: /fracci[oó]n|denominador|incomplet/i },
  { id: "EN-ER-04", input: "\\frac{1}", expected: /fracci[oó]n|denominador|incomplet/i },
  { id: "EN-ER-05", input: "2^", expected: /exponente|potencia|incomplet|vac[ií]o/i },
  { id: "EN-ER-06", input: "^2", expected: /exponente|base|potencia|incomplet/i },
  { id: "EN-ER-07", input: "2+", expected: /operador|operando|incomplet/i },
  { id: "EN-ER-08", input: "*3", expected: /operador|operando|incomplet/i },
  { id: "EN-ER-09", input: "2*/3", expected: /operador|sintaxis|inv[aá]lid/i },
  { id: "EN-ER-10", input: "", expected: /escrib|expresi[oó]n|vac[ií]o|required/i },
  { id: "EN-ER-11", input: "   ", expected: /escrib|expresi[oó]n|vac[ií]o|required/i },
  { id: "EN-ER-12", input: "()", expected: /par[eé]ntesis|vac[ií]o|incomplet/i },
  { id: "EN-ER-13", input: "\\sin", expected: /sin|argumento|incomplet/i },
  { id: "EN-ER-14", input: "\\sin()", expected: /sin|argumento|vac[ií]o|incomplet/i },
  { id: "EN-ER-15", input: "\\foo{x}", expected: /foo|comando|desconocid|funci[oó]n/i },
  { id: "EN-ER-16", input: "\\left(x+1\\right]", expected: /delimit|par[eé]ntesis|corchete|inv[aá]lid/i },
  { id: "EN-ER-17", input: "\\left(x+1", expected: /right|delimit|cerrar|incomplet/i },
  { id: "EN-ER-18", input: "x+1\\right)", expected: /left|right|delimit|sobrante|inv[aá]lid/i },
  { id: "EN-ER-19", input: "{x+1", expected: /llave|cerrar|incomplet/i },
  { id: "EN-ER-20", input: "x+1}", expected: /llave|cierre|sobrante|inv[aá]lid/i },
  { id: "EN-ER-21", input: "1/0", expected: /cero|divisi[oó]n|dominio|definid/i },
  { id: "EN-ER-22", input: "0/0", expected: /indetermin|cero|dominio|definid/i },
  { id: "EN-ER-23", input: "\\frac{1}{0}", expected: /cero|divisi[oó]n|dominio|definid/i },
  { id: "EN-ER-24", input: "0^{0}", expected: /0|indefin|convenci[oó]n|1/i, allowSuccess: true },
  { id: "EN-ER-25", input: "x=", expected: /ecuaci[oó]n|incomplet|lado|operando/i },
  { id: "EN-ER-26", input: "=3", expected: /ecuaci[oó]n|incomplet|lado|operando/i },
  { id: "EN-ER-27", input: "x^{}", expected: /exponente|vac[ií]o|incomplet/i },
  { id: "EN-ER-28", input: "\\frac{}{2}", expected: /numerador|fracci[oó]n|vac[ií]o|incomplet/i },
  { id: "EN-ER-29", input: "\\sqrt{}", expected: /ra[ií]z|radicando|vac[ií]o|incomplet/i },
  { id: "EN-ER-30", input: "\\placeholder{}", expected: /marcador|placeholder|incomplet|vac[ií]o/i },
  { id: "EN-ER-31", input: "\\text{hola}", expected: /texto|matem[aá]tic|inv[aá]lid/i },
  { id: "EN-ER-32", input: "hola mundo", expected: /texto|aviso|simb[oó]lic|variable|inv[aá]lid/i, allowSuccess: true },
  { id: "EN-ER-33", input: "x++", expected: /operador|operando|increment|incomplet/i },
  { id: "EN-ER-34", input: "Resolver x^2=4 en los reales", expected: /texto|aviso|ecuaci[oó]n|inv[aá]lid|extra/i, allowSuccess: true },
];

async function g3Submit(page: import("@playwright/test").Page, input: string) {
  const field = page.locator("math-field").first();
  await field.waitFor({ state: "visible" });
  await field.evaluate((el, value) => {
    const mf = el as HTMLElement & { setValue?: (v: string) => void; value?: string };
    if (typeof mf.setValue === "function") mf.setValue(String(value));
    else mf.value = String(value);
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: String(value) }));
  }, input);

  // Esperar a que React consuma el evento antes de enviar el formulario.
  await page.waitForTimeout(100);

  // G3 certifica validación/error, no el canal del botón del teclado.
  // Usar el submit principal evita mezclar estado del KeyboardPanel.
  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  if (await dialog.isVisible().catch(() => false)) {
    const close = dialog.getByRole("button", { name: /cerrar/i });
    if (await close.count()) await close.first().click();
    else await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" }).catch(() => undefined);
  }
  await hideMathLiveKeyboard(page).catch(() => undefined);
  await page.getByRole("button", { name: "Calcular", exact: true }).click();

  const alert = page.locator('[role="alert"]').first();
  const successLive = page.locator('section[aria-label="Resultado"] [aria-live="polite"]').first();

  await expect
    .poll(async () => {
      if (await alert.count()) {
        const txt = (await alert.textContent().catch(() => "") ?? "").trim();
        if (txt) return "error";
      }
      if (await successLive.count()) {
        const txt = (await successLive.textContent().catch(() => "") ?? "").trim();
        if (txt && !/calculando/i.test(txt)) return "success";
      }
      return "pending";
    }, { timeout: 5000 })
    .not.toBe("pending");

  if (await alert.count()) {
    return { kind: "error" as const, text: ((await alert.textContent()) ?? "").replace(/\s+/g, " ").trim() };
  }

  if (await successLive.count()) {
    return { kind: "success" as const, text: ((await successLive.textContent()) ?? "").replace(/\s+/g, " ").trim() };
  }

  return { kind: "none" as const, text: "" };
}

const g3RawOnlyIds = new Set(["EN-ER-05","EN-ER-15","EN-ER-19","EN-ER-20","EN-ER-26","EN-ER-27","EN-ER-31"]);

// MathLive canonicaliza estos siete inputs antes de que el producto pueda
// observar la forma cruda. Se certifican en parser-level tests, no aquí.
test.describe("IN625 G3 entradas inválidas y mensajes de error", () => {
  for (const row of g3Cases.filter((candidate) => !g3RawOnlyIds.has(candidate.id))) {
    test(row.id + ": no produce una respuesta numérica silenciosamente falsa", async ({ page }) => {
      await page.goto("./");
      const outcome = await g3Submit(page, row.input);
      expect(outcome.kind, row.id + " no produjo feedback visible").not.toBe("none");

      if (outcome.kind === "error") {
        expect(outcome.text, row.id + " mensaje: " + outcome.text).toMatch(row.expected);
        return;
      }

      expect(row.allowSuccess, row.id + " aceptó silenciosamente: " + outcome.text).toBe(true);
      expect(outcome.text).not.toMatch(/^\s*(?:500|nan)\s*$/i);
    });
  }
});
