import { expect, test } from "@playwright/test";

// SG28: deterministic UI lifecycle test, not a real high-load performance test.
// A bounded fake compute worker holds the first response and permits normal
// computation after cancellation. Real-worker termination must be checked separately.
test("EN-SG-28 Scientific can cancel and recover without stale results", async ({ page }) => {
  await page.addInitScript(() => {
    // The Calculate button resides in Screen's split layout only.
    localStorage.setItem("precision-lab-layout-mode", "split");
    const NativeWorker = window.Worker;
    const instances: Array<{ terminated: boolean; requestId: string; deliverLate: () => void; emitError: () => void }> = [];
    (window as typeof window & { __sg28Instances?: typeof instances }).__sg28Instances = instances;
    window.Worker = class FakeComputeWorker {
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      private terminated = false;
      constructor(url: string | URL, options?: WorkerOptions) {
        // This suite runs in the isolated Playwright preview and only replaces
        // the calculator compute worker; all other workers remain native.
        if (!String(url).includes("compute.worker")) return new NativeWorker(url, options) as never;
        const record: { terminated: boolean; requestId: string; deliverLate: () => void; emitError: () => void } = {
          terminated: false,
          requestId: "",
          emitError: () => { this.onerror?.(new Event('error')); },
          deliverLate: () => {
            this.onmessage?.({ data: {
              success: true, requestId: record.requestId, resultLatex: "999999",
              steps: [], hasDetailedSteps: false, confidence: "SYMBOLIC",
            } } as MessageEvent);
          },
        };
        instances.push(record);
        Object.defineProperty(this, "terminated", {
          get: () => record.terminated,
          set: (value: boolean) => { record.terminated = value; },
        });
      }
      postMessage(data: { requestId: string }) {
        const record = instances[instances.length - 1];
        record.requestId = data.requestId;
        if (instances.length === 1 || instances.length === 3) {
          // Intentionally pending until cancel; no expensive calculation.
          return;
        }
        queueMicrotask(() => {
          if (!this.terminated) this.onmessage?.({ data: {
            success: true, requestId: data.requestId, resultLatex: "5",
            steps: [], hasDetailedSteps: false, confidence: "EXACT",
          } } as MessageEvent);
        });
      }
      terminate() { this.terminated = true; }
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true; }
    } as unknown as typeof Worker;
  });

  await page.goto("./");
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  await field.waitFor({ state: "visible" });
  async function setInput(value: string) {
    await field.evaluate((el, v) => {
      const math = el as HTMLElement & { setValue: (s: string, opts?: { silenceNotifications?: boolean }) => void };
      math.setValue(v, { silenceNotifications: true });
    }, value);
    await field.dispatchEvent("input", { bubbles: true });
  }
  const compute = page.getByRole("region", { name: "Entrada" })
    .getByRole("button", { name: "Calcular", exact: true });
  await setInput("2+3");
  await compute.click();

  const cancel = page.getByRole("button", { name: "Detener cálculo" });
  await expect(cancel).toBeVisible();
  await cancel.click();
  await expect(cancel).toHaveCount(0);
  expect(await page.evaluate(() => (window as typeof window & {
    __sg28Instances?: Array<{ terminated: boolean }>
  }).__sg28Instances?.[0]?.terminated)).toBe(true);

  // A simulated message from the terminated instance must not be displayed.
  await page.evaluate(() => (window as typeof window & {
    __sg28Instances?: Array<{ deliverLate: () => void }>
  }).__sg28Instances?.[0]?.deliverLate());
  // If no previous result exists, the status node is absent. This is a
  // valid cancellation outcome; assert on the entire page instead.
  await expect(page.locator("body")).not.toContainText("999999");

  await setInput("2+3");
  await compute.click();
  await expect(page.locator('[data-result-request-id]')).toContainText("5");
  await expect(cancel).toHaveCount(0);
  expect(await page.evaluate(() => (window as typeof window & {
    __sg28Instances?: Array<{ terminated: boolean }>
  }).__sg28Instances?.length)).toBe(2);

  // Scientific intentionally retires its previous worker at each Calcular.
  // Simulate a worker error on the third instance and verify recovery.
  await setInput("3+4");
  await compute.click();
  await expect(cancel).toBeVisible();
  await page.evaluate(() => (window as typeof window & {
    __sg28Instances?: Array<{ emitError: () => void }>
  }).__sg28Instances?.[2]?.emitError());
  await expect(cancel).toHaveCount(0);
  await expect(page.getByRole("alert").filter({ hasText: "interrumpió" })).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & {
    __sg28Instances?: Array<{ terminated: boolean }>
  }).__sg28Instances?.[2]?.terminated)).toBe(true);

  await setInput("2+3");
  await compute.click();
  await expect(page.locator('[data-result-request-id]')).toContainText("5");
  expect(await page.evaluate(() => (window as typeof window & {
    __sg28Instances?: Array<{ terminated: boolean }>
  }).__sg28Instances?.length)).toBe(4);
});


test("EN-SG-28 Scientific real worker resumes ordinary calculation", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "split");
  });
  // This test does NOT replace Worker and uses a bounded trivial input.
  // It proves that the built worker path can still produce a real result.
  await page.goto("./");
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  await field.waitFor({ state: "visible" });
  await field.evaluate(el => {
    const math = el as HTMLElement & {
      setValue: (value: string, opts?: { silenceNotifications?: boolean }) => void
    };
    math.setValue("2+3", { silenceNotifications: true });
  });
  await field.dispatchEvent("input", { bubbles: true });
  await page.getByRole("region", { name: "Entrada" })
    .getByRole("button", { name: "Calcular", exact: true }).click();
  const status = page.locator('[data-result-request-id]').first();
  await expect(status).toHaveAttribute("data-result-request-id", /.+/, { timeout: 15_000 });
  // Wait for the computed canonical value, not merely for a request-id
  // attribute that could belong to an earlier or transitional render.
  await expect.poll(async () => {
    const value = await status.getAttribute("data-result-reentry-latex");
    return value?.replace(/\s+/g, "") ?? "";
  }, { timeout: 15_000 }).toMatch(/^5(?:\.0+)?$/);
  await expect(page.getByRole("button", { name: "Detener cálculo" })).toHaveCount(0);
});

test("EN-SG-28 terminate a real busy worker and recover", async ({ page }) => {
  // A genuine browser Worker performing bounded, deterministic work.
  // No extreme input, backend request, or production load is involved.
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "split");
    const NativeWorker = window.Worker;
    let started = false;
    let terminated = false;
    (window as typeof window & {
      __sg28RealWorkerState?: () => { started: boolean; terminated: boolean }
    }).__sg28RealWorkerState = () => ({ started, terminated });
    window.Worker = class BoundedWorkerProxy {
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      private actual: Worker;
      constructor(url: string | URL, options?: WorkerOptions) {
        if (!String(url).includes("compute.worker")) return new NativeWorker(url, options) as never;
        const blob = new Blob([`
          self.onmessage = function(event) {
            const started = performance.now();
            // Deliberately bounded at 400ms, enough to click Cancel in CI.
            while (performance.now() - started < 400) {}
            self.postMessage({
              success: true, requestId: event.data.requestId, resultLatex: "999999",
              steps: [], hasDetailedSteps: false, confidence: "SYMBOLIC"
            });
          };
        `], { type: "text/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        this.actual = new NativeWorker(workerUrl);
        URL.revokeObjectURL(workerUrl);
        this.actual.onmessage = (event) => this.onmessage?.(event);
        this.actual.onerror = (event) => this.onerror?.(event);
      }
      postMessage(data: unknown) {
        started = true;
        this.actual.postMessage(data);
      }
      terminate() {
        terminated = true;
        this.actual.terminate();
      }
    } as unknown as typeof Worker;
  });
  await page.goto("./");
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  await field.waitFor({ state: "visible" });
  await field.evaluate(el => {
    (el as HTMLElement & { setValue: (value: string) => void }).setValue("2+3");
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "2+3" }));
  });
  await page.getByRole("region", { name: "Entrada" })
    .getByRole("button", { name: "Calcular", exact: true }).click();
  const cancel = page.getByRole("button", { name: "Detener cálculo" });
  await expect(cancel).toBeVisible();
  await cancel.click();
  await expect.poll(() => page.evaluate(() => (
    window as typeof window & { __sg28RealWorkerState: () => { terminated: boolean } }
  ).__sg28RealWorkerState().terminated)).toBe(true);
  await expect(page.locator("body")).not.toContainText("999999");
});

test("EN-SG-28 compiled math worker terminates and a fresh instance recovers", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "split");
    const NativeWorker = window.Worker;
    (window as typeof window & { __sg28CompiledWorkerUrl?: string }).__sg28CompiledWorkerUrl = "";
    window.Worker = class TrackedWorker extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        if (String(url).includes("compute.worker")) {
          (window as typeof window & { __sg28CompiledWorkerUrl?: string }).__sg28CompiledWorkerUrl = String(url);
        }
      }
    };
  });
  await page.goto("./");
  const field = page.locator('math-field[aria-label="Entrada matemática"]').first();
  await field.waitFor({ state: "visible" });
  await field.evaluate(el => {
    (el as HTMLElement & { setValue: (v: string) => void }).setValue("2+3");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("region", { name: "Entrada" })
    .getByRole("button", { name: "Calcular", exact: true }).click();
  await expect(page.locator('[data-result-request-id]')).toHaveAttribute("data-result-request-id", /.+/);
  const result = await page.evaluate(async () => {
    const url = (window as typeof window & { __sg28CompiledWorkerUrl?: string }).__sg28CompiledWorkerUrl;
    if (!url) throw new Error("Compute worker URL not captured");
    const first = new Worker(url, { type: "module" });
    first.postMessage({ type: "evaluate", requestId: "sg28-discard", expressionAlgebrite: "2+3" });
    first.terminate();
    const next = new Worker(url, { type: "module" });
    try {
      return await new Promise<{ requestId?: string; resultLatex?: string | null; success?: boolean }>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Fresh math worker did not recover")), 10_000);
        next.onerror = () => { clearTimeout(timer); reject(new Error("Fresh math worker error")); };
        next.onmessage = (event) => { clearTimeout(timer); resolve(event.data); };
        next.postMessage({ type: "evaluate", requestId: "sg28-recovery", expressionAlgebrite: "2+3" });
      });
    } finally {
      next.terminate();
    }
  });
  expect(result.requestId).toBe("sg28-recovery");
  expect(result.success).toBe(true);
  expect(result.resultLatex?.replace(/\s+/g, "")).toMatch(/^5(?:\.0+)?$/);
});
