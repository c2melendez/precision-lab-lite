import {test,expect} from "@playwright/test";
for(const [source,coordinates] of [
 [String.raw`\mathbf{i}+2\mathbf{j}-\mathbf{k}`,"1,2,-1"],
 [String.raw`-\mathbf{k}+2\mathbf{j}+\mathbf{i}`,"1,2,-1"],
 [String.raw`2\mathbf{i}-\mathbf{i}+0\mathbf{k}`,"1,0,0"],
]){
 test("SY-M-13 native basis "+source,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node,latex)=>{
   (node as HTMLElement & {value:string}).value=latex;
   node.dispatchEvent(new Event("input",{bubbles:true}));
  },source);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  await expect.poll(async()=> (await result.getAttribute("data-result-reentry-latex"))?.replace(/\s/g,"")).toBe("\\left("+coordinates+"\\right)");
  const field=result.locator("math-field[read-only]").first();
  await expect(field).toBeVisible();
  await expect.poll(async()=> (await field.evaluate(node=>(node as HTMLElement & {value:string}).value)).replace(/\s/g,"")).toBe("\\left("+coordinates+"\\right)");
 });
}
