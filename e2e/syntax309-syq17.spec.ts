import { test, expect } from "@playwright/test";

const cases = [
  {source:String.raw`\begin{cases}x>1\\ x<3\end{cases}`, interval:"(1,3)", truth:[false,true,false]},
  {source:String.raw`\begin{cases}x\ge1\\ x\le3\end{cases}`, interval:"[1,3]", truth:[true,true,true]},
  {source:String.raw`\begin{cases}x>3\\ x<1\end{cases}`, interval:"empty"},
  {source:String.raw`\begin{cases}x\ge2\\ x\le2\end{cases}`, interval:"singleton"},
];
for (const scenario of cases) {
  test("SY-Q-17 native MathLive/worker intersection: "+scenario.interval, async ({page}) => {
    await page.addInitScript(()=>localStorage.setItem("precision-lab-layout-mode","split"));
    await page.goto("./");
    const input=page.locator("math-field[aria-label='Entrada matemática']").first();
    await expect(input).toBeVisible();
    await input.evaluate((node,latex)=>{
      (node as HTMLElement & {value:string}).value=latex;
      node.dispatchEvent(new Event("input",{bubbles:true}));
    },scenario.source);
    await page.locator("button:visible").filter({hasText:/^Calcular$/}).first().click();
    const result=page.locator("[data-result-request-id]").first();
    await expect(result).toBeVisible();
    const read=async()=> (await result.locator("math-field[read-only]").first()
      .evaluate(node=>(node as HTMLElement & {value:string}).value))
      .replace(/\\left|\\right|\\[,;! ]|\s/g,"");
    if(scenario.interval==="empty") {
      await expect.poll(read).toMatch(/^\\(?:varnothing|emptyset)$/);
    } else if(scenario.interval==="singleton") {
      await expect.poll(read).toBe(String.raw`x\in\{2\}`);
    } else {
      await expect.poll(read).toBe("x\\in"+scenario.interval);
      const interval=(await read()).slice("x\\in".length);
      const contains=(x:number)=> (x>1 || (x===1 && interval[0]==="[")) &&
        (x<3 || (x===3 && interval.at(-1)==="]"));
      expect([1,2,3].map(contains)).toEqual(scenario.truth);
      expect([0,4].map(contains)).toEqual([false,false]);
    }
  });
}
