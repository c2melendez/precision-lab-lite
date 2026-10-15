import { test, expect } from "@playwright/test";
for(const chain of ["x=y=3","y=x=3","x==3"]){
  test("SY-Q-19 native error and recovery: "+chain,async({page})=>{
    await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
    await page.goto("./");
    const input=page.locator("math-field[aria-label='Entrada matemática']").first();
    await expect(input).toBeVisible();
    const fill=async(value:string)=>input.evaluate((node,latex)=>{
      (node as HTMLElement & {value:string}).value=latex;
      node.dispatchEvent(new Event("input",{bubbles:true}));
    },value);
    const calculate=()=>page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
    await fill(chain);
    await calculate();
    await expect(page.getByRole("alert")).toContainText('Más de un signo "="');
    await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
    await expect(page.getByRole("combobox",{name:"Variable a despejar"})).toHaveCount(0);
    await fill("x+1=4");
    await calculate();
    const result=page.locator("[data-result-request-id]").first();
    await expect(result).toBeVisible();
    // A numeric equation result uses the decimal text view, while the
    // reentry attribute retains the actual equation emitted by the worker.
    await expect(result).toHaveAttribute("data-result-reentry-latex", /^x\s*=\s*3$/);
    await expect(result.getByText("3",{exact:true})).toBeVisible();
    await expect(page.getByRole("alert")).toHaveCount(0);
    if(chain==="x=y=3"){
      await fill(String.raw`\begin{cases}x=y\\ y=3\end{cases}`);
      await calculate();
      await expect.poll(()=>result.locator("math-field[read-only]").first()
        .evaluate(node=>(node as HTMLElement & {value:string}).value)).toMatch(/x\s*=\s*3.*y\s*=\s*3/);
    }
  });
}
