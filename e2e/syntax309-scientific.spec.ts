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
