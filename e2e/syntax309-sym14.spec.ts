import {test,expect} from "@playwright/test";
const official="\\vec{u}\\cdot\\vec{v}\\ \\text{con}\\ \\vec{u}=(1,2,3),\\ \\vec{v}=(4,5,6)";
for(const [source,expected] of [
 [official,"32"],
 [String.raw`\vec{a}\cdot\vec{b}\ \text{con}\ \vec{b}=(4,5,6),\ \vec{a}=(1,2,3)`,"32"],
 [official.replace("(4,5,6)","(0,1,0)"),"2"],
]){
 test("SY-M-14 native local declarations "+source,async({page})=>{
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
  const serialized=await input.evaluate(node=>(node as HTMLElement & {value:string}).value);
  await expect(result.getByText(expected,{exact:true}),serialized).toBeVisible();
  await expect(result).toHaveAttribute("data-result-reentry-latex",expected);
 });
}
