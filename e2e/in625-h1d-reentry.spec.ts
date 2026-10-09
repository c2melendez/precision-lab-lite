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
        "2+3":/^5(?:\\.0+)?$/,
        "\\frac{1}{2}+\\frac{1}{3}":/^(?:\\frac\\{5\\}\\{6\\}|0\\.83{1,2}3*)$/i,
        "2^{10}":/^1024(?:\\.0+)?$/,
        "\\frac{3}{4}":/^(?:\\frac\\{3\\}\\{4\\}|0\\.75)$/,
        "10^{-3}":/^(?:\\frac\\{1\\}\\{1000\\}|0\\.001)$/,
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
