# QA navigation diagnostic — Lite

- workflow_sha: 45cd085d1892e6fc6af69319e7704453b6a7756d
- exit: 1

~~~text

Running 1 test using 1 worker

[1A[2K[1/1] [desktop-chromium] › e2e/diagnostic-navigation.spec.ts:3:1 › diagnóstico de navegación al calcular Lite
[1A[2K[2/1] (retries) [desktop-chromium] › e2e/diagnostic-navigation.spec.ts:3:1 › diagnóstico de navegación al calcular Lite (retry #1)
[1A[2K  1) [desktop-chromium] › e2e/diagnostic-navigation.spec.ts:3:1 › diagnóstico de navegación al calcular Lite 

    Error: NAV_DIAGNOSTIC
    CONSOLE: DIAG_CLICK_CALC type=button form=false defaultPrevented=false
    CONSOLE: DIAG_BEFOREUNLOAD
    NAV: http://127.0.0.1:4173/precision-lab-lite/
    CONSOLE: [vite] connecting...
    CONSOLE: [vite] connected.
    CONSOLE: %cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools font-weight:bold
    URL_AFTER: http://127.0.0.1:4173/precision-lab-lite/
    NAV_ENTRIES: [{"name":"http://127.0.0.1:4173/precision-lab-lite/","type":"reload"}]
    BODY_HAS_RESULT_CLASS: 0
    BODY_TAIL: "▤\nHistorial\nPrecision Lab Lite\n⚙\nCientífica\nMatrices\nGráficas\nEstadística\nUnidades\nRAD\nEntrada\nTeclado\nCalcular\nResultado\n\nEscribe una expresión y presiona Calcular.\n\nGráfica\nEscribe una expresión y presiona Graficar.\nHistorial\nBorrar todo\n\nCIENTÍFICA\n\n2+2\n\n4\n\n9/22/2026, 6:15:58 AM\n\nTeclado"

      75 |   relevant.push("BODY_TAIL: " + JSON.stringify(after.slice(-1200)));
      76 |
    > 77 |   throw new Error("NAV_DIAGNOSTIC\n" + relevant.join("\n"));
         |         ^
      78 | });
      79 |
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/diagnostic-navigation.spec.ts:77:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: NAV_DIAGNOSTIC
    CONSOLE: DIAG_CLICK_CALC type=button form=false defaultPrevented=false
    URL_AFTER: http://127.0.0.1:4173/precision-lab-lite/
    NAV_ENTRIES: [{"name":"http://127.0.0.1:4173/precision-lab-lite/","type":"navigate"}]
    BODY_HAS_RESULT_CLASS: 1
    BODY_TAIL: "▤\nHistorial\nPrecision Lab Lite\n⚙\nCientífica\nMatrices\nGráficas\nEstadística\nUnidades\nRAD\nEntrada\nTeclado\n✕\nCalcular\nResultado\n4\ndec\nfrac\nscn\nsqrt\nGráfica\nGraficar\nHistorial\nBorrar todo\n\nTodavía no hay cálculos guardados.\n\nTeclado\n✕\nBásico\nSímbolos\nÁlgebra\nTrigonométricas\nCálculo\nComplejos\n7\n8\n9\n(\n)\n⌫\nDEL\nANS\n4\n5\n6\n×\n÷\n%\n<\n>\n1\n2\n3\n+\n−\n.\n=\n′\n0\n°\nDMS\n±()\n≤\n≥\n⏎\nCerrar teclado"

      75 |   relevant.push("BODY_TAIL: " + JSON.stringify(after.slice(-1200)));
      76 |
    > 77 |   throw new Error("NAV_DIAGNOSTIC\n" + relevant.join("\n"));
         |         ^
      78 | });
      79 |
        at /home/runner/work/precision-lab-lite/precision-lab-lite/e2e/diagnostic-navigation.spec.ts:77:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium-retry1/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/diagnostic-navigation-diag-3995f-navegación-al-calcular-Lite-desktop-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K  1 failed
    [desktop-chromium] › e2e/diagnostic-navigation.spec.ts:3:1 › diagnóstico de navegación al calcular Lite 
~~~
