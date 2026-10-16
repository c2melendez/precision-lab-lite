import {test,expect} from "@playwright/test";

test("SY-X-04 expands five hundred x terms and recovers",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
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
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(/^500\s*\*?\s*x$/);
 const firstRequestId=await result.getAttribute("data-result-request-id");
 expect(firstRequestId).toBeTruthy();
 await expect(page.locator("[role=alert]")).toHaveCount(0);
 const reentry=(await result.getAttribute("data-result-reentry-latex"))??"";
 expect(reentry).toMatch(/^500\s*\*?\s*x$/);
 await input.evaluate((element,value)=>{
  (element as HTMLElement & {value:string}).value=value;
  element.dispatchEvent(new Event("input",{bubbles:true}));
 },reentry);
 await calculate.click();
 await expect(result).not.toHaveAttribute("data-result-request-id",firstRequestId!);
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(/^500\s*\*?\s*x$/);
 const reentryRequestId=await result.getAttribute("data-result-request-id");
 expect(reentryRequestId).toBeTruthy();
 await input.evaluate(element=>{
  (element as HTMLElement & {value:string}).value="2+3";
  element.dispatchEvent(new Event("input",{bubbles:true}));
 });
 await calculate.click();
 await expect(result).not.toHaveAttribute("data-result-request-id",reentryRequestId!);
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
 await expect(page.locator("[role=alert]")).toHaveCount(0);
 expect(errors).toEqual([]);
});
