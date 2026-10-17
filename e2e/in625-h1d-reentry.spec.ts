import { expect, test } from "@playwright/test";
type Page=import("@playwright/test").Page;

async function setInput(page:Page,value:string){
  const field=page.locator('math-field[aria-label="Entrada matemática"]').first();
  await field.waitFor({state:"visible"});
  // La suite ejercita la API publica de MathLive, pero no debe simular
  // el evento 'input' de manera que provoque un render reentrante antes
  // de que MathLive complete su propia transaccion de setValue().
  await field.evaluate((el,v)=>{
    const mf=el as HTMLElement&{setValue?:(x:string,options?:{silenceNotifications?:boolean})=>void;value?:string};
    if(typeof mf.setValue==="function")mf.setValue(String(v),{silenceNotifications:true});
    else mf.value=String(v);
  },value);
  // Emitir 'input' en un turno posterior, nunca dentro de setValue().
  await field.dispatchEvent("input",{bubbles:true,inputType:"insertReplacementText",data:value});
  await expect.poll(async()=>field.evaluate(el=>(el as HTMLElement&{value?:string}).value??""),{
    timeout:5000,message:"MathLive debe conservar la expresion confirmada a React"
  }).toBe(value);
}

async function readOutcome(page: Page): Promise<{kind:"result"|"error"; value:string}> {
  const region=page.locator('section[aria-label="Resultado"]').first();
  const alert=region.locator('[role="alert"]').first();
  const status=region.locator('[role="status"]').first();

  await expect.poll(async()=>{
    if(await alert.count()){
      const t=((await alert.textContent().catch(()=> ""))??"").trim();
      if(t) return "error";
    }
    if(await status.count()){
      const t=((await status.textContent().catch(()=> ""))??"").trim();
      if(t&&!/calculando/i.test(t)) return "result";
    }
    return "pending";
  },{timeout:15000}).not.toBe("pending");

  if(await alert.count()){
    const t=((await alert.textContent().catch(()=> ""))??"").trim();
    if(t) return {kind:"error",value:t};
  }

  // La vista decimal puede llevar el indicador de truncamiento '…'.
  // Reingresar exclusivamente la representacion canonica del resultado.
  const canonicalReentry=await status.getAttribute("data-result-reentry-latex").catch(()=>null);
  if(canonicalReentry?.trim())return {kind:"result",value:canonicalReentry};
  const exact=region.locator('math-field[read-only]').first();
  if(await exact.count()){
    const v=String(await exact.evaluate(el=>(el as HTMLElement&{value?:string}).value??""));
    if(v.trim()) return {kind:"result",value:v};
  }

  const plain=region.locator('.a11y-scale-result-3xl').first();
  if(await plain.count()){
    const t=((await plain.textContent())??"").trim();
    if(t) return {kind:"result",value:t};
  }

  return {kind:"result",value:((await status.textContent())??"").trim()};
}

async function submit(page:Page){
  await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
  const button=page.getByRole("region",{name:"Entrada"}).getByRole("button",{name:"Calcular",exact:true});
  await expect(button).toBeEnabled();
  const region=page.locator('section[aria-label="Resultado"]').first();
  const previousStatus=region.locator('[role="status"]').first();
  const before=await previousStatus.count() ? await previousStatus.getAttribute("data-result-request-id") : null;
  const currentInput=await page.locator('math-field[aria-label="Entrada matemática"]').first().evaluate(el=>(el as HTMLElement&{value?:string}).value??"");
  if(currentInput==="2+3" || currentInput.includes("\\frac{1}{2}+\\frac{1}{3}")){
    console.log("IN625_H1D_TRANSITION_BEFORE",JSON.stringify({currentInput,before}));
  }
  await button.click();
  const afterClickInput=await page.locator('math-field[aria-label="Entrada matemática"]').first().evaluate(el=>(el as HTMLElement&{value?:string}).value??"");
  if(currentInput.includes("\\frac{1}{2}+\\frac{1}{3}")){
    console.log("IN625_H1D_TRANSITION_AFTER_CLICK",JSON.stringify({before:currentInput,afterClickInput}));
    expect(afterClickInput,"El click Calcular no debe reemplazar la expresión con el resultado anterior").toBe(currentInput);
  }
  await expect.poll(async()=>{
    const alert=region.locator('[role="alert"]').first();
    if(await alert.count() && (await alert.textContent())?.trim())return "error";
    const status=region.locator('[role="status"]').first();
    const requestId=await status.getAttribute("data-result-request-id").catch(()=>null);
    return requestId && requestId!==before ? "new-result" : "pending";
  },{timeout:15000,message:"Esperar respuesta de la nueva solicitud"}).not.toBe("pending");
  return readOutcome(page);
}
function canonical(v:string){
  return v.replace(/\\left|\\right|\\,/g,"").replace(/\\cdot/g,"").replace(/\s+/g,"").replace(/\{\}/g,"");
}
async function evaluateOnce(page:Page,input:string){
  await setInput(page,input);
  const out=await submit(page);
  expect(out.kind,input+" -> "+out.value).toBe("result");
  expect(out.value.trim()).not.toBe("");
  return out.value;
}

const TRIPLE_INPUTS=[
  "2+3",
  "\\frac{1}{2}+\\frac{1}{3}",
  "2^{10}",
  "\\sqrt{8}",
  "\\sin\\left(\\frac{\\pi}{6}\\right)",
  "\\cos\\left(\\frac{\\pi}{3}\\right)",
  "\\tan\\left(\\frac{\\pi}{4}\\right)",
  "e^{x}",
  "\\ln\\left(x\\right)",
  "x^{2}+2x+1",
  "(x+1)^{3}",
  "3x+2x",
  "\\sqrt{2}/2",
  "\\frac{3}{4}",
  "10^{-3}",
  "\\operatorname{sen}\\left(\\frac{\\pi}{6}\\right)",
  "C+1",
  "C_{1}+1",
  "1.267650600\\times10^{30}",
  "1\\,234\\,567",
];

test.describe("IN625 H1d reentrada avanzada",()=>{
  test("EN-RE-24 idempotencia triple sobre 20 entradas",async({page})=>{
    test.setTimeout(120000);
    page.on("console",message=>{if(message.text().startsWith("IN625_H1D_ENGINE_") || message.text().startsWith("IN625_H1D_CALCULATE_ENTRY"))console.log(message.text());});
    await page.goto("./");
    for(const input of TRIPLE_INPUTS){
      const s1=await evaluateOnce(page,input);
      const s2=await evaluateOnce(page,s1);
      const s3=await evaluateOnce(page,s2);
      expect(canonical(s2),"S1="+s1+" S2="+s2+" input="+input).toBe(canonical(s1));
      expect(canonical(s3),"S2="+s2+" S3="+s3+" input="+input).toBe(canonical(s2));
      expect(s3).not.toMatch(/1\\cdot1\\cdot|\+0(?:$|[^0-9])/);
    }
  });

  test("EN-RE-25 equivalencia semántica en muestra de 20",async({page})=>{
    test.setTimeout(120000);
    await page.goto("./");
    for(const input of TRIPLE_INPUTS){
      // El panel puede conservar transitoriamente el resultado anterior.
      // En casos con oráculo independiente, esperar a que aparezca el valor esperado
      // antes de aceptar la lectura de la primera evaluación.
      const expectedInput:Record<string,RegExp>={
        "2+3":/^5(?:\.0+)?$/,
        "\\frac{1}{2}+\\frac{1}{3}":/^(?:\\frac\{5\}\{6\}|0\.83{1,2}3*)$/i,
        "2^{10}":/^1024(?:\.0+)?$/,
        "\\frac{3}{4}":/^(?:\\frac\{3\}\{4\}|0\.75)$/,
        "10^{-3}":/^(?:\\frac\{1\}\{1000\}|0\.001)$/,
      };
      let s1=await evaluateOnce(page,input);
      // El oraculo verifica la forma canonica (fraccion exacta) y no
      // el decimal abreviado con '…' presentado visualmente.
      const anchor=expectedInput[input];
      if(anchor && !anchor.test(canonical(s1))){
        // Diagnóstico acotado: preservar evidencia de MathLive, salida y solicitud.
        // No inferir un fallo del motor a partir de un valor viejo o mal extraído.
        const snapshot=await page.evaluate(()=>{
          const field=document.querySelector("math-field") as (HTMLElement&{value?:string})|null;
          const region=document.querySelector('section[aria-label="Resultado"]');
          const status=region?.querySelector('[role="status"]');
          const exact=region?.querySelector('math-field[read-only]') as (HTMLElement&{value?:string})|null;
          return {inputValue:field?.value??null, statusId:status?.getAttribute("data-result-request-id")??null, statusText:status?.textContent?.trim().slice(0,220)??null, exactValue:exact?.value??null};
        });
        console.log("IN625_H1D_EN_RE_25_DIAGNOSTIC",JSON.stringify({input,firstOutcome:s1,snapshot}));
        // Aislar el comportamiento sin el historial acumulado del test.
        const isolated=await page.context().newPage();
        try {
          await isolated.goto("./");
          const fresh=await evaluateOnce(isolated,input);
          console.log("IN625_H1D_EN_RE_25_FRESH_PAGE",JSON.stringify({input,fresh}));
        } finally {
          await isolated.close();
        }
        const region=page.locator('section[aria-label="Resultado"]').first();
        await expect.poll(async()=>{
          const status=region.locator('[role="status"]').first();
          const exact=await status.getAttribute("data-result-reentry-latex").catch(()=>null);
          if(exact?.trim())return canonical(exact);
          const field=region.locator('math-field[read-only]').first();
          if(await field.count()){
            const v=String(await field.evaluate(el=>(el as HTMLElement&{value?:string}).value??""));
            if(v.trim())return canonical(v);
          }
          const plain=region.locator('.a11y-scale-result-3xl').first();
          return canonical(((await plain.textContent().catch(()=>""))??"").trim());
        },{timeout:15000,message:"Esperar resultado nuevo para "+input}).toMatch(anchor);
        s1=(await readOutcome(page)).value;
      }
      const s2=await evaluateOnce(page,s1);
      expect(s2.trim(),"reentrada vacía para "+input).not.toBe("");
      expect(canonical(s2),"reentrada estable para "+input).toBe(canonical(s1));
      // Comprobar puntos de referencia independientes para resultados numéricos.
      // No declarar equivalencia semántica universal basándose solo en salida no vacía.
      const anchors:Record<string,RegExp>={
        "2+3":/^5(?:\.0+)?$/,
        "\\frac{1}{2}+\\frac{1}{3}":/^(?:\\frac\{5\}\{6\}|0\.83{1,2}3*)$/i,
        "2^{10}":/^1024(?:\.0+)?$/,
        "\\frac{3}{4}":/^(?:\\frac\{3\}\{4\}|0\.75)$/,
        "10^{-3}":/^(?:\\frac\{1\}\{1000\}|0\.001)$/,
      };
      const expected=anchors[input];
      if(expected){
        expect(canonical(s1),"referencia inicial "+input).toMatch(expected);
        expect(canonical(s2),"referencia tras reentrada "+input).toMatch(expected);
      }
    }
  });

  test("EN-RE-26 formatos cruzados Lite/Plus son aceptados",async({page})=>{
    await page.goto("./");
    const foreign=[
      "\\ln\\left(x\\right)",
      "2\\sqrt{2}",
      "\\operatorname{asin}{\\left(\\frac{1}{2}\\right)}",
      "\\operatorname{atan}{\\left(1\\right)}",
      "\\begin{pmatrix}-2&1\\\\\\frac{3}{2}&-\\frac{1}{2}\\end{pmatrix}",
      "\\left(-\\infty,-2\\right)\\cup\\left(2,\\infty\\right)"
    ];
    for(const input of foreign){
      const out=await evaluateOnce(page,input);
      expect(out.trim()).not.toBe("");
    }
  });

  test("EN-RE-27 operatorname asin/atan reingresan",async({page})=>{
    await page.goto("./");
    const a=await evaluateOnce(page,"\\operatorname{asin}{\\left(\\frac{1}{2}\\right)}");
    expect(a.toLowerCase()).toMatch(/pi|asin|arcsin|0\.523|frac/);
    const a2=await evaluateOnce(page,a);
    const b=await evaluateOnce(page,"\\operatorname{atan}{\\left(1\\right)}");
    expect(b.toLowerCase()).toMatch(/pi|atan|arctan|0\.785|frac/);
    const b2=await evaluateOnce(page,b);
    expect(canonical(a2),"asin: salida inicial y reentrada").toBe(canonical(a));
    expect(canonical(b2),"atan: salida inicial y reentrada").toBe(canonical(b));
  });

  test("EN-RE-28 piecewise reingresa y preserva casos",async({page})=>{
    await page.goto("./");
    const input="\\begin{cases}x^{2}&x<0\\\\x&x\\geq0\\end{cases}";
    const s1=await evaluateOnce(page,input);
    expect(s1).toMatch(/cases|x/);
    const s2=await evaluateOnce(page,s1);
    expect(s2).toMatch(/cases|x/);
  });
});

// Syntax309 SY-P-23: UI must disclose the ambiguous ungrouped input, not silently assign b*c.
test("SY-P-23 muestra advertencia accesible sin modificar expresiones seguras", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  await setInput(page, String.raw`\\frac{a}{bc}`);
  await expect(warning).toBeVisible();
  await expect(warning).toContainText("(a/b)*c");
  await expect(warning).toContainText("a/(b*c)");
  await setInput(page, "2+3");
  await expect(warning).toHaveCount(0);
});

// SY-P-23: show guidance only for ambiguous bare division, never for explicit grouping.
test("SY-P-23 no advierte en agrupaciones explícitas ni expresiones no relacionadas", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  for (const input of ["(a/b)*c", "a/(b*c)", "2+3"]) {
    await setInput(page, input);
    await expect(warning, input).toHaveCount(0);
  }
  await setInput(page, "a/bc");
  await expect(warning).toBeVisible();
});

// SY-P-23: the advisory is informational; it must never rewrite the user's MathLive value.
test("SY-P-23 preserva la entrada original al mostrar la advertencia", async ({ page }) => {
  await page.goto("./");
  const value = String.raw`\frac{a}{bc}`;
  await setInput(page, value);
  await expect(page.getByRole("status", { name: "Convención de división ambigua" })).toBeVisible();
  const actual = await page.locator("math-field").first().evaluate(el => (el as HTMLElement & { value?: string }).value ?? "");
  expect(actual.replace(/\s+/g, ""), "La advertencia no debe reescribir a/bc como a/(b*c)").toBe(value);
});

// SY-P-23: MathLive editing must dismiss and restore the advisory without changing bc into b*c.
test("SY-P-23 transición de entrada ambigua a agrupación explícita y vuelta", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  await setInput(page, "a/bc");
  await expect(warning).toBeVisible();
  await setInput(page, "a/(b*c)");
  await expect(warning).toHaveCount(0);
  await setInput(page, String.raw`\frac{a}{bc}`);
  await expect(warning).toBeVisible();
  await setInput(page, "(a/b)*c");
  await expect(warning).toHaveCount(0);
});

test("SY-P-23 advierte explícitamente sobre identificador compuesto bc sin reescribirlo", async ({ page }) => {
  await page.goto("./");
  await setInput(page, "a/bc");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  await expect(warning).toContainText("bc es una única variable");
  const input = page.locator("math-field").first();
  await expect.poll(async () => input.evaluate(el => (el as HTMLElement & {value?: string}).value ?? "")).toBe("a/bc");
  await setInput(page, "a/(b*c)");
  await expect(warning).toHaveCount(0);
});

test("SY-P-23 canal UI a resultado: agrupaciones numéricas explícitas", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  for (const [expression, expected] of [["(12/3)*2", "8"], ["12/(3*2)", "2"]] as const) {
    await setInput(page, expression);
    await expect(warning).toHaveCount(0);
    const actual = await submit(page);
    expect(actual.kind, expression).toBe("result");
    expect(canonical(actual.value), expression + " => " + actual.value).toContain(expected);
  }
});

test("SY-P-23 UI: agrupaciones decimales explícitas conservan valor", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  for (const [expression, decimal, exact] of [
    ["(9/3)*2.5", "7.5", String.raw`\frac{15}{2}`],
    ["9/(3*2.5)", "1.2", String.raw`\frac{6}{5}`],
  ] as const) {
    await setInput(page, expression);
    await expect(warning).toHaveCount(0);
    const outcome = await submit(page);
    expect(outcome.kind, expression).toBe("result");
    const value = canonical(outcome.value);
    const decimalPattern = new RegExp("^" + decimal.replace(".", "\\.") + "(?:\\.0+)?$");
    expect(decimalPattern.test(value) || value === exact,
      expression + " => " + outcome.value + " must equal " + decimal).toBe(true);
  }
});

test("SY-P-23 UI: valores decimales con paréntesis redundantes", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  for (const [expression, decimal, exact] of [
    ["((9)/(3*2.5))", "1.2", String.raw`\frac{6}{5}`],
    ["(((9)/(3)))*2.5", "7.5", String.raw`\frac{15}{2}`],
  ] as const) {
    await setInput(page, expression);
    await expect(warning).toHaveCount(0);
    const result = await submit(page);
    expect(result.kind, expression).toBe("result");
    const value = canonical(result.value);
    const pattern = new RegExp("^" + decimal.replace(".", "\\.") + "(?:\\.0+)?$");
    expect(pattern.test(value) || value === exact, expression + " => " + result.value).toBe(true);
  }
});


test("SY-P-23 Lite: fracciones numéricas LaTeX parentetizadas mantienen agrupación explícita", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  for (const [expression, expected] of [
    [String.raw`(\frac{12}{3})*2`, "8"],
    [String.raw`(\frac{12}{3*2})`, "2"],
  ] as const) {
    await setInput(page, expression);
    await expect(warning, expression).toHaveCount(0);
    const outcome = await submit(page);
    expect(outcome.kind, expression).toBe("result");
    expect(canonical(outcome.value), expression).toMatch(new RegExp("^" + expected + "(?:\\.0+)?$"));
  }
});


test("SY-P-23 Lite: aviso en entradas ambiguas parentetizadas sin alterar MathLive", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  for (const expression of ["(a/bc)", "((a/bc))", String.raw`(\frac{a}{bc})`]) {
    await setInput(page, expression);
    await expect(warning, expression).toBeVisible();
    await expect(warning).toContainText("(a/b)*c");
    await expect(warning).toContainText("a/(b*c)");
    expect(await field.evaluate(el => (el as HTMLElement & { value?: string }).value), expression).toBe(expression);
  }
  for (const expression of ["(a/b)*c", "a/(b*c)", "((a/(b*c)))"]) {
    await setInput(page, expression);
    await expect(warning, expression).toHaveCount(0);
  }
});


test("SY-P-23: el aviso detecta a/bc dentro de expresiones mayores sin alterar MathLive", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  const field = page.locator("math-field").first();
  for (const expression of ["1+a/bc", "2*(a/bc)", "a/bc+3"]) {
    await setInput(page, expression);
    await expect(warning, expression).toBeVisible();
    await expect(warning).toContainText("(a/b)*c");
    await expect(warning).toContainText("a/(b*c)");
    expect(await field.evaluate(el => (el as HTMLElement & { value?: string }).value), expression).toBe(expression);
  }
  for (const expression of ["1+(a/b)*c", "2*(a/(b*c))", "a/(b*c)+3"]) {
    await setInput(page, expression);
    await expect(warning, expression).toHaveCount(0);
  }
});

test("SY-P-23 Lite: la ambigüedad detiene cálculo sin alterar MathLive", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  for (const expression of ["a/bc", "1+a/bc", String.raw`\frac{a}{bc}`]) {
    await setInput(page, expression);
    await expect(warning, expression).toBeVisible();
    const result = await submit(page);
    expect(result.kind, expression).toBe("error");
    expect(result.value, expression).toContain("SY-P-23");
    expect(await field.evaluate(el => (el as HTMLElement & { value?: string }).value), expression).toBe(expression);
  }
});

test("SY-P-23 Lite: identificadores vecinos no reciben bloqueo de bc", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  for (const expression of ["aa/bc", "a/bcd", "xa/bc", "a/bcx", "1+aa/bc", "2*(a/bcd)"]) {
    await setInput(page, expression);
    await expect(warning, expression).toHaveCount(0);
    const output = await submit(page);
    expect(output.value, expression).not.toContain("SY-P-23:");
    expect(await field.evaluate(el => (el as HTMLElement & {value?:string}).value), expression).toBe(expression);
  }
});

test("SY-P-23 Lite: tras bloquear ambigüedad se recupera evaluación explícita", async ({ page }) => {
  await page.goto("./");
  await setInput(page, "a/bc");
  const blocked = await submit(page);
  expect(blocked.kind).toBe("error");
  expect(blocked.value).toContain("SY-P-23");
  for (const [expression, expected] of [["(12/3)*2", "8"], ["12/(3*2)", "2"]] as const) {
    await setInput(page, expression);
    await expect(page.getByRole("status", { name: "Convención de división ambigua" })).toHaveCount(0);
    // A stale alert from the preceding blocked request must not be mistaken
    // for the response to this new valid calculation.
    await page.evaluate(() => window.mathVirtualKeyboard?.hide());
    const region = page.locator('section[aria-label="Resultado"]').first();
    const previousStatus = region.locator('[role="status"][data-result-request-id]').first();
    const priorRequestId = (await previousStatus.count()) > 0
      ? await previousStatus.getAttribute("data-result-request-id")
      : null;
    await page.getByRole("region", { name: "Entrada" }).getByRole("button", { name: "Calcular", exact: true }).click();
    await expect.poll(async () => {
      const status = region.locator('[role="status"][data-result-request-id]').first();
      const newId = await status.getAttribute("data-result-request-id").catch(() => null);
      return Boolean(newId?.trim()) && newId !== priorRequestId;
    }, { timeout: 15000, message: expression + " must produce a fresh result after SY-P-23 rejection" }).toBe(true);
    const result = await readOutcome(page);
    expect(result.kind, expression + " => " + result.value).toBe("result");
    expect(canonical(result.value), expression).toMatch(new RegExp("^" + expected + "(?:\\.0+)?$"));
  }
});

// SY-P-24/25: these original fixture inputs are products, not SY-P-23 division.
// This UI check verifies guard scope and MathLive preservation, not numeric parser semantics.
test("SY-P-24/25: xy y xyz no activan bloqueo de división", async ({ page }) => {
  await page.goto("./");
  const warning = page.getByRole("status", { name: "Convención de división ambigua" });
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  for (const expression of ["xy", "xyz"]) {
    await setInput(page, expression);
    await expect(warning, expression).toHaveCount(0);
    const stored = await field.evaluate(el => (el as HTMLElement & { value?: string }).value ?? "");
    expect(stored, expression + " must retain original MathLive text").toBe(expression);
  }
  await setInput(page, "a/bc");
  await expect(warning).toBeVisible();
});

// Fixture provenance: SY-P-24/25 must retain the official product interpretation.
// The UI guard test above is deliberately not counted as numeric substitution proof.
test("SY-P-24/25: los casos originales exigen productos de variables", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const source = await fs.readFile(path.resolve(process.cwd(), "qa/certification/syntax309_sy_p_cases.jsonl"), "utf8");
  const rows = source.trim().split(/\r?\n/).map(line => JSON.parse(line) as {id:string; entrada:string; operacion:string; esperado:string});
  for (const [id, input, expected] of [
    ["SY-P-24", "xy", String.raw`x\cdot y`],
    ["SY-P-25", "xyz", String.raw`x\cdot y\cdot z`],
  ]) {
    const matches = rows.filter(row => row.id === id);
    expect(matches, id + " must have exactly one original fixture row").toHaveLength(1);
    expect(matches[0].entrada).toBe(input);
    expect(matches[0].operacion).toBe("interpretacion");
    expect(matches[0].esperado).toBe(expected);
  }
});


test("SY-P-23 Lite: entrada ambigua no se despacha al Worker y recupera", async ({ page }) => {
  await page.addInitScript(() => {
    const nativePost = Worker.prototype.postMessage;
    const trace: Array<{type:string;requestId:string}> = [];
    (window as typeof window & {__syP23WorkerTrace?: typeof trace}).__syP23WorkerTrace = trace;
    Worker.prototype.postMessage = function(message: unknown, transfer?: Transferable[]) {
      const payload = message as {type?:string;requestId?:string} | null;
      if(payload && typeof payload.type === "string") {
        trace.push({type:payload.type,requestId:String(payload.requestId ?? "")});
      }
      return nativePost.call(this,message,transfer ?? []);
    };
  });
  await page.goto("./");
  const trace=()=>page.evaluate(()=>(window as typeof window & {__syP23WorkerTrace?: Array<{type:string;requestId:string}>}).__syP23WorkerTrace ?? []);
  const initial=(await trace()).filter(m=>m.type==="evaluate").length;
  for(const source of ["a/bc",String.raw`\frac{a}{bc}`,"1+a/bc"]){
    await setInput(page,source);
    const outcome=await submit(page);
    expect(outcome.kind,source).toBe("error");
    expect(outcome.value,source).toContain("SY-P-23");
    expect((await trace()).filter(m=>m.type==="evaluate").length,source).toBe(initial);
  }
  await setInput(page,"2+3");
  await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
  const region=page.locator('section[aria-label="Resultado"]').first();
  const status=region.locator('[role="status"][data-result-request-id]').first();
  const previous=await status.count()?await status.getAttribute("data-result-request-id"):null;
  await page.getByRole("region",{name:"Entrada"}).getByRole("button",{name:"Calcular",exact:true}).click();
  await expect.poll(async()=>{
    const id=await status.getAttribute("data-result-request-id").catch(()=>null);
    return Boolean(id?.trim()) && id!==previous;
  },{timeout:15000,message:"SY-P-23 must recover with a new real request ID"}).toBe(true);
  await expect(status).toBeVisible();
  const recovered=await readOutcome(page);
  expect(recovered.kind).toBe("result");
  expect(canonical(recovered.value)).toMatch(/^5(?:\.0+)?$/);
  const messages=(await trace()).filter(m=>m.type==="evaluate");
  expect(messages.length).toBeGreaterThan(initial);
  expect(messages.at(-1)?.requestId).toBeTruthy();
});
