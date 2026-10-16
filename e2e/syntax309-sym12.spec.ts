import {test,expect} from "@playwright/test";
for(const expression of [
 String.raw`(1,2,3)\cdot(4,5,6)`,
 String.raw`\left(1,2,3\right)\cdot\left(4,5,6\right)`
]){
 test("SY-M-12 native tuple notice and explicit vector recovery "+expression,async({page})=>{
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
  await enter(expression);
  await expect(page.getByRole("alert").filter({hasText:/tuplas.*ambiguas.*producto escalar.*ángulos/})).toBeVisible();
  await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
  expect(errors).toEqual([]);
  await enter(String.raw`\langle1,2,3\rangle\cdot\langle4,5,6\rangle`);
  await expect(page.locator("[data-result-request-id]").first().getByText("32",{exact:true})).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(errors).toEqual([]);
 });
}
