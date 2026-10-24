import {test,expect} from "@playwright/test";
for(const source of [
 String.raw`\operatorname{arcsen}\frac{1}{2}`,
 String.raw`\operatorname{arcsen}\left(\frac{1}{2}\right)`,
]){
 test("SY-S-05 native radian arcsine "+source,async({page})=>{
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
  const reentry=await result.getAttribute("data-result-reentry-latex");
  expect(reentry).toBeTruthy();
  expect(reentry).toContain(String.raw`\pi`);
  expect(reentry).toContain("6");
  // The result can render symbolic values as text, not as a readonly math-field.
  // Reentry LaTeX is the stable UI contract for this symbolic case.
  await expect(result).toHaveAttribute("data-result-reentry-latex",/\\pi/);
 });
}
