import {test,expect} from "@playwright/test";
test("SY-R-12 native scientific UI rejects nonmathematical text and recovers",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 await input.evaluate((node,latex)=>{(node as HTMLElement & {value:string}).value=latex;node.dispatchEvent(new Event("input",{bubbles:true}));},String.raw`\text{no existe}`);
 await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
 const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
 const alert=page.locator("[role=alert]").first();
 const diagnostic=JSON.stringify({serialized,alert:await alert.textContent({timeout:1000}).catch(()=>null),result:await page.locator("[data-result-request-id]").first().textContent({timeout:1000}).catch(()=>null)});
 expect(await alert.textContent({timeout:1000}).catch(()=>null),diagnostic).toContain("Entrada no matemática");
 await input.evaluate(node=>{(node as HTMLElement & {value:string}).value="2+3";node.dispatchEvent(new Event("input",{bubbles:true}));});
 await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
 await expect(page.locator("[data-result-request-id]").first()).toBeVisible();
});