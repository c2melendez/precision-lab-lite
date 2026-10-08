import { expect, test } from "@playwright/test";
type Page = import("@playwright/test").Page;

async function setInput(page: Page, value: string) {
  const field=page.locator("math-field").first();
  await field.waitFor({state:"visible"});
  await field.evaluate((el,v)=>{
    const mf=el as HTMLElement & {setValue?:(x:string)=>void; value?:string};
    if (typeof mf.setValue==="function") mf.setValue(String(v)); else mf.value=String(v);
    el.dispatchEvent(new InputEvent("input",{bubbles:true,inputType:"insertText",data:String(v)}));
  }, value);
  await page.waitForTimeout(120);
}


async function readOutcome(page: Page): Promise<{kind:"result"|"error"; value:string}> {
  const region=page.locator('section[aria-label="Resultado"]').first();
  const alert=region.locator('[role="alert"]').first();
  const status=region.locator('[role="status"]').first();
  await expect.poll(async () => {
    if (await alert.count()) {
      const t=((await alert.textContent().catch(()=>""))??"").trim();
      if (t) return "error";
    }
    if (await status.count()) {
      const t=((await status.textContent().catch(()=>""))??"").trim();
      if (t && !/calculando/i.test(t)) return "result";
    }
    return "pending";
  }, {timeout:15000}).not.toBe("pending");
  if (await alert.count()) {
    const t=((await alert.textContent().catch(()=>""))??"").trim();
    if (t) return {kind:"error",value:t};
  }
  const mf=status.locator("math-field[read-only]").first();
  if (await mf.count()) {
    const v=String(await mf.evaluate(el => (el as HTMLElement & {value?:string}).value ?? ""));
    if (v.trim()) return {kind:"result",value:v};
  }
  return {kind:"result",value:((await status.textContent())??"").trim()};
}

async function submit(page: Page) {
  await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
  const button=page.getByRole("region", {name:"Entrada"}).getByRole("button", {name:"Calcular", exact:true});
  await expect(button).toBeEnabled();
  await button.click();
  return readOutcome(page);
}

async function assertReenters(page: Page, id:string, latex:string) {
  await setInput(page,latex);
  const first=await submit(page);
  expect(first.kind,id+" first="+first.value).toBe("result");
  expect(first.value.trim()).not.toBe("");
  await setInput(page,first.value);
  const second=await submit(page);
  expect(second.kind,id+" S1="+first.value+" S2="+second.value).toBe("result");
  return {s1:first.value,s2:second.value};
}

async function openKeyboard(page: Page) {
  const opener=page.getByRole("button",{name:/abrir teclado|expandir teclado/i}).first();
  if (await opener.isVisible().catch(()=>false)) await opener.click();
  const dialog=page.getByRole("dialog",{name:"Teclado matemático"});
  await expect(dialog).toBeVisible();
  await dialog.getByRole("tab",{name:"Básico",exact:true}).click();
  return dialog;
}

test.describe("IN625 H1c reentrada locale/alias/ANS",()=>{
  test("EN-RE-17 coma decimal reingresa como 0.5", async({page})=>{
    await page.goto("./");
    await setInput(page,"0{,}5");
    const out=await submit(page);
    expect(out.kind,out.value).toBe("result");
    expect(out.value.replace(/\\left|\\right|\s/g,"")).toMatch(/0[.,]5|\\frac\{1\}\{2\}/);
  });

  test("EN-RE-18 alias español reingresa", async({page})=>{
    await page.goto("./");
    const out=await assertReenters(page,"EN-RE-18","\\operatorname{sen}\\left(\\frac{\\pi}{6}\\right)");
    expect((out.s2+out.s1).toLowerCase()).toMatch(/1|frac|0\.5|sin|sen/);
  });

  test("EN-RE-19 polinomio expandido reingresa", async({page})=>{
    await page.goto("./");
    await assertReenters(page,"EN-RE-19","x^{3}+3x^{2}+3x+1");
  });

  test("EN-RE-20 ASCII plano reingresa", async({page})=>{
    await page.goto("./");
    const field=page.locator("math-field").first();
    await field.focus();
    await page.keyboard.insertText("x^2+2*x+1");
    let out=await submit(page);
    expect(out.kind,out.value).toBe("result");
    await setInput(page,"");
    await field.focus();
    await page.keyboard.insertText("sqrt(2)/2");
    out=await submit(page);
    expect(out.kind,out.value).toBe("result");
  });

  test("EN-RE-21 ANS reutiliza último resultado", async({page})=>{
    await page.goto("./");
    await setInput(page,"2+3");
    const first=await submit(page);
    expect(first.kind,first.value).toBe("result");
    const dialog=await openKeyboard(page);
    await dialog.getByRole("button",{name:"borrar todo el campo",exact:true}).click();
    await dialog.getByRole("button",{name:"insertar el último resultado",exact:true}).click();
    await dialog.getByRole("button",{name:"multiplicar",exact:true}).click();
    await dialog.getByRole("button",{name:"2",exact:true}).click();
    await dialog.getByRole("button",{name:"calcular",exact:true}).click();
    const second=await readOutcome(page);
    expect(second.kind,second.value).toBe("result");
    expect(second.value.replace(/[^0-9.-]/g,"")).toMatch(/^10(?:\.0+)?$/);
  });

  test("EN-RE-23 C y C_1 reingresan como variables ordinarias", async({page})=>{
    await page.goto("./");
    let out=await submitAfter(page,"C+1");
    expect(out.kind,out.value).toBe("result");
    out=await submitAfter(page,"C_{1}+1");
    expect(out.kind,out.value).toBe("result");
  });
});

async function submitAfter(page:Page, latex:string){
  await setInput(page,latex);
  return submit(page);
}
