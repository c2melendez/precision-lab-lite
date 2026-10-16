import {test,expect} from "@playwright/test";

test("SY-X-04 expands five hundred x terms and recovers",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const source=Array(500).fill("x").join("+");
 expect(source.length).toBe(999);
 await input.evaluate((element,value)=>{
  (element as HTMLElement & {value:string}).value=value;
  element.dispatchEvent(new Event("input",{bubbles:true}));
 },source);
 const serialized=await input.evaluate(element=>(element as HTMLElement & {value:string}).value);
 expect(serialized.replace(/\s/g,"")).toBe(source);
 const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
 await expect(calculate).toBeEnabled();
 await calculate.click();
 const result=page.locator("[data-result-request-id]").first();
 await expect(result).toBeVisible();
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(/500\s*x/);
 await expect(page.locator("[role=alert]")).toHaveCount(0);
 await input.evaluate(element=>{
  (element as HTMLElement & {value:string}).value="2+3";
  element.dispatchEvent(new Event("input",{bubbles:true}));
 });
 await calculate.click();
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
 await expect(page.locator("[role=alert]")).toHaveCount(0);
});
