import {test,expect} from "@playwright/test";
for(const source of [String.raw`\vec{u}\times\vec{v}`,String.raw`\vec{a}\ \times\ \vec{b}`]){
 test("SY-M-15 native cross convention "+source,async({page})=>{
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
  await enter(source);
  await expect(page.getByRole("alert").filter({hasText:/producto cruz.*3D.*componentes/})).toBeVisible();
  await expect(page.locator("[data-result-request-id]")).toHaveCount(0);
  expect(errors).toEqual([]);
  await enter(String.raw`2\times3`);
  await expect(page.locator("[data-result-request-id]").first().getByText("6",{exact:true})).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
 });
}
