import {test,expect} from "@playwright/test";
test("SY-R-12 native scientific UI rejects nonmathematical text and recovers",async({page})=>{
 const errors:string[]=[];
 const calculations:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 page.on("console",message=>{if(message.text().includes("IN625_H1D_CALCULATE_ENTRY")) calculations.push(message.text());});
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},String.raw`\text{no existe}`);
 const calculate=page.locator("button:visible").filter({hasText:/^Calcular$/}).first();
 await expect(calculate).toBeEnabled();
 await calculate.click();
 const alert=page.locator("[role=alert]").first();
 try {
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("Entrada no matemática: escribe una expresión válida.");
  await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
 } finally {
  console.log("SY-R-12 OBSERVED",JSON.stringify({
   serialized:await input.evaluate(node=>(node as HTMLElement & {value:string}).value),
   alerts:await page.locator("[role=alert]").allTextContents(),
   results:await page.locator("[data-result-request-id]").allTextContents(),
   errors,calculations
  }));
 }
 await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="2+3";node.dispatchEvent(new Event("input",{bubbles:true}));});
 await calculate.click();
 const result=page.locator("[data-result-request-id]").first();
 await expect(result).toBeVisible();
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
 await expect(page.locator("[role=alert]")).toHaveCount(0);
 expect(errors).toEqual([]);
}) const diagnostic=await page.evaluate(()=>({input:(document.querySelector("math-field[aria-label='Entrada matemática']") as HTMLElement & {value:string})?.value,alerts:[...document.querySelectorAll("[role=alert]")].map(n=>n.textContent),results:[...document.querySelectorAll("[data-result-request-id]")].map(n=>n.textContent?.slice(0,300)),body:document.body.innerText.slice(-1200)}));
 if(!diagnostic.alerts.some(x=>x?.includes("Entrada no matemática")))throw Error("SY-R-12 native diagnostics: "+JSON.stringify(diagnostic));
 await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="2+3";node.dispatchEvent(new Event("input",{bubbles:true}));});
 await calculate.click();
 const result=page.locator("[data-result-request-id]").first();
 await expect(result).toBeVisible();
 await expect(result.locator(".a11y-scale-result-3xl").first()).toHaveText("5");
 await expect(page.locator("[role=alert]")).toHaveCount(0);
 expect(errors).toEqual([]);
});