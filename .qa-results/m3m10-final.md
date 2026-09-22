# Lite M3/M10 final

- workflow_sha: 9d3ea2f31a48fb7783ffd7101007557eda9503d2
- e2e_exit: 1

~~~text

Running 24 tests using 2 workers

[1A[2K[1/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:55:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[2/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[3/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:99:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[4/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:37:1 › módulo 10: round-trip 2+2 desde teclas reales produce 4
[1A[2K[5/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:52:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[6/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:69:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[7/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:87:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[8/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:96:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[9/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:55:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[10/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[11/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:99:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[12/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:37:1 › módulo 10: round-trip 2+2 desde teclas reales produce 4
[1A[2K[13/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:52:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[14/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:69:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[15/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:87:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[16/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:96:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[17/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:55:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[18/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[19/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI (retry #1)
[1A[2K  1) [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('section[aria-label="Resultado"]').first().locator('[role="status"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  20000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 20000ms[22m
    [2m  - waiting for locator('section[aria-label="Resultado"]').first().locator('[role="status"]').first()[22m


      80 |   await expect(resultRegion).toBeVisible({ timeout: 20000 });
      81 |   const status = resultRegion.locator('[role="status"]').first();
    > 82 |   await expect(status).toBeVisible({ timeout: 20000 });
         |                        ^
      83 |   const staticField = status.locator("math-field[read-only]").first();
      84 |   if (await staticField.count()) {
      85 |     return String(await staticField.evaluate((el) =>
        at renderedResultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:82:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:96:11

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


[1A[2K[20/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:99:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[21/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI (retry #1)
[1A[2K[22/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:99:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI (retry #1)
[1A[2K  2) [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for locator('section[aria-label="Entrada"]').first().getByRole('button', { name: 'Calcular', exact: true })[22m
    [2m    - locator resolved to <button type="button" class="rounded-lg bg-marker px-5 py-2 text-sm font-semibold text-chrome hover:bg-marker/90 disabled:opacity-40">Calcular</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  13 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      50 |   const calculate = inputRegion.getByRole("button", { name: "Calcular", exact: true });
      51 |   await expect(calculate).toBeEnabled({ timeout: 15000 });
    > 52 |   await calculate.click();
         |                   ^
      53 | }
      54 |
      55 | test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
        at calculateExpression (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:52:19)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:95:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for locator('section[aria-label="Entrada"]').first().getByRole('button', { name: 'Calcular', exact: true })[22m
    [2m    - locator resolved to <button type="button" class="rounded-lg bg-marker px-5 py-2 text-sm font-semibold text-chrome hover:bg-marker/90 disabled:opacity-40">Calcular</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  13 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      50 |   const calculate = inputRegion.getByRole("button", { name: "Calcular", exact: true });
      51 |   await expect(calculate).toBeEnabled({ timeout: 15000 });
    > 52 |   await calculate.click();
         |                   ^
      53 | }
      54 |
      55 | test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
        at calculateExpression (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:52:19)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:95:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module03-calcul-c5c08-se-evalúa-a-120-desde-la-UI-mobile-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[23/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:37:1 › módulo 10: round-trip 2+2 desde teclas reales produce 4
[1A[2K[24/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:52:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[25/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:69:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[26/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:87:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[27/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:96:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K  3) [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:99:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for locator('section[aria-label="Entrada"]').first().getByRole('button', { name: 'Calcular', exact: true })[22m
    [2m    - locator resolved to <button type="button" class="rounded-lg bg-marker px-5 py-2 text-sm font-semibold text-chrome hover:bg-marker/90 disabled:opacity-40">Calcular</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  13 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      50 |   const calculate = inputRegion.getByRole("button", { name: "Calcular", exact: true });
      51 |   await expect(calculate).toBeEnabled({ timeout: 15000 });
    > 52 |   await calculate.click();
         |                   ^
      53 | }
      54 |
      55 | test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
        at calculateExpression (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:52:19)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:100:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for locator('section[aria-label="Entrada"]').first().getByRole('button', { name: 'Calcular', exact: true })[22m
    [2m    - locator resolved to <button type="button" class="rounded-lg bg-marker px-5 py-2 text-sm font-semibold text-chrome hover:bg-marker/90 disabled:opacity-40">Calcular</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  13 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex items-center justify-between px-4 pb-2 pt-1">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div role="tablist" class="mb-3 flex flex-wrap gap-1 p-1" aria-label="Categorías del teclado matemático">…</div> from <div role="dialog" aria-modal="false" aria-label="Teclado matemático" class="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-chrome-soft bg-chrome shadow-2xl h-[66vh] md:h-[55vh] lg:h-[45vh] dt:inset-x-8 dt:bottom-[var(--keyboard-panel-bottom)] dt:mx-auto dt:h-auto dt:max-h-[45vh] dt:max-w-[1376px] dt:rounded-2xl dt:border">…</div> subtree intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      50 |   const calculate = inputRegion.getByRole("button", { name: "Calcular", exact: true });
      51 |   await expect(calculate).toBeEnabled({ timeout: 15000 });
    > 52 |   await calculate.click();
         |                   ^
      53 | }
      54 |
      55 | test("suite original módulo 3: inventario de Cálculo refleja capacidades actuales", async ({ page }) => {
        at calculateExpression (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:52:19)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:100:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module03-calcul-ca131--se-evalúa-a-15-desde-la-UI-mobile-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K  2 failed
    [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
    [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:99:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI 
  1 flaky
    [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:94:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
  21 passed (1.5m)
~~~
