## 2026-11-25 — polos en formas equivalentes de 1/x²

Lite SHA técnico `58e369e5ec84c571bf540af591df90770819e5fe`: al cruzar cero, `(1/x)^2`, `x^(-2)`, `1/(x*x)` y `1/(x)^2` devolvían -2 en [-1,1]; ahora se rechazan con DOMAIN_ERROR, con controles finitos y límites invertidos. Cuatro suites focales 34 PASS (ocho pruebas nuevas); typecheck PASS. [Acumulativo 45661127323](https://github.com/c2melendez/precision-lab-lite/actions/runs/45661127323) y gates asociados en cola; no declarar CI PASS. Estas formas son casos de regresión, no 80 IDs nuevos; no demuestra ausencia de singularidades generales ni cierra matriz. Sigue pendiente estabilidad IT-HI-01/10 preservando ramas, paridad y bloqueos S25, SG28/DIST y EV-D-01. Siguiente: revisar gates por SHA, reconciliar índices y continuar lote sin duplicar.

## 2026-11-25 — Plus reciprocal poles CI SUCCESS; next IT-HI stability

Lite technical `b16665e621dac4e3e4850d902d997d024e3ade43`: [acumulativo 45629401854](https://github.com/c2melendez/precision-lab-lite/actions/runs/45629401854) SUCCESS (job 139258227146), 3034 PASS / 15 XFAIL / 34 TODO, 9 `definiteIntegralInversePower` executed.

Plus technical `5897cdc4e341d98aa410029187d760b731461c6c`: [acumulativo 45639907561](https://github.com/c2melendez/precision-lab-plus/actions/runs/45639907561) SUCCESS (backend job 139295361150, frontend 139295361558). H1d 45639907795 SUCCESS, CI 45639907897 SUCCESS. Six HTTP tests for 1/x² and 1/x³ poles, crossed/inverted limits and finite controls. Local suite 14 PASS. Security run 45582006420 remains CANCELLED and does not close S25.

No new matrix IDs assigned; not 80 new cases; guards do not prove general convergence. S25, SG28/DIST and EV-D-01 remain BLOCKED. Global certification OPEN.

**Siguiente acción exacta:** resolver estabilidad numérica IT-HI-01/10 en Lite (cancelación en argumentos negativos grandes de las primitivas asinh / x·asinh) preservando ramas complejas; ampliar cobertura de singularidades y paridad bilateral sin relajar oráculos ni duplicar gates verdes.

## 2026-11-25 — paridad parcial para polos de potencias recíprocas

Lite `b16665e621dac4e3e4850d902d997d024e3ade43`: [acumulativo 45629401854](https://github.com/c2melendez/precision-lab-lite/actions/runs/45629401854), job 139258227146 SUCCESS, log revisado: 3034 PASS, 15 XFAIL, 34 TODO, con 9 pruebas de `definiteIntegralInversePower` ejecutadas.

Plus `5897cdc4e341d98aa410029187d760b731461c6c`: 6 pruebas HTTP adicionales para 1/x² y 1/x³, cruces, límites invertidos y controles finitos; suite local 14 PASS, 1 advertencia de dependencia. [Acumulativo 45639907561](https://github.com/c2melendez/precision-lab-plus/actions/runs/45639907561) en curso; no declarar CI PASS hasta revisar logs. [Seguridad 45582006420](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006420) terminó CANCELLED; no acredita seguridad ni cierre S25. No se asignaron nuevos IDs de matriz; no son 80 casos nuevos ni cierre global. Las guardas no demuestran convergencia general. Siguiente: revisar CI Plus y reconciliar índices; continuar IT-HI-01/10, cobertura de singularidades y paridad. S25, SG28/DIST y EV-D-01 permanecen bloqueados.

## 2026-11-25 — polos de potencias recíprocas y CI previo

Lite `7cd7e31a8340413536e042864cb4ab18cfb475a4`: [acumulativo 45618692308](https://github.com/c2melendez/precision-lab-lite/actions/runs/45618692308), job 139220751446 SUCCESS; log ejecutado: 3025 PASS, 15 XFAIL, 34 TODO, incluidas las cinco pruebas definiteIntegralNonfinite. No acredita cierre global.

Lite `b16665e621dac4e3e4850d902d997d024e3ade43` rechaza integrales de formas reconocidas 1/x^n con n entero positivo si el intervalo contiene cero, en lugar de devolver valores finitos falsos; pruebas locales 26 PASS (9 nuevas y 17 regresiones), typecheck PASS. [Acumulativo 45629401854](https://github.com/c2melendez/precision-lab-lite/actions/runs/45629401854) y demás gates en cola. Estas pruebas no son 26 casos de matriz ni un lote nuevo de 80. La guarda no detecta toda singularidad, formas equivalentes, ni demuestra convergencia general. Quedan pendientes IT-HI-01/10, paridad Plus, interfaz, y bloqueos S25, SG28/DIST y EV-D-01. Siguiente: revisar CI del SHA técnico, reconciliar índices y continuar detección de polos/paridad sin duplicar corridas.

## 2026-11-25 — Lite: rechazo de resultados no finitos (CI pendiente)

SHA técnico `7cd7e31a8340413536e042864cb4ab18cfb475a4`: `calcDefiniteIntegral` rechaza resultados simbólicos o numéricos no finitos con DOMAIN_ERROR y preserva resultados complejos finitos. Pruebas locales: 17 PASS (5 regresiones nuevas y 12 polos existentes); typecheck PASS. Acumulativo [45618692308](https://github.com/c2melendez/precision-lab-lite/actions/runs/45618692308) y demás gates en cola; no se declara PASS de CI. No son 17 filas de matriz ni 80 casos nuevos.

Limitación reproducida en prueba exploratoria: integral de `1/x^2` en [-1,1] devuelve -2 pese al polo interior; la nueva guarda solo detecta resultados no finitos y no certifica convergencia. Siguiente: revisar CI del SHA técnico y abordar detección general de singularidades, estabilidad IT-HI-01/10 y paridad, sin repetir gates en curso. S25, SG28/DIST y EV-D-01 permanecen bloqueados.

## TR324 Reconciliación de índices bilaterales y CI verificado — 2026-11-25 UTC

Evidencia de CI verificada bilateralmente para los SHAs técnicos vigentes:
- Plus SHA técnico `c2d66e7124ce7f2bbc652009e610293f30044ab4`: acumulativo [45582006410](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410) completó SUCCESS. Job backend [139094132064](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410/job/139094132064): 3554 passed, 1 skipped, 35 xfailed. Job frontend [139094131945](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410/job/139094131945): 150 archivos de test passed, 1055 passed, 28 todo. Reconciliación HTTP de los 80 casos originales: 70 PASSED (parcial) y 10 XFAIL. H1d [45582006239](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006239) job 139094131149 completó SUCCESS.
- Lite SHA técnico `0000dbfcb0006e26d198f979fd2ee393bba41f1e`: acumulativo [45572462518](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462518) completó SUCCESS. Job [139062212120](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462518/job/139062212120): 3020 PASS, 15 XFAIL, 34 TODO con 12 pruebas de polos IT-D ejecutadas. H1d [45572462464](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462464) job 139062212137 completó SUCCESS. Scientific UI [45572462594](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462594) job 139062212076 completó SUCCESS.

Índices actualizados: `continuity.json` (revisión 643 en Lite, 639 en Plus), `CURRENT_STATE.md` y `BATCH_80_01.md`. Bloqueos S25, SG28/DIST y EV-D-01 permanecen activos; certificación global OPEN.

Siguiente: extender en Lite las guardas de integral definida para rechazar resultados no finitos (DOMAIN_ERROR) en paridad con Plus, y resolver estabilidad numérica IT-HI-01/10 preservando ramas complejas.
