# QA E2E diagnostic — Lite

- outcome: failure

## directed E2E
~~~text

Running 51 tests using 2 workers

[1A[2K[1/51] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:20:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[2/51] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:43:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[3/51] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:55:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[4/51] [desktop-chromium] › e2e/exhaustive-module09-graphing.spec.ts:12:1 › suite original módulo 9: modos gráficos están activos y 2D renderiza
[1A[2K[5/51] [desktop-chromium] › e2e/exhaustive-module09-graphing.spec.ts:25:1 › suite original módulo 9: múltiples curvas 2D se renderizan juntas
[1A[2K[6/51] [desktop-chromium] › e2e/exhaustive-module09-graphing.spec.ts:37:1 › suite original módulo 9: discontinuidad no se une visualmente a través de la asíntota
[1A[2K[7/51] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[8/51] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:43:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI (retry #1)
[1A[2K  1) [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:43:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: getByRole('region', { name: 'Resultado', exact: true })
    Expected string: [32m"120"[39m
    Received string: [31m"ResultadoEscribe una expresión y presiona Calcular."[39m
    Timeout: 12000ms

    Call log:
    [2m  - Expect "toContainText" with timeout 12000ms[22m
    [2m  - waiting for getByRole('region', { name: 'Resultado', exact: true })[22m
    [2m    15 × locator resolved to <section aria-label="Resultado" class="min-w-0 rounded-xl border border-paper-line bg-paper-soft shadow-sm">…</section>[22m
    [2m       - unexpected value "ResultadoEscribe una expresión y presiona Calcular."[22m


      50 |
      51 |   const result = page.getByRole("region", { name: "Resultado", exact: true });
    > 52 |   await expect(result).toContainText("120", { timeout: 12000 });
         |                        ^
      53 | });
      54 |
      55 | test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:52:24

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


[1A[2K[9/51] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:34:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[10/51] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:48:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[11/51] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:57:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[12/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:21:1 › M12: preferencias visuales se aplican y persisten tras recarga
[1A[2K[13/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:79:1 › M12: tema Automático sigue prefers-color-scheme
[1A[2K[14/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:91:1 › M12: Ajustes expone estado y cierra con Escape
[1A[2K[15/51] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) (retry #1)
[1A[2K[16/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:100:1 › M12: teclado propio tiene diálogo nombrado y cierra con Escape
[1A[2K[17/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:110:1 › M12: campo matemático principal tiene nombre accesible
[1A[2K[18/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:118:1 › M12: resultado calculado en Fusionada queda dentro de una región anunciable
[1A[2K[19/51] [desktop-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:148:1 › M12: vibración y sonido guardan preferencia y sobreviven recarga
[1A[2K[20/51] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:20:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[21/51] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:43:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[22/51] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:55:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[23/51] [tablet-chromium] › e2e/exhaustive-module09-graphing.spec.ts:12:1 › suite original módulo 9: modos gráficos están activos y 2D renderiza
[1A[2K[24/51] [tablet-chromium] › e2e/exhaustive-module09-graphing.spec.ts:25:1 › suite original módulo 9: múltiples curvas 2D se renderizan juntas
[1A[2K[25/51] [tablet-chromium] › e2e/exhaustive-module09-graphing.spec.ts:37:1 › suite original módulo 9: discontinuidad no se une visualmente a través de la asíntota
[1A[2K[26/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K  2) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('math-field[read-only]').last()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('math-field[read-only]').last()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator("math-field[read-only]").last();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate(el => (el as HTMLElement & { value: string }).value));
      19 | }
      20 |
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:30:23

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

    Locator:  locator('math-field[read-only]').last()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('math-field[read-only]').last()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator("math-field[read-only]").last();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate(el => (el as HTMLElement & { value: string }).value));
      19 | }
      20 |
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:30:23

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


[1A[2K[27/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:34:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[28/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:48:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[29/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:57:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[30/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:21:1 › M12: preferencias visuales se aplican y persisten tras recarga
[1A[2K[31/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:79:1 › M12: tema Automático sigue prefers-color-scheme
[1A[2K[32/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:91:1 › M12: Ajustes expone estado y cierra con Escape
[1A[2K[33/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:100:1 › M12: teclado propio tiene diálogo nombrado y cierra con Escape
[1A[2K[34/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:110:1 › M12: campo matemático principal tiene nombre accesible
[1A[2K[35/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:118:1 › M12: resultado calculado en Fusionada queda dentro de una región anunciable
[1A[2K[36/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:148:1 › M12: vibración y sonido guardan preferencia y sobreviven recarga
[1A[2K[37/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:20:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[38/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) (retry #1)
[1A[2K[39/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:43:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[40/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:55:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[41/51] [mobile-chromium] › e2e/exhaustive-module09-graphing.spec.ts:12:1 › suite original módulo 9: modos gráficos están activos y 2D renderiza
[1A[2K[42/51] [mobile-chromium] › e2e/exhaustive-module09-graphing.spec.ts:25:1 › suite original módulo 9: múltiples curvas 2D se renderizan juntas
[1A[2K[43/51] [mobile-chromium] › e2e/exhaustive-module09-graphing.spec.ts:37:1 › suite original módulo 9: discontinuidad no se une visualmente a través de la asíntota
[1A[2K[44/51] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[45/51] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) (retry #1)
[1A[2K  3) [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('math-field[read-only]').last()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('math-field[read-only]').last()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator("math-field[read-only]").last();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate(el => (el as HTMLElement & { value: string }).value));
      19 | }
      20 |
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:30:23

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('dialog', { name: 'Teclado matemático' }).getByRole('button', { name: 'porcentaje', exact: true })[22m
    [2m    - locator resolved to <button type="button" aria-label="porcentaje" title="inserta el símbolo de porcentaje" class="rounded-md bg-chrome-soft/80 py-2.5 a11y-key-sm font-medium text-bone hover:bg-chrome-soft/60">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div dir="ltr" class="MLK__row">…</div> from <div class="ML__keyboard is-visible is-math-mode can-undo can-paste">…</div> subtree intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div dir="ltr" class="MLK__row">…</div> from <div class="ML__keyboard is-visible is-math-mode can-undo can-paste">…</div> subtree intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    53 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div dir="ltr" class="MLK__row">…</div> from <div class="ML__keyboard is-visible is-math-mode can-undo can-paste">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      25 |   await dialog.getByRole("button", { name: "5", exact: true }).click();
      26 |   await dialog.getByRole("button", { name: "0", exact: true }).click();
    > 27 |   await dialog.getByRole("button", { name: "porcentaje", exact: true }).click();
         |                                                                         ^
      28 |   await dialog.getByRole("button", { name: "calcular", exact: true }).click();
      29 |
      30 |   const value = await resultValue(page);
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:27:73

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--tablet-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[46/51] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:34:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[47/51] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:48:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[48/51] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:57:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[49/51] [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:21:1 › M12: preferencias visuales se aplican y persisten tras recarga
[1A[2K  4) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('math-field[read-only]').last()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('math-field[read-only]').last()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator("math-field[read-only]").last();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate(el => (el as HTMLElement & { value: string }).value));
      19 | }
      20 |
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:30:23

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('math-field[read-only]').last()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('math-field[read-only]').last()[22m


      15 | async function resultValue(page: import("@playwright/test").Page): Promise<string> {
      16 |   const result = page.locator("math-field[read-only]").last();
    > 17 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      18 |   return String(await result.evaluate(el => (el as HTMLElement & { value: string }).value));
      19 | }
      20 |
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:17:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:30:23

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-f3e11-ula-porcentaje-real-50-0-5--mobile-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[50/51] [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:91:1 › M12: Ajustes expone estado y cierra con Escape
[1A[2K[51/51] [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:79:1 › M12: tema Automático sigue prefers-color-scheme
[1A[2K[52/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:100:1 › M12: teclado propio tiene diálogo nombrado y cierra con Escape
[1A[2K[53/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:110:1 › M12: campo matemático principal tiene nombre accesible
[1A[2K[54/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:118:1 › M12: resultado calculado en Fusionada queda dentro de una región anunciable
[1A[2K[55/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:148:1 › M12: vibración y sonido guardan preferencia y sobreviven recarga
[1A[2K  3 failed
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
    [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
    [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:21:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
  1 flaky
    [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:43:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
  47 passed (1.6m)
~~~
