# QA directed E2E diagnostic — Lite

- exit_code: 1

~~~text

Running 5 tests using 2 workers

[1A[2K[1/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4
[1A[2K[2/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:41:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[3/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4 (retry #1)
[1A[2K  1) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

    Expected pattern: [32m/2\\+2/[39m
    Received string:  [31m"2+2"[39m

      33 |   const field = page.locator("math-field").first();
      34 |   const fieldValue = await field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
    > 35 |   expect(fieldValue.replace(/\\s/g, "")).toMatch(/2\\+2/);
         |                                          ^
      36 |   await dialog.getByRole("button", { name: "calcular", exact: true }).click();
      37 |   const value = (await resultValue(page)).replace(/\\s/g, "");
      38 |   expect(value).toContain("4");
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:35:42

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

    Expected pattern: [32m/2\\+2/[39m
    Received string:  [31m"2+2"[39m

      33 |   const field = page.locator("math-field").first();
      34 |   const fieldValue = await field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
    > 35 |   expect(fieldValue.replace(/\\s/g, "")).toMatch(/2\\+2/);
         |                                          ^
      36 |   await dialog.getByRole("button", { name: "calcular", exact: true }).click();
      37 |   const value = (await resultValue(page)).replace(/\\s/g, "");
      38 |   expect(value).toContain("4");
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:35:42

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-3ef4f-sde-teclas-reales-produce-4-desktop-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[4/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:58:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[5/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:58:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas (retry #1)
[1A[2K  2) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:58:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

    Expected pattern: [32m/\\\\pm|±/[39m
    Received string:  [31m"\\pm\\left(5\\right)"[39m

      64 |   const pmField = page.locator("math-field").first();
      65 |   const pmLatex = await pmField.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
    > 66 |   expect(pmLatex).toMatch(/\\\\pm|±/);
         |                   ^
      67 |   expect(pmLatex).toContain("5");
      68 |   await dialog.getByRole("button", { name: "calcular", exact: true }).click();
      69 |
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:66:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

    Expected pattern: [32m/\\\\pm|±/[39m
    Received string:  [31m"\\pm\\left(5\\right)"[39m

      64 |   const pmField = page.locator("math-field").first();
      65 |   const pmLatex = await pmField.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? ""));
    > 66 |   expect(pmLatex).toMatch(/\\\\pm|±/);
         |                   ^
      67 |   expect(pmLatex).toContain("5");
      68 |   await dialog.getByRole("button", { name: "calcular", exact: true }).click();
      69 |
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:66:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-desktop-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[6/5] (retries) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:76:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[7/5] (retries) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:85:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[8/5] (retries) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:41:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) (retry #1)
[1A[2K  3) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:41:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.a11y-scale-result-3xl').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('.a11y-scale-result-3xl').first()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator(".a11y-scale-result-3xl").first();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate((el) => {
      19 |     const maybeField = el as HTMLElement & { value?: string };
      20 |     return typeof maybeField.value === "string" && maybeField.value
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:54:23

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.a11y-scale-result-3xl').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('.a11y-scale-result-3xl').first()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator(".a11y-scale-result-3xl").first();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate((el) => {
      19 |     const maybeField = el as HTMLElement & { value?: string };
      20 |     return typeof maybeField.value === "string" && maybeField.value
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:54:23

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--desktop-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K  3 failed
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4 
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:41:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:58:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
  2 passed (32.2s)
~~~
