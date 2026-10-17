import { test, expect } from "@playwright/test";

test("SY-N-31: scientific UI and exact reentry across viewport sizes", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
  const input = page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node) => {
    const field = node as HTMLElement & { value: string };
    field.value = String.raw`\frac{1}{3000000}`;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("button:visible").filter({ hasText: /^Calcular$/ }).first().click();
  const result = page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex", /frac|3000000/);
  const scientific = result.getByRole("button", { name: "scn", exact: true });
  await scientific.click();
  await expect(scientific).toHaveAttribute("aria-pressed", "true");
  const rendered = result.locator("math-field[read-only]").first();
  await expect.poll(() => rendered.evaluate((element) => (element as HTMLElement & { value: string }).value))
    .toBe(String.raw`3.333333333\times10^{-7}`);
  await result.getByRole("button", { name: "frac", exact: true }).click();
  await expect.poll(() => rendered.evaluate((element) => (element as HTMLElement & { value: string }).value))
    .toMatch(/frac|3000000/);
  await expect(result).toHaveAttribute("data-result-reentry-latex", /frac|3000000/);
});


test("SY-X-20 native Unicode invalid character rejection and recovered reentry", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const pageErrors:string[]=[];
  page.on("pageerror",e=>pageErrors.push(e.message));
  await page.goto("./");
  const field=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(field).toBeVisible();
  const source="😀+1";
  expect([...source].map(c=>c.codePointAt(0))).toEqual([0x1f600,43,49]);
  async function setSource(value:string){
    await field.evaluate((node,text)=>{
      const mf=node as HTMLElement & {setValue?:(v:string,opts?:{silenceNotifications?:boolean})=>void;value?:string};
      if(mf.setValue)mf.setValue(text,{silenceNotifications:true});
      else mf.value=text;
    },value);
    await field.dispatchEvent("input",{bubbles:true,inputType:"insertReplacementText",data:value});
  }
  await setSource(source);
  const serialized=await field.evaluate(node=>(node as HTMLElement & {value:string}).value);
  expect(serialized).toContain("😀");
  await page.getByRole("region",{name:"Entrada"}).getByRole("button",{name:"Calcular",exact:true}).click();
  const result=page.locator('section[aria-label="Resultado"]').first();
  const alert=result.locator('[role="alert"]').first();
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(/car[aá]cter|inv[aá]lid|permitid|reconocid|sintaxis/i);
  const notice=(await alert.innerText()).trim();
  await expect(result.locator("[data-result-request-id]")).toHaveCount(0);
  const ids:string[]=[];
  for(const input of ["2+3","5"]){
    await setSource(input);
    const status=result.locator('[role="status"][data-result-request-id]').first();
    const previousId=(await status.count()) ? await status.getAttribute("data-result-request-id") : null;
    await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
    const calculate=page.getByRole("region",{name:"Entrada"}).getByRole("button",{name:"Calcular",exact:true});
    await expect(calculate).toBeEnabled();
    await calculate.click();
    await expect.poll(async()=>status.getAttribute("data-result-request-id"),{
      message:"La nueva evaluación debe generar una respuesta con ID distinto",
      timeout:15000
    }).not.toBe(previousId);
    await expect(status).toContainText("5");
    const id=await status.getAttribute("data-result-request-id");
    expect(id).toBeTruthy();
    ids.push(id!);
  }
  expect(new Set(ids).size).toBe(2);
  expect(pageErrors).toEqual([]);
  await testInfo.attach("SY-X-20-lite-native-evidence",{
    body:JSON.stringify({source,serialized,notice,ids,project:testInfo.project.name,pageErrors},null,2),
    contentType:"application/json"
  });
});


test("SY-X-21 native zero-width fixture is exact 3 or clear rejection with recovery",async({page},testInfo)=>{
  test.setTimeout(90000);
  const pageErrors:string[]=[];page.on("pageerror",e=>pageErrors.push(e.message));
  await page.goto("./");
  const field=page.locator("math-field[aria-label='Entrada matemática']").first();await expect(field).toBeVisible();
  const source="1\u200b+\u200b2";
  expect([...source].map(ch=>ch.codePointAt(0))).toEqual([49,0x200b,43,0x200b,50]);
  async function enterSource(input:string){
    await field.evaluate((node,value)=>{
      const mf=node as HTMLElement & {setValue?:(v:string,options?:{silenceNotifications?:boolean})=>void;value?:string};
      if(mf.setValue)mf.setValue(value,{silenceNotifications:true});else mf.value=value;
    },input);
    await field.dispatchEvent("input",{bubbles:true,inputType:"insertReplacementText",data:input});
  }
  await enterSource(source);
  const serialized=await field.evaluate(node=>(node as HTMLElement & {value?:string}).value??"");
  await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
  const calculate=page.getByRole("region",{name:"Entrada"}).getByRole("button",{name:"Calcular",exact:true});
  await expect(calculate).toBeEnabled();await calculate.click();
  const region=page.locator('section[aria-label="Resultado"]').first();
  const alert=region.locator('[role="alert"]').first();
  const status=region.locator('[role="status"][data-result-request-id]').first();
  await expect.poll(async()=>{
    if(await alert.isVisible().catch(()=>false))return "error";
    if(await status.isVisible().catch(()=>false))return "value";
    return "pending";
  },{timeout:15000}).not.toBe("pending");
  const rejected=await alert.isVisible().catch(()=>false);
  const notice=rejected?(await alert.innerText()).trim():"";
  if(rejected){expect(notice).toMatch(/car[aá]cter|inv[aá]lid|reconocid|permitid|sintaxis|expresi[oó]n/i);}
  else{expect((await status.innerText()).trim()).toMatch(/\b3\b/);}
  const ids:string[]=[];
  for(const input of ["2+3","5"]){
    await enterSource(input);
    const previous=(await status.count())?await status.getAttribute("data-result-request-id"):null;
    await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
    await expect(calculate).toBeEnabled();await calculate.click();
    await expect.poll(async()=>status.getAttribute("data-result-request-id"),{timeout:15000}).not.toBe(previous);
    await expect(status).toContainText("5");
    ids.push((await status.getAttribute("data-result-request-id"))!);
  }
  expect(new Set(ids).size).toBe(2);expect(pageErrors).toEqual([]);
  await testInfo.attach("SY-X-21-lite-native-evidence",{
    body:JSON.stringify({source,serialized,rejected,notice,ids,project:testInfo.project.name,pageErrors},null,2),
    contentType:"application/json"
  });
});


test("SY-X-22 native 10000-digit input is exact or rejected and recovers",async({page},testInfo)=>{
  test.setTimeout(120000);
  const pageErrors:string[]=[];page.on("pageerror",e=>pageErrors.push(e.message));
  await page.goto("./");
  const field=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(field).toBeVisible();
  async function enter(input:string){
    await field.evaluate((node,value)=>{
      const mf=node as HTMLElement & {setValue?:(v:string,options?:{silenceNotifications?:boolean})=>void;value?:string};
      if(mf.setValue)mf.setValue(value,{silenceNotifications:true});else mf.value=value;
    },input);
    await field.dispatchEvent("input",{bubbles:true,inputType:"insertReplacementText",data:input});
  }
  const source="9".repeat(10000)+"+1";
  expect(source.length).toBe(10002);
  await enter(source);
  const serialized=await field.evaluate(node=>(node as HTMLElement & {value:string}).value);
  await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
  const calculate=page.getByRole("region",{name:"Entrada"}).getByRole("button",{name:"Calcular",exact:true});
  await expect(calculate).toBeEnabled();
  await calculate.click();
  const region=page.locator('section[aria-label="Resultado"]').first();
  const alert=region.locator('[role="alert"]').first();
  const status=region.locator('[role="status"][data-result-request-id]').first();
  await expect.poll(async()=>{
    if(await alert.isVisible().catch(()=>false))return "error";
    if(await status.isVisible().catch(()=>false))return "value";
    return "pending";
  },{timeout:30000}).not.toBe("pending");
  const rejected=await alert.isVisible().catch(()=>false);
  const notice=rejected?(await alert.innerText()).trim():"";
  if(rejected){
    expect(notice).toMatch(/longitud|tamañ|l[ií]mit|demasiad|car[aá]cter|inv[aá]lid|expresi[oó]n|sintaxis/i);
    await expect(status).toHaveCount(0);
  }else{
    expect(serialized.replace(/\s/g,"")).toContain("9".repeat(10000));
    const exact="1"+"0".repeat(10000);
    const rendered=await status.innerText();
    expect(rendered.replace(/\s/g,"")).toContain(exact);
    expect(rendered).not.toMatch(/Infinity|NaN/i);
  }
  const ids:string[]=[];
  for(const input of ["2+3","5"]){
    await enter(input);await page.evaluate(()=>window.mathVirtualKeyboard?.hide());
    const previous=await status.count()?await status.getAttribute("data-result-request-id"):null;
    await expect(calculate).toBeEnabled();await calculate.click();
    await expect.poll(()=>status.getAttribute("data-result-request-id"),{timeout:15000}).not.toBe(previous);
    await expect(status).toContainText("5");
    ids.push((await status.getAttribute("data-result-request-id"))!);
  }
  expect(new Set(ids).size).toBe(2);expect(pageErrors).toEqual([]);
  await testInfo.attach("SY-X-22-lite-native-evidence",{
    body:JSON.stringify({sourceLength:source.length,serializedLength:serialized.length,rejected,notice,ids,project:testInfo.project.name,pageErrors},null,2),
    contentType:"application/json"
  });
});
