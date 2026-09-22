# QA directed E2E diagnostic — Lite

- exit_code: 1

~~~text
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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:47:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K  8) [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:35:23

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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:35:23

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


[1A[2K[34/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:53:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[35/51] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:62:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[36/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:21:1 › M12: preferencias visuales se aplican y persisten tras recarga
[1A[2K[37/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:79:1 › M12: tema Automático sigue prefers-color-scheme
[1A[2K[38/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:91:1 › M12: Ajustes expone estado y cierra con Escape
[1A[2K[39/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:100:1 › M12: teclado propio tiene diálogo nombrado y cierra con Escape
[1A[2K[40/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:110:1 › M12: campo matemático principal tiene nombre accesible
[1A[2K[41/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:118:1 › M12: resultado calculado en Fusionada queda dentro de una región anunciable
[1A[2K[42/51] [tablet-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:148:1 › M12: vibración y sonido guardan preferencia y sobreviven recarga
[1A[2K[43/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:31:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[44/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:54:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[45/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[46/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:54:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI (retry #1)
[1A[2K[47/51] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI (retry #1)
[1A[2K  9) [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:54:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: getByRole('region', { name: 'Resultado', exact: true })
    Expected string: [32m"120"[39m
    Received: <element(s) not found>
    Timeout: 12000ms

    Call log:
    [2m  - Expect "toContainText" with timeout 12000ms[22m
    [2m  - waiting for getByRole('region', { name: 'Resultado', exact: true })[22m


      56 |
      57 |   const result = page.getByRole("region", { name: "Resultado", exact: true });
    > 58 |   await expect(result).toContainText("120", { timeout: 12000 });
         |                        ^
      59 | });
      60 |
      61 | test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:58:24

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

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: getByRole('region', { name: 'Resultado', exact: true })
    Expected string: [32m"120"[39m
    Received: <element(s) not found>
    Timeout: 12000ms

    Call log:
    [2m  - Expect "toContainText" with timeout 12000ms[22m
    [2m  - waiting for getByRole('region', { name: 'Resultado', exact: true })[22m


      56 |
      57 |   const result = page.getByRole("region", { name: "Resultado", exact: true });
    > 58 |   await expect(result).toContainText("120", { timeout: 12000 });
         |                        ^
      59 | });
      60 |
      61 | test("suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI", async ({ page }) => {
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:58:24

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


[1A[2K[48/51] [mobile-chromium] › e2e/exhaustive-module09-graphing.spec.ts:12:1 › suite original módulo 9: modos gráficos están activos y 2D renderiza
[1A[2K  10) [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: getByRole('region', { name: 'Resultado', exact: true })
    Expected string: [32m"15"[39m
    Received: <element(s) not found>
    Timeout: 12000ms

    Call log:
    [2m  - Expect "toContainText" with timeout 12000ms[22m
    [2m  - waiting for getByRole('region', { name: 'Resultado', exact: true })[22m


      63 |
      64 |   const result = page.getByRole("region", { name: "Resultado", exact: true });
    > 65 |   await expect(result).toContainText("15", { timeout: 12000 });
         |                        ^
      66 | });
      67 |
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:65:24

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

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: getByRole('region', { name: 'Resultado', exact: true })
    Expected string: [32m"15"[39m
    Received: <element(s) not found>
    Timeout: 12000ms

    Call log:
    [2m  - Expect "toContainText" with timeout 12000ms[22m
    [2m  - waiting for getByRole('region', { name: 'Resultado', exact: true })[22m


      63 |
      64 |   const result = page.getByRole("region", { name: "Resultado", exact: true });
    > 65 |   await expect(result).toContainText("15", { timeout: 12000 });
         |                        ^
      66 | });
      67 |
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:65:24

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


[1A[2K[49/51] [mobile-chromium] › e2e/exhaustive-module09-graphing.spec.ts:25:1 › suite original módulo 9: múltiples curvas 2D se renderizan juntas
[1A[2K[50/51] [mobile-chromium] › e2e/exhaustive-module09-graphing.spec.ts:37:1 › suite original módulo 9: discontinuidad no se une visualmente a través de la asíntota
[1A[2K[51/51] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[52/51] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:39:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[53/51] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) (retry #1)
[1A[2K[54/51] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:39:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas (retry #1)
[1A[2K  11) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:39:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 

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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:47:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium/trace.zip

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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:47:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-mobile-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K  12) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:35:23

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
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:35:23

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


[1A[2K[55/51] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:53:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[56/51] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:62:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[57/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:21:1 › M12: preferencias visuales se aplican y persisten tras recarga
[1A[2K[58/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:79:1 › M12: tema Automático sigue prefers-color-scheme
[1A[2K[59/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:91:1 › M12: Ajustes expone estado y cierra con Escape
[1A[2K[60/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:100:1 › M12: teclado propio tiene diálogo nombrado y cierra con Escape
[1A[2K[61/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:110:1 › M12: campo matemático principal tiene nombre accesible
[1A[2K[62/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:118:1 › M12: resultado calculado en Fusionada queda dentro de una región anunciable
[1A[2K[63/51] (retries) [mobile-chromium] › e2e/exhaustive-module12-personalization-a11y.spec.ts:148:1 › M12: vibración y sonido guardan preferencia y sobreviven recarga
[1A[2K  12 failed
    [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:54:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
    [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI 
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:39:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
    [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:54:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
    [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI 
    [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
    [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:39:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
    [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:54:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
    [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:61:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI 
    [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:26:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
    [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:39:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
  39 passed (3.6m)
~~~
