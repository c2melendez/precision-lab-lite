# QA M3/M10 final revalidation — Lite

- workflow_sha: cabf8cfd71c11937326e7c2b5508e3b6244657c6
- parser_exit: 0
- e2e_exit: 1

## Parser
~~~text

> precision-lab-lite@0.1.0 test
> vitest run tests/parsing.test.ts tests/plusMinus.test.ts


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/runner/work/precision-lab-lite/precision-lab-lite[39m

 [32m✓[39m tests/parsing.test.ts [2m([22m[2m53 tests[22m[2m)[22m[90m 35[2mms[22m[39m
 [32m✓[39m tests/plusMinus.test.ts [2m([22m[2m3 tests[22m[2m)[22m[90m 10[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m56 passed[39m[22m[90m (56)[39m
[2m   Start at [22m 06:11:49
[2m   Duration [22m 875ms[2m (transform 279ms, setup 0ms, collect 534ms, tests 45ms, environment 1ms, prepare 183ms)[22m

~~~

## E2E
~~~text

Running 24 tests using 2 workers

[1A[2K[1/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:31:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[2/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:65:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[3/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:70:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[4/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4
[1A[2K[5/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[6/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K[7/24] [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:65:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI (retry #1)
[1A[2K  1) [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:65:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.a11y-scale-result-3xl').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  12000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 12000ms[22m
    [2m  - waiting for locator('.a11y-scale-result-3xl').first()[22m


      54 | async function renderedResultValue(page: import("@playwright/test").Page): Promise<string> {
      55 |   const result = page.locator(".a11y-scale-result-3xl").first();
    > 56 |   await expect(result).toBeVisible({ timeout: 12000 });
         |                        ^
      57 |   return String(await result.evaluate((el) => {
      58 |     const maybeField = el as HTMLElement & { value?: string };
      59 |     return typeof maybeField.value === "string" && maybeField.value
        at renderedResultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:56:24)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module03-calculus.spec.ts:67:17

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


[1A[2K[8/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:81:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[9/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:90:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[10/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:31:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[11/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:65:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[12/24] [tablet-chromium] › e2e/exhaustive-module03-calculus.spec.ts:70:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[13/24] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas (retry #1)
[1A[2K[14/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4
[1A[2K[15/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[16/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K  2) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 

    Error: Resultado exitoso no renderizado. UI actual: ▤
    Historial
    Precision Lab Lite
    ⚙
    Científica
    Matrices
    Gráficas
    Estadística
    Unidades
    RAD
    Entrada
    Teclado
    ✕
    Calcular
    Resultado

    Aproximado numéricamente (no resuelto simbólicamente)

    dec
    frac
    scn
    sqrt
    Gráfica
    Graficar
    Historial
    Borrar todo

    Todavía no hay cálculos guardados.

    Teclado
    ✕
    Básico
    Símbolos
    Álgebra
    Trigonométricas
    Cálculo
    Complejos
    7
    8
    9
    (
    )
    ⌫
    DEL
    ANS
    4
    5
    6
    ×
    ÷
    %
    <
    >
    1
    2
    3
    +
    −
    .
    =
    ′
    0
    °
    DMS
    ±()
    ≤
    ≥
    ⏎
    Cerrar teclado

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:75:18

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

    Error: Resultado exitoso no renderizado. UI actual: ▤
    Historial
    Precision Lab Lite
    ⚙
    Científica
    Matrices
    Gráficas
    Estadística
    Unidades
    RAD
    Entrada
    Teclado
    ✕
    Calcular
    Resultado

    Aproximado numéricamente (no resuelto simbólicamente)

    dec
    frac
    scn
    sqrt
    Gráfica
    Graficar
    Historial
    Borrar todo

    Todavía no hay cálculos guardados.

    Teclado
    ✕
    Básico
    Símbolos
    Álgebra
    Trigonométricas
    Cálculo
    Complejos
    7
    8
    9
    (
    )
    ⌫
    DEL
    ANS
    4
    5
    6
    ×
    ÷
    %
    <
    >
    1
    2
    3
    +
    −
    .
    =
    ′
    0
    °
    DMS
    ±()
    ≤
    ≥
    ⏎
    Cerrar teclado

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:75:18

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


[1A[2K[17/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:81:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[18/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:90:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[19/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:31:1 › suite original módulo 3: inventario de Cálculo refleja capacidades actuales
[1A[2K[20/24] [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas (retry #1)
[1A[2K[21/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:65:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI
[1A[2K[22/24] [mobile-chromium] › e2e/exhaustive-module03-calculus.spec.ts:70:1 › suite original módulo 3: sumatoria de 1 a 5 se evalúa a 15 desde la UI
[1A[2K[23/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4
[1A[2K[24/24] [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[25/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K  3) [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 

    Error: Resultado exitoso no renderizado. UI actual: ▤
    Historial
    Precision Lab Lite
    ⚙
    Científica
    Matrices
    Gráficas
    Estadística
    Unidades
    RAD
    Entrada
    Teclado
    ✕
    Calcular
    Resultado

    Aproximado numéricamente (no resuelto simbólicamente)

    dec
    frac
    scn
    sqrt
    Gráfica
    Graficar
    Historial
    Borrar todo

    Todavía no hay cálculos guardados.

    Teclado
    ✕
    Básico
    Símbolos
    Álgebra
    Trigonométricas
    Cálculo
    Complejos
    7
    8
    9
    (
    )
    ⌫
    DEL
    ANS
    4
    5
    6
    ×
    ÷
    %
    <
    >
    1
    2
    3
    +
    −
    .
    =
    ′
    0
    °
    DMS
    ±()
    ≤
    ≥
    ⏎
    Cerrar teclado

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:75:18

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/exhaustive-module10-keyboa-081b5-ramas-matemáticas-distintas-tablet-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Resultado exitoso no renderizado. UI actual: ▤
    Historial
    Precision Lab Lite
    ⚙
    Científica
    Matrices
    Gráficas
    Estadística
    Unidades
    RAD
    Entrada
    Teclado
    ✕
    Calcular
    Resultado

    Aproximado numéricamente (no resuelto simbólicamente)

    dec
    frac
    scn
    sqrt
    Gráfica
    Graficar
    Historial
    Borrar todo

    Todavía no hay cálculos guardados.

    Teclado
    ✕
    Básico
    Símbolos
    Álgebra
    Trigonométricas
    Cálculo
    Complejos
    7
    8
    9
    (
    )
    ⌫
    DEL
    ANS
    4
    5
    6
    ×
    ÷
    %
    <
    >
    1
    2
    3
    +
    −
    .
    =
    ′
    0
    °
    DMS
    ±()
    ≤
    ≥
    ⏎
    Cerrar teclado

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:75:18

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


[1A[2K[26/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:81:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[27/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:90:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[28/24] (retries) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas (retry #1)
[1A[2K  4) [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 

    Error: Resultado exitoso no renderizado. UI actual: ▤
    Historial
    Precision Lab Lite
    ⚙
    Científica
    Matrices
    Gráficas
    Estadística
    Unidades
    RAD
    Entrada
    Teclado
    ✕
    Calcular
    Resultado

    Aproximado numéricamente (no resuelto simbólicamente)

    dec
    frac
    scn
    sqrt
    Gráfica
    Graficar
    Teclado
    ✕
    Básico
    Símbolos
    Álgebra
    Trigonométricas
    Cálculo
    Complejos
    7
    8
    9
    (
    )
    ⌫
    DEL
    ANS
    4
    5
    6
    ×
    ÷
    %
    <
    >
    1
    2
    3
    +
    −
    .
    =
    ′
    0
    °
    DMS
    ±()
    ≤
    ≥
    ⏎
    Calcular
    ⌫
    Cerrar

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:75:18

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

    Error: Resultado exitoso no renderizado. UI actual: ▤
    Historial
    Precision Lab Lite
    ⚙
    Científica
    Matrices
    Gráficas
    Estadística
    Unidades
    RAD
    Entrada
    Teclado
    ✕
    Calcular
    Resultado

    Aproximado numéricamente (no resuelto simbólicamente)

    dec
    frac
    scn
    sqrt
    Gráfica
    Graficar
    Teclado
    ✕
    Básico
    Símbolos
    Álgebra
    Trigonométricas
    Cálculo
    Complejos
    7
    8
    9
    (
    )
    ⌫
    DEL
    ANS
    4
    5
    6
    ×
    ÷
    %
    <
    >
    1
    2
    3
    +
    −
    .
    =
    ′
    0
    °
    DMS
    ±()
    ≤
    ≥
    ⏎
    Calcular
    ⌫
    Cerrar

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:75:18

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


[1A[2K  3 failed
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
    [tablet-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
    [mobile-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
  1 flaky
    [desktop-chromium] › e2e/exhaustive-module03-calculus.spec.ts:65:1 › suite original módulo 3: productoria de 1 a 5 se evalúa a 120 desde la UI 
  20 passed (1.3m)
~~~
