import {test,expect} from "@playwright/test";
test("SY-X-01 empty scientific input stays idle and recovers after clearing",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
 const result=page.locator("[data-result-request-id]").first();
 const value=()=>input.evaluate(node=>(node as HTMLElement & {value:string}).value);
 await expect.poll(value).toBe("");
 await expect(calculate).toBeDisabled();
 await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
 await expect(page.locator("[role=alert]")).toHaveCount(0);
 let prior="";
 for(let pass=0;pass<2;pass++){
  await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="2+3";node.dispatchEvent(new Event("input",{bubbles:true}));});
  await expect(calculate).toBeEnabled();
  await calculate.click();
  await expect(result).toBeVisible();
  if(prior)await expect(result).not.toHaveAttribute("data-result-request-id",prior);
  await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
  prior=(await result.getAttribute("data-result-request-id"))??"";
  expect(prior).not.toBe("");
  await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="";node.dispatchEvent(new Event("input",{bubbles:true}));});
  await expect.poll(value).toBe("");
  await expect(calculate).toBeDisabled();
  await expect(result).toHaveAttribute("data-result-request-id",prior);
  await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
  await expect(page.locator("[role=alert]")).toHaveCount(0);
 }
 expect(errors).toEqual([]);
});
