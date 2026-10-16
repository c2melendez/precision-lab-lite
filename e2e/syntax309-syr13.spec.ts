import {test,expect} from "@playwright/test";
test("SY-R-13 native cube root substitution is exactly 3 and reenters",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const result=page.locator("[data-result-request-id]").first();
 let source=String.raw`\sqrt[3]{x}\ \text{con}\ x=27`;
 let prior="";
 for(let pass=0;pass<2;pass++){
  await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},source);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  await expect(result).toBeVisible();
  if(prior)await expect(result).not.toHaveAttribute("data-result-request-id",prior);
  await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("3");
  await expect(page.locator("[role=alert]")).toHaveCount(0);
  source=(await result.getAttribute("data-result-reentry-latex"))??"";
  expect(source).toBe("3");
  prior=(await result.getAttribute("data-result-request-id"))??"";
 }
 expect(errors).toEqual([]);
});
