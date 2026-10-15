import {test,expect} from "@playwright/test";
for(const caret of [0,2]){
 test("SY-Q-20 native Resolver adds zero to whole expression; caret "+caret,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
  await page.goto("./");
  const input=page.locator("math-field[aria-label='Entrada matemática']").first();
  await expect(input).toBeVisible();
  await input.evaluate(node=>{
   (node as HTMLElement & {value:string}).value=String.raw`x^{2}-4`;
   node.dispatchEvent(new Event("input",{bubbles:true}));
  });
  const calculate=()=>page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
  await calculate();
  const result=page.locator("[data-result-request-id]").first();
  await expect(result).toBeVisible();
  const initialId=await result.getAttribute("data-result-request-id");
  await expect.poll(()=>result.getAttribute("data-result-reentry-latex"))
    .not.toMatch(/=/);
  await expect.poll(()=>result.locator("math-field[read-only]").first()
    .evaluate(node=>(node as HTMLElement & {value:string}).value.replace(/\{2\}/g,"2").replace(/\s/g,"")))
    .toBe("x^2-4");
  const opener=page.getByRole("button",{name:/^(Abrir|Expandir) teclado$/i}).first();
  if(await opener.isVisible().catch(()=>false)) await opener.click();
  await page.getByRole("tab",{name:"Álgebra",exact:true}).click();
  await input.evaluate((node,pos)=>{(node as HTMLElement & {position:number}).position=pos;},caret);
  await page.getByRole("button",{name:"Resolver ecuación",exact:true}).first().click();
  await expect.poll(()=>input.evaluate(node=>(node as HTMLElement & {value:string}).value
    .replace(/\{2\}/g,"2").replace(/\s/g,""))).toBe("x^2-4=0");
  // The action prepares a visible equation; it does not silently evaluate it.
  await expect(result).toHaveAttribute("data-result-request-id",initialId!);
  const close=page.getByRole("button",{name:"Cerrar teclado",exact:true}).first();
  if(await close.isVisible().catch(()=>false)) await close.click();
  await calculate();
  await expect.poll(async()=>{
   const latex=await result.locator("math-field[read-only]").first()
    .evaluate(node=>(node as HTMLElement & {value:string}).value.replace(/\s/g,""));
   return [...latex.matchAll(/x=(-?\d+)/g)].map(m=>Number(m[1])).sort((a,b)=>a-b);
  }).toEqual([-2,2]);
  await expect.poll(()=>result.getAttribute("data-result-request-id")).not.toBe(initialId);
 });
}
