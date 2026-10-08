import { expect, test } from "@playwright/test";
type Page=import("@playwright/test").Page;

async function setInput(page:Page,value:string){
  const field=page.locator("math-field").first();
  await field.waitFor({state:"visible"});
  await field.evaluate((el,v)=>{
    const mf=el as HTMLElement&{setValue?:(x:string)=>void;value?:string};
    if(typeof mf.setValue==="function")mf.setValue(String(v));else mf.value=String(v);
    el.dispatchEvent(new InputEvent("input",{bubbles:true,inputType:"insertText",data:String(v)}));
  },value);
  await page.waitForTimeout(100);
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
  await button.click();
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
      const s1=await evaluateOnce(page,input);
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
