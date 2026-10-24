import {test,expect} from "@playwright/test";
test("SY-M-16 native unbound, matrix and scalar bars",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const base=String.raw`\left\lvert A\right\rvert`;
 const enter=async(latex:string)=>{
  await input.evaluate((node,value)=>{
   (node as HTMLElement & {value:string}).value=value;
   node.dispatchEvent(new Event("input",{bubbles:true}));
  },latex);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
 };
 await enter(base);
 await expect(page.getByRole("alert").filter({hasText:/tipo.*matriz.*determinante.*escalar.*valor absoluto/})).toBeVisible();
 await enter(base+String.raw`\ \text{con}\ A=\begin{pmatrix}1&2\\3&4\end{pmatrix}`);
 const result=page.locator("[data-result-request-id]").first();
 await expect(result.getByText("-2",{exact:true})).toBeVisible();
 const matrixId=await result.getAttribute("data-result-request-id");
 await enter(base+String.raw`\ \text{con}\ A=-3`);
 await expect(result.getByText("3",{exact:true})).toBeVisible();
 await expect.poll(()=>result.getAttribute("data-result-request-id")).not.toBe(matrixId);
 await enter(base);
 await expect(page.getByRole("alert").filter({hasText:/tipo/})).toBeVisible();
});
