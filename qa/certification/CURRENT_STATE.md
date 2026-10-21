## 2026-10-21 UTC — EV-D-05 actualización r213: H1d Plus PASS, acumulativo pendiente

- Plus H1d [39556359572](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359572) terminó SUCCESS sobre el SHA técnico `8885a3b47dc6509c52a08312bbc87d5f1651c6da`; se revisaron los pasos, incluido `Run IN625 H1d reentry`, ejecutado y aprobado.
- Plus cumulative [39556359520](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359520) continúa IN_PROGRESS en su job backend `Backend regression`; frontend finalizó SUCCESS (typecheck, unit/parity y production build). No declarar EV-D-05 cerrado hasta concluir backend, revisar logs y verificar que los tests nuevos pasaron.
- El cierre documental bilateral r212 ya está publicado; esta entrada refresca la evidencia dinámica sin provocar un nuevo gate técnico.

---

## 2026-10-21 UTC — EV-D-05 diagnóstico y gates pendientes

- Lite: commit de pruebas `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`; cumulative [39555164790](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164790), H1d [39555164686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164686) y Scientific UI [39555164730](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164730) terminaron SUCCESS sobre el SHA esperado.
- Plus: commit inicial `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`; cumulative [39555174858](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174858) falló durante colección por `ModuleNotFoundError: No module named 'backend'` en el test nuevo. Esto es un fallo del harness/test import, no evidencia de fallo matemático. H1d [39555174838](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174838) SUCCESS.
- Corrección exclusiva del test en commit `8885a3b47dc6509c52a08312bbc87d5f1651c6da`: import `app.main`, aserción sobre `MathResponse.success/result_text` y comprobación de fila fuente congelada. Producto sin cambios.
- Validación de la corrección: Plus cumulative [39556359520](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359520) y H1d [39556359572](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359572), activadas por push con SHA exacto; ambas estaban IN_PROGRESS al redactar este registro.
- Estado: EV-D-05 sigue IN_PROGRESS. No declarar PASS hasta revisar conclusión, jobs/logs y fila fuente. Certificación global OPEN.

---

## 2026-10-21 UTC — r211: cierre EV-D-04 y arranque test-first EV-D-05

**EV-D-04 PASS_SCOPED bilateral** — `csc(pi/6)=2`. Cinco gates SUCCESS y SHA exactos:
- Lite cumulative [39554410679](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410679), H1d [39554410715](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410715), Scientific UI [39554410696](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410696), todos `head_sha=0467aa89c470abf6607d1b67e9c40191642d8df4`.
- Plus cumulative [39552906521](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906521) y H1d [39552906515](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906515), ambos `head_sha=f6756dc37bdf193a01de05a4bb9208b65cf47867`.
- No se modificó código de producto; el test Lite usa el parser oficial antes de evaluar.

**EV-D-05 test-first iniciado** — hipótesis a validar: `sec(pi/3)=2`. Añadidas pruebas en Lite `tests/trigonometryEvD05.audit.test.ts` (commit `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`) y Plus `backend/tests/test_trigonometry_ev_d05.py` (commit `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`). Las pruebas verifican también que la fila EV-D-05 y su resultado estén en la matriz congelada. No se cambió producto.

Corridas EV-D-05 actualmente en curso:
- Lite cumulative [39555164790](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164790), H1d [39555164686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164686), Scientific UI [39555164730](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164730), SHA esperado `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`.
- Plus cumulative [39555174858](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174858) y H1d [39555174838](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174838), SHA esperado `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`.

EV-D-05 permanece `IN_PROGRESS`; no declarar PASS hasta verificar fila fuente, resultados y SHA exactos de los cinco gates. Certificación global: `OPEN`.

---

## 2026-10-21 UTC — r210: EV-D-04 diagnóstico y test corregido; cierre pendiente

La corrida acumulativa inicial de Lite [39552903560](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903560) falló solo en el nuevo test: este llamaba a `evaluate("csc(pi/6)")` directamente, evitando el pipeline oficial del parser. La salida observada fue `csc(1/6*pi)`, no `2`. El parser ya contiene la reescritura de `csc` a `1/sin`; el test debe pasar por `parseExpression` antes de `evaluate`.

Se corrigió únicamente el test Lite en commit `0467aa89c470abf6607d1b67e9c40191642d8df4`; **no se modificó código de producto**. El test Plus ya había pasado en las corridas [39552906521](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906521) y [39552906515](https://github.com/c2melendez/precision-lab-plus/actions/runs/39552906515), ambas con `head_sha=f6756dc37bdf193a01de05a4bb9208b65cf47867`.

Nuevas corridas de Lite para el SHA corregido `0467aa89c470abf6607d1b67e9c40191642d8df4`:
- cumulative [39554410679](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410679) — `in_progress`.
- h1d [39554410715](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410715) — `in_progress`.
- scientific-ui [39554410696](https://github.com/c2melendez/precision-lab-lite/actions/runs/39554410696) — `in_progress`.

No declarar EV-D-04 PASS hasta que terminen las tres corridas y se compruebe `head_sha`. Global certification: `OPEN`.

---

> Decisiones de alcance, de producto y de proceso: ver `qa/certification/ALGEBRA229_DECISIONS.md`.

## 2026-10-21 UTC — Cierre documental r208: gates D20 de r207 verificados

Los seis gates D20 del cierre documental r207 finalizaron en `completed/success`. Cada `head_sha` coincide exactamente con el commit documental r207 del repositorio correspondiente:
- Lite `cumulative`: [39551266478](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551266478) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.
- Lite `h1d`: [39551268683](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551268683) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.
- Lite `scientific-ui`: [39551270883](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551270883) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.

**Escapado corregido:** la expresión oficial queda `\csc(\frac{\pi}{6}) → 2` (un solo nivel de escapado LaTeX dentro del código Markdown; sin llaves duplicadas alrededor de `\pi`).

**Siguiente acción sin cambios:** EV-D-04 (`TRIG-EV-D-04-TEST-FIRST`) permanece `READY`, **no iniciado**. No se ejecutaron pruebas de EV-D-04 ni se modificó producto. Global `OPEN`.

---

## 2026-10-21 UTC — r209: EV-D-04 test-first iniciado; gates en ejecución

Objetivo `TRIG-EV-D-04-TEST-FIRST`: `csc(pi/6)=2`. Se añadieron únicamente pruebas de aceptación, antes de modificar producto:
- Lite: `tests/trigonometryEvD04.audit.test.ts`, commit `9623bfa02b50f4fde154fc2fdd96f894151e65e3`.
- Plus: `backend/tests/test_trigonometry_ev_d04.py`, commit `9623bfa02b50f4fde154fc2fdd96f894151e65e3`.

Estado de las corridas al registrar este checkpoint:
- cumulative: [39552903560](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903560) — `in_progress`; esperado `head_sha=9623bfa02b50f4fde154fc2fdd96f894151e65e3`.
- h1d: [39552903434](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903434) — `in_progress`; esperado `head_sha=9623bfa02b50f4fde154fc2fdd96f894151e65e3`.
- scientific-ui: [39552903511](https://github.com/c2melendez/precision-lab-lite/actions/runs/39552903511) — `in_progress`; esperado `head_sha=9623bfa02b50f4fde154fc2fdd96f894151e65e3`.

No se afirma PASS/FAIL todavía: las corridas siguen activas y el resultado de test-first está pendiente. No se cambió código de producto. Próxima acción: esperar conclusión de todos los gates, inspeccionar los resultados específicos de EV-D-04, corregir solo si las pruebas lo exigen y publicar el cierre final con SHA exactos. Global `OPEN`.

---


## 2026-10-21 UTC — Trigonometría EV-D-03 PASS_SCOPED bilateral (continuity r206)

**EV-D-03** — `\tan(\frac{\pi}{4}) → 1` (fila oficial de `ejercicios_trigonometria.md.gz`).

Evidencia (test-first, sin cambio de producto):
- **Lite** `f07afe1` (`tests/trigonometryEvD03.audit.test.ts`): cumulative [39549185561](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549185561), h1d [39549185671](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549185671), scientific-ui [39549185567](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549185567); SUCCESS. Canales: ASCII `tan(pi/4)` y LaTeX oficial vía `parseExpression` + Algebrite.
- **Plus** `fce235b` (`backend/tests/test_trigonometry_ev_d03.py`, HTTP ASCII `tan(pi/4)`): cumulative [39549187134](https://github.com/c2melendez/precision-lab-plus/actions/runs/39549187134), h1d [39549187120](https://github.com/c2melendez/precision-lab-plus/actions/runs/39549187120); SUCCESS.

Alcance: evaluación exacta de tan(π/4)=1. Plus solo en ASCII, igual que EV-D-01 y EV-D-02. No cierra el módulo trig completo. Global OPEN.

Gates documentales de r205 (D20, sobre `60865c8`): todos SUCCESS con `head_sha` exacto. Cumulative [39548181168](https://github.com/c2melendez/precision-lab-lite/actions/runs/39548181168), h1d [39548183229](https://github.com/c2melendez/precision-lab-lite/actions/runs/39548183229), scientific-ui [39548185228](https://github.com/c2melendez/precision-lab-lite/actions/runs/39548185228).

Gates documentales de r206 (commit de este cierre): se disparan con `workflow_dispatch` sobre el SHA documental (D20); sus resultados se registran en r207.

Siguiente: EV-D-04 `\csc(\frac{\pi}{6}) → 2`, `READY`; se ejecuta al recibir la siguiente instrucción. Global OPEN.

---

## 2026-10-21 UTC — Trigonometría EV-D-02 PASS_SCOPED bilateral (continuity r205)

**EV-D-02** — `\\cos(\\pi/3) → 1/2` (fila oficial de `ejercicios_trigonometria.md.gz`).

Evidencia (test-first, sin cambio de producto):
- **Lite** `0601287` (`tests/trigonometryEvD02.audit.test.ts`): cumulative [39547288506](https://github.com/c2melendez/precision-lab-lite/actions/runs/39547288506), h1d [39547288469](https://github.com/c2melendez/precision-lab-lite/actions/runs/39547288469), scientific-ui [39547288515](https://github.com/c2melendez/precision-lab-lite/actions/runs/39547288515); SUCCESS.
- **Plus** `c15349a` (`backend/tests/test_trigonometry_ev_d02.py`, HTTP ASCII `cos(pi/3)`): cumulative [39547294497](https://github.com/c2melendez/precision-lab-plus/actions/runs/39547294497), h1d [39547294494](https://github.com/c2melendez/precision-lab-plus/actions/runs/39547294494); SUCCESS.

Alcance: evaluación exacta de cos(π/3)=1/2. Plus solo en ASCII, igual que EV-D-01. No cierra el módulo trig completo. Global OPEN.

Excepción de proceso D20 (r204): los commits documentales de EV-D-01 (Lite `052cfa3`, `ed44453`, `cd73fb1`; Plus `9348420`, `a8e44ee`, `35cd5b1`) no tienen runs de gates. `workflow_dispatch` solo corre sobre el head de la rama, así que ya no pueden gatearse a posteriori. Queda registrado como excepción; el commit documental de r205 sí se gatea.

Gates documentales de r205 (commit de este cierre): se disparan con `workflow_dispatch` sobre el SHA documental (D20); sus resultados se registran en r206.

Siguiente: EV-D-03 `\\tan(\\frac{\\pi}{4}) → 1`, `READY`; se ejecuta al recibir la siguiente instrucción. Global OPEN.

## 2026-10-21 UTC — Trigonometría EV-D-01 PASS_SCOPED bilateral (continuity r204)

**EV-D-01** — `\\sin(\\pi/6) → 1/2` (fila oficial de `ejercicios_trigonometria.md.gz`).

Evidencia (test-first, sin cambio de producto):
- **Lite** SHA `13bdc7c`: cumulative [39545169322](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169322), h1d [39545169419](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169419), scientific-ui [39545169496](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169496) SUCCESS. Canales: ASCII `sin(pi/6)` y LaTeX oficial vía `parseExpression` + Algebrite.
- **Plus** SHA técnico `4e625d1` (scope HTTP ASCII tras fallar LaTeX crudo): cumulative [39545579931](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579931), h1d [39545579919](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579919) SUCCESS. Canal HTTP: solo `sin(pi/6)`; LaTeX raw no es ruta de producto en `/evaluate`.

Alcance: evaluación exacta de sen(π/6)=1/2. No cierra el módulo trig completo ni MathLive UI integral Plus. Global OPEN. Siguiente: EV-D-02.

---

> Nota: AS-B-28 PASS_SCOPED permanece en r203; AS-B-29 ON_HOLD. `continuity.json` r204 es la fuente de next_action.
