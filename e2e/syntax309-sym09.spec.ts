import {test,expect} from "@playwright/test";
for(const [body,expected] of [
 [String.raw`\frac12&\sqrt2\\\pi&e`,Math.E/2-Math.SQRT2*Math.PI],
 [String.raw`\pi&e\\\frac12&\sqrt2`,-(Math.E/2-Math.SQRT2*Math.PI)],
] as const){
 test("SY-M-09 native real constant determinant "+expected,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate((node,latex)=>{
   (node as HTMLElement & {value:string}).value=latex;
   node.dispatchEvent(new Event("input",{bubbles:true}));
  },"\\det\\begin{pmatrix}"+body+"\\end{pmatrix}");
  await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  const exact=await result.getAttribute("data-result-reentry-latex");
  expect(exact).toContain("\\pi");
  expect(exact).toMatch(/e/);
  const number=result.locator("span").filter({hasText:/^-?3\.083/}).first();
  await expect(number).toBeVisible();
  expect(Number(await number.innerText())).toBeCloseTo(expected,4);
 });
}
