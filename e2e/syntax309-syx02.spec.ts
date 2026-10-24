import {test,expect} from "@playwright/test";
test("SY-X-02 native escaped spacing is idle or reports empty input and recovers",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
 const result=page.locator("[data-result-request-id]").first();
 let prior="";
 for(let pass=0;pass<2;pass++){
  await input.evaluate((node,source)=>{(node as HTMLElement & {value:string}).value=source;node.dispatchEvent(new Event("input",{bubbles:true}));},"\\ ".repeat(4));
  const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
  expect(serialized.replace(/\\(?:qquad|quad|[,;!: ])/g,"").trim()).toBe("");
  const disabled=await calculate.isDisabled();
  try{
   if(disabled){
    await expect(page.locator("[role=alert]")).toHaveCount(0);
    if(prior){
     await expect(result).toHaveAttribute("data-result-request-id",prior);
     await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
    }else await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
   }else{
    await calculate.click();
    await expect(page.locator("[role=alert]").first()).toContainText("Escriba una expresión antes de calcular.");
    await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
   }
  }finally{
   console.log("SY-X-02 OBSERVED",JSON.stringify({serialized,disabled,alerts:await page.locator("[role=alert]").allTextContents(),errors}));
  }
  await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="2+3";node.dispatchEvent(new Event("input",{bubbles:true}));});
  await expect(calculate).toBeEnabled();
  await calculate.click();
  await expect(result).toBeVisible();
  if(prior)await expect(result).not.toHaveAttribute("data-result-request-id",prior);
  await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
  await expect(page.locator("[role=alert]")).toHaveCount(0);
  prior=(await result.getAttribute("data-result-request-id"))??"";
  expect(prior).not.toBe("");
 }
 expect(errors).toEqual([]);
});
