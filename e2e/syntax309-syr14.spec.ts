import {test,expect} from "@playwright/test";
test("SY-R-14 native absolute value and signed control reenter exact results",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const result=page.locator("[data-result-request-id]").first();
 let prior="";
 for(const [original,expected] of [
  [String.raw`\left\lvert x\right\rvert\ \text{con}\ x=-4`,"4"],
  [String.raw`\left\lvert x\right\rvert+x\ \text{con}\ x=-4`,"0"],
 ]){
  let source=original;
  for(let pass=0;pass<2;pass++){
   await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
   await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
   await expect(result).toBeVisible();
   if(prior)await expect(result).not.toHaveAttribute("data-result-request-id",prior);
   await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText(expected);
   await expect(page.locator("[role=alert]")).toHaveCount(0);
   source=(await result.getAttribute("data-result-reentry-latex"))??"";
   expect(source).toBe(expected);
   prior=(await result.getAttribute("data-result-request-id"))??"";
  }
 }
 expect(errors).toEqual([]);
});
