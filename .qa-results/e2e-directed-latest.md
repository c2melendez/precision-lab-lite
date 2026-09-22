# QA M10 exact-commit diagnostic — Lite

- workflow_sha: 99da10301bc4089d5ce711e3d62a4f20d7f330f5
- parser_exit: 0
- e2e_exit: 1

## Parser
~~~text

> precision-lab-lite@0.1.0 test
> vitest run tests/parsing.test.ts


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/runner/work/precision-lab-lite/precision-lab-lite[39m

 [32m✓[39m tests/parsing.test.ts [2m([22m[2m53 tests[22m[2m)[22m[90m 24[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m53 passed[39m[22m[90m (53)[39m
[2m   Start at [22m 06:09:22
[2m   Duration [22m 616ms[2m (transform 140ms, setup 0ms, collect 175ms, tests 24ms, environment 0ms, prepare 184ms)[22m

~~~

## E2E
~~~text

Running 5 tests using 2 workers

[1A[2K[1/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5)
[1A[2K[2/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4
[1A[2K[3/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4 (retry #1)
[1A[2K[4/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) (retry #1)
[1A[2K  1) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4 

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
    Calcular
    Resultado

    Escribe una expresión y presiona Calcular.

    Gráfica
    Escribe una expresión y presiona Graficar.
    Historial
    Borrar todo

    CIENTÍFICA

    2+2

    4

    9/22/2026, 6:10:10 AM

    Teclado

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:42:18

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


[1A[2K[5/5] [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas
[1A[2K  2) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 

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
    Calcular
    Resultado

    Escribe una expresión y presiona Calcular.

    Gráfica
    Escribe una expresión y presiona Graficar.
    Historial
    Borrar todo

    CIENTÍFICA

    50\%

    \frac{1}{2}

    9/22/2026, 6:10:10 AM

    Teclado

      19 |   } catch {
      20 |     const bodyText = await page.locator("body").innerText();
    > 21 |     throw new Error("Resultado exitoso no renderizado. UI actual: " + bodyText.slice(-1800));
         |           ^
      22 |   }
      23 |   return String(await result.evaluate((el) => {
      24 |     const maybeField = el as HTMLElement & { value?: string };
        at resultValue (/home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:21:11)
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/exhaustive-module10-keyboard.spec.ts:59:17

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


[1A[2K[6/5] (retries) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:81:1 › módulo 10: Productoria Π ya no aparece como pendiente
[1A[2K[7/5] (retries) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:90:1 › módulo 10: acciones no aritméticas de Álgebra exponen tooltip
[1A[2K[8/5] (retries) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas (retry #1)
[1A[2K  3) [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 

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


[1A[2K  1 failed
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:63:1 › módulo 10: ±(5) produce dos ramas matemáticas distintas 
  2 flaky
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:31:1 › módulo 10 diagnóstico: 2+2 desde teclas reales produce 4 
    [desktop-chromium] › e2e/exhaustive-module10-keyboard.spec.ts:46:1 › módulo 10: la tecla % calcula porcentaje real (50% = 0.5) 
  2 passed (48.8s)
~~~
