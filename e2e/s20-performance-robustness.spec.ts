import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __s20WorkerStats?: { created: number; terminated: number };
  }
}

async function installWorkerTracker(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.__s20WorkerStats = { created: 0, terminated: 0 };
    const WrappedWorker = new Proxy(NativeWorker, {
      construct(target, args) {
        const worker = Reflect.construct(target, args) as Worker;
        window.__s20WorkerStats!.created += 1;
        const nativeTerminate = worker.terminate.bind(worker);
        worker.terminate = () => {
          window.__s20WorkerStats!.terminated += 1;
          nativeTerminate();
        };
        return worker;
      },
    });
    Object.defineProperty(window, "Worker", { value: WrappedWorker, writable: true });
  });
}

async function setExpression(page: import("@playwright/test").Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await field.focus();
  await page.waitForTimeout(50);
  await field.evaluate(async (node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  }, value);
}

async function closeKeyboard(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  if (await dialog.isVisible().catch(() => false)) {
    await page.evaluate(() => window.mathVirtualKeyboard?.hide());
    await dialog.getByRole("button", { name: "Cerrar teclado" }).click();
    await expect(dialog).toBeHidden();
  }
}

async function calculate(page: import("@playwright/test").Page, value: string) {
  await setExpression(page, value);
  await closeKeyboard(page);
  const button = page.locator('section[aria-label="Entrada"]').first().getByRole("button", { name: "Calcular", exact: true });
  await expect(button).toBeEnabled();
  const started = performance.now();
  await button.click();
  return started;
}

async function resultText(page: import("@playwright/test").Page) {
  const status = page.locator('section[aria-label="Resultado"] [role="status"]').first();
  await expect(status).toBeVisible({ timeout: 15000 });
  const math = status.locator("math-field[read-only]").first();
  if (await math.count()) {
    return String(await math.evaluate((el) => (el as HTMLElement & { value?: string }).value ?? ""));
  }
  return (await status.innerText()).trim();
}

function percentile(values: number[], q: number) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * q) - 1)];
}

test.beforeEach(async ({ page }) => {
  await installWorkerTracker(page);
  await page.addInitScript(() => localStorage.setItem("precision-lab-layout-mode", "split"));
  await page.goto("./");
});

test("S20: 5 evaluaciones cortas registran mediana/p95 y siguen respondiendo", async ({ page }, testInfo) => {
  const cases = [
    ["2+2", /4/],
    ["3+4", /7/],
    ["6*7", /42/],
    ["9-5", /4/],
    ["8/2", /4/],
  ] as const;
  const durations: number[] = [];

  for (const [expression, expected] of cases) {
    const started = await calculate(page, expression);
    await expect.poll(() => resultText(page), { timeout: 15000 }).toMatch(expected);
    durations.push(performance.now() - started);
  }

  const report = {
    repetitions: durations.length,
    medianMs: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    samplesMs: durations,
  };
  await testInfo.attach("s20-lite-short-routes.json", {
    body: Buffer.from(JSON.stringify(report, null, 2)),
    contentType: "application/json",
  });
  expect(durations).toHaveLength(5);
  expect(report.p95Ms).toBeLessThan(15000);
});

test("S20: sumatoria de 100000 términos se controla sin congelar la UI", async ({ page }) => {
  await calculate(page, "\\sum_{i=1}^{100000}i");
  const status = page.locator('section[aria-label="Resultado"] [role="status"]').first();
  await expect(status).toContainText(/10,?000|excede|complejidad/i, { timeout: 5000 });
});

test("S20: al salir del modo se interrumpe el worker y al volver se recupera", async ({ page }, testInfo) => {
  await calculate(page, "\\prod_{i=1}^{10000}1");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  await expect.poll(async () => page.evaluate(() => window.__s20WorkerStats?.terminated ?? 0)).toBeGreaterThanOrEqual(1);
  await expect.poll(() => page.workers().length).toBe(0);

  const statsAfterCancel = await page.evaluate(() => window.__s20WorkerStats);
  await page.getByRole("button", { name: "Científica", exact: true }).click();
  await calculate(page, "7+8");
  await expect.poll(() => resultText(page), { timeout: 15000 }).toMatch(/15/);

  const statsAfterRecovery = await page.evaluate(() => window.__s20WorkerStats);
  await testInfo.attach("s20-lite-worker-lifecycle.json", {
    body: Buffer.from(JSON.stringify({ statsAfterCancel, statsAfterRecovery }, null, 2)),
    contentType: "application/json",
  });

  expect(statsAfterRecovery?.created ?? 0).toBeGreaterThanOrEqual(2);
});
