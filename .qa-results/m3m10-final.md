# Lite M3/M10 final

- workflow_sha: 4b63f10e3dba9d276231c9e979b2859952305ae5
- e2e_exit: 0

~~~text

Running 24 tests using 2 workers

[1A[2K[1/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[2/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:100:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[3/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:105:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[4/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: round-trip 2+2 desde teclas reales produce 4
[1A[2K[5/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:62:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[6/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:80:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[7/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:99:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[8/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:108:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[9/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[10/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:100:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[11/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:105:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[12/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: round-trip 2+2 desde teclas reales produce 4
[1A[2K[13/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:62:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[14/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:80:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[15/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:99:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[16/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:108:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[17/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[18/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:100:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[19/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:105:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[20/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: round-trip 2+2 desde teclas reales produce 4
[1A[2K[21/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:100:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI (retry #1)
[1A[2K[22/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:62:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K  1) [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:100:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('section[aria-label="Resultado"]').first().locator('[role="status"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  20000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 20000ms[22m
    [2m  - waiting for locator('section[aria-label="Resultado"]').first().locator('[role="status"]').first()[22m


      86 |   await expect(resultRegion).toBeVisible({ timeout: 20000 });
      87 |   const status = resultRegion.locator('[role="status"]').first();
    > 88 |   await expect(status).toBeVisible({ timeout: 20000 });
         |                        ^
      89 |   const staticField = status.locator("math-field[read-only]").first();
      90 |   if (await staticField.count()) {
      91 |     return String(await staticField.evaluate((el) =>
        at renderedResultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:88:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:102:11

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-desktop-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-desktop-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-desktop-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-desktop-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-desktop-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[23/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:99:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[24/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:80:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[25/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:108:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K  1 flaky
    [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:100:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
  23 passed (33.5s)
~~~
