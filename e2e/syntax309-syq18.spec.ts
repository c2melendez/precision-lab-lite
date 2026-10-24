import { test, expect } from "@playwright/test";
for (const variable of ["x","y"]) {
  test("SY-Q-18 native explicit "+variable+" with free parameter and result reentry",async({page})=>{
    await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
    await page.goto("./");
    const input=page.locator("math-field[aria-label='Entrada matemática']").first();
    await expect(input).toBeVisible();
    const fill=async(latex:string)=>input.evaluate((node,value)=>{
      (node as HTMLElement & {value:string}).value=value;
      node.dispatchEvent(new Event("input",{bubbles:true}));
    },latex);
    const calculate=()=>page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
    await fill("x+y=3");
    await calculate();
    const choice=page.getByRole("combobox",{name:"Variable a despejar"});
    await expect(choice).toBeVisible();
    await expect(choice).toHaveValue("");
    const initial=page.locator("[data-result-request-id]").first();
    await expect(initial.getByText("Relación implícita",{exact:true})).toBeVisible();
    await expect.poll(()=>initial.locator("math-field[read-only]").first().evaluate(node=>(node as HTMLElement & {value:string}).value)).toBe("x+y=3");
    await choice.selectOption(variable);
    await calculate();
    const result=page.locator("[data-result-request-id]").first();
    await expect(result).toBeVisible();
    const read=()=>result.locator("math-field[read-only]").first().evaluate(node=>(node as HTMLElement & {value:string}).value);
    const parameter=variable==="x"?"y":"x";
    const expected=new RegExp("^"+variable+"=(?:3-"+parameter+"|-"+parameter+"\\+3)$");
    const normalized=async()=> (await read()).replace(/\\left|\\right|\\[,;! ]|\s/g,"");
    await expect.poll(normalized).toMatch(expected);
    await expect(result.getByText("Solución para "+variable+"; "+parameter+" libre(s)",{exact:true})).toBeVisible();
    const firstId=await result.getAttribute("data-result-request-id");
    await fill(await read());
    await calculate();
    await expect(choice).toHaveValue("");
    await choice.selectOption(variable);
    await calculate();
    await expect.poll(normalized).toMatch(expected);
    await expect.poll(()=>result.getAttribute("data-result-request-id")).not.toBe(firstId);
    if(variable==="x") {
      await fill("a+b=5");
      await calculate();
      await expect(choice).toHaveValue("");
      await expect(choice.locator("option")).toHaveText(["Selecciona una variable","a","b"]);
      await choice.selectOption("a");
      await calculate();
      await expect.poll(normalized).toMatch(/^a=(?:5-b|-b\+5)$/);
    }
  });
}
