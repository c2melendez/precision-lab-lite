import {test,expect} from "@playwright/test";
test("SY-M-07 native row-length error and correction",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
 await page.goto("./");
 const input=page.locator("math-field[aria-label='Entrada matemática']").first();
 await expect(input).toBeVisible();
 const enter=async(latex:string)=>{
  await input.evaluate((node,value)=>{
   (node as HTMLElement & {value:string}).value=value;
   node.dispatchEvent(new Event("input",{bubbles:true}));
  },latex);
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
 };
 await enter(String.raw`\begin{pmatrix}1&2\\3\end{pmatrix}`);
 const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
 await expect(page.getByRole("alert").filter({hasText:/filas.*longitud|completa las celdas/i}),serialized).toBeVisible();
 await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
 expect(errors).toEqual([]);
 await enter(String.raw`\det\begin{pmatrix}1&2\\3&4\end{pmatrix}`);
 const result=page.locator("[data-result-request-id]").first();
 await expect(result.getByText("-2",{exact:true})).toBeVisible();
 await expect(page.getByRole("alert")).toHaveCount(0);
 expect(errors).toEqual([]);
});
