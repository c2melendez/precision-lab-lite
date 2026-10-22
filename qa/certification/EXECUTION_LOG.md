## 2026-10-22 UTC — r240: evidencia de coordinación y próximo gate

- Lite H1d 39754424829, acumulativo 39754424771 y Scientific UI 39754424596 SUCCESS sobre SHA técnico exacto c28091c0173f951a2571ffcbb6084f566ced0034. HEAD b3dcccf es solo el commit documental r239.
- Plus S25 [39802197250](https://github.com/c2melendez/precision-lab-plus/actions/runs/39802197250) FAILURE: frontend npm audit reportó 10 vulnerabilidades (4 moderadas, 6 altas), artifact 12435827934; Plus Stryker fue cancelado al llegar a 60 min tras instrumentar 2.627 mutantes en 8 archivos y completar dry run de 698 tests en 78 s sin generar informe.
- Remediación publicada en Plus SHA bae07b39dfc71eb01c0921524b6bbf162369166d: timeout del job Plus Stryker 60→120 min, sin cambiar scope/pins/umbrales. Runs nuevos en cola al registrar esta nota: gate 39814332343, acumulativo 39814332246, H1d 39814332232.
- Estado Lite no cambia; el cierre formal bilateral MV-D sigue pendiente hasta que el gate S25 cumpla los criterios documentados. SECURITY-S25 BLOCKED; global OPEN.

---

## 2026-10-22 UTC — r239: verificación de gates MV-D y reconciliación del índice (técnico vs. documental)

**Objetivo:** cerrar la brecha entre los HEADs técnicos publicados y el índice de continuidad, sin relanzar CI con cambios solo documentales.

- **Deriva detectada y corregida:** `continuity.json` (r238) señalaba como baseline los SHAs de MV-C (Lite `3aec2c25`, Plus `9083811b`) mientras los pushes técnicos MV-D ya estaban publicados y certificados: Lite `c28091c0173f951a2571ffcbb6084f566ced0034` y Plus `91d7f7b499e1effaeef7c4a3bd9e04c0b3b6d6f5`. Se actualizan `technical_baseline_sha` y `next_action.technical_sha_by_repo` a esos valores, revisión 239 en ambos repositorios.
- **Evidencia consultada por `head_sha` exacto (API Actions):**
  - Lite `c28091c`: cumulative [39754424771] SUCCESS; h1d [39754424829] SUCCESS; scientific-ui [39754424596] SUCCESS.
  - Plus `91d7f7b`: cumulative [39754425445] SUCCESS; backend-isolation [39754425427] SUCCESS; h1d [39754425636] SUCCESS; native-syntax [39754425572] SUCCESS; SG28 UI [39754425501] SUCCESS.
  - Plus dependency/security [39754425516] **cancelled**: reproduce el timeout estructural documentado de plus-frontend-mutmut (35 min, mismo input, mismo límite). No se relanza (precedente mv_c_closure_r238). No es evidencia de MV-D; `SECURITY-S25` sigue blocker independiente; certificación global `OPEN`.
- **Higiene local verificada:** working trees sincronizados con origin tras fast-forward; eliminado un duplicado huérfano de suite EV-M en Lite (`tests/logExpRadicalsEvM01to13.audit.test.ts`, superseded por `tests/logExpEvM01to13.audit.test.ts` publicada en r234); reejecución local de la suite canónica EV-M: 7 passed. Ningún cambio técnico nuevo en esta revisión.
- **Siguiente paso ejecutable:** continuar MV-D-01..17 según `next_action` (ya implementado y verde en los SHA anteriores); evaluar cierre formal de MV-D con su propia entrada de ledger si el contrato lo exige, o transitar a la siguiente sección de `matriz_matrices_vectores.md.gz`.

---

## 2026-10-22 UTC — r238: MV-C-01..19 cerrado bilateralmente

**MV-C-01..19 (inversa, adjunta, cofactores y ecuaciones matriciales) — PASS_SCOPED_BILATERAL.**

- Commits técnicos: Lite `3aec2c258c2fbe5e2c2c11f50d3db74aa8d610ec`; Plus `9083811b04609489fa26973cbec90e3aa2238769`. Árboles limpios y `origin == HEAD` en ambos repos.
- Lite: cumulative [39732103530] — **SUCCESS**, 354 archivos, **2152 passed**, 8 expected fail, 34 todo; `tests/matricesMvC01to19.audit.test.ts` **24/24** (19 filas + integridad del JSONL + anclaje + Hilbert/compleja + singulares + orden de ecuaciones); `tests/matrixModeParity.test.ts` **2/2**; guard `skip=false` (`checkout_sha` exacto, «No reusable completed evidence found»). h1d [39732103564] — SUCCESS, 22 passed; scientific-ui [39732103583] — SUCCESS, 456 passed.
- Plus: cumulative [39732103487] — **SUCCESS**, backend **1915 passed**, 6 xfailed, cobertura **88.08%**; `tests/test_matrices_mv_c01_l19.py` **25/25 PASSED** (19 filas + 6 meta); frontend 149 archivos, **1010 passed**, 28 todo; `src/__tests__/MatrixMode.test.tsx` **7/7**; guards `skip=false` (`checkout_sha` exacto). h1d [39732103479] — SUCCESS, 38 passed; native-syntax [39732103484] — SUCCESS (26 desktop + 52 tablet/mobile); SG28 backend [39732103482] — SUCCESS, 69 passed; SG28 UI [39732103492] — SUCCESS, 21 passed.
- Los 8 gates de producto se consultaron por `head_sha` exacto, con `attempt=1` y conclusión `success`; los guards disponibles registran `skip=false` y `checkout_sha` exacto. Las pruebas se ejecutaron realmente: no hubo REUSE ni skip en las suites citadas.
- **Evidencia de filas.** Las 19 filas MV-C coinciden con el oráculo congelado. Las simbólicas se aceptan por equivalencia algebraica exacta; 08/10/11 se contrastaron contra matrices SymPy explícitas. Resultados clave: 01 `[[-2,1],[3/2,-1/2]]`; 05 `[[12,-20],[-15,30]]`; 07 Hilbert 4×4 con `(3,3)=6480`; 08 compleja `[[1/2,-i/2],[-i/2,1/2]]`; 09 decimal exacta `[[2,-4],[-4,10]]`; 10 `[[d/(ad-bc),-b/(ad-bc)],[-c/(ad-bc),a/(ad-bc)]]`; 11 `[[cos θ,sin θ],[-sin θ,cos θ]]`; 12/13 error claro de matriz no invertible; 14 `[[4,-2],[-3,1]]`; 15 `[[-24,18,5],[20,-15,-4],[-5,4,1]]`; 16 `[[-24,20,-5],[18,-15,4],[5,-4,1]]`; 17 `[[3/2,-1/2],[-2,1]]`; 18 `X·A=B` → `[[-1,2],[-2,3]]`; 19 `A·X=B` → `[[-3,-4],[4,5]]`.
- **Verificación local.** Lite `typecheck`/`build` limpios; Plus `typecheck`/`build` limpios; regresión de matrices Lite 143/143 y Plus 122 passed; suites MV-C y parity/MatrixMode verdes. Los hallazgos de entorno (timeouts de factorización en Lite; SG28/S25/SY-X-16 en Plus; un e2e con timeout que pasó aislado) son preexistentes y no regresiones de MV-C. `node_modules`/`dist` no se commitearon.
- **Gate security/dependency (independiente).** El push técnico disparó [39732103637] por tocar `frontend/src/**`, `backend/app/core/**`, `backend/app/schemas/requests.py` y `responses.py`. `attempt=1`, conclusión **cancelled**: `audit-request`, `security/backend-security` y `mutation/plus-backend-mutmut` success; `security/frontend-audit` y `mutation/lite-frontend-stryker` skipped; `mutation/plus-frontend-stryker` agotó el timeout duro de 35 min tras 2627 mutantes / 696 tests iniciales, sin informe. No se relanzó porque el mismo input bajo el mismo límite estructural reproduciría el timeout. No se usa como evidencia de MV-C; `SECURITY-S25` sigue como blocker independiente y la certificación global permanece `OPEN`.
- **Cierre documental.** El commit r238 se verifica con **0 workflow runs** por `head_sha`, `origin == HEAD` y árbol limpio; no se relanza CI con cambios documentales.

**Siguiente objetivo — MV-D-01..17:** sistemas de ecuaciones (solución única, paramétrica e incompatible, incluido el parámetro `a`), `rref`, descomposición LU y Gram-Schmidt sin normalizar, anclados a `matriz_matrices_vectores.md.gz` antes de asumir cualquier expresión o resultado.

## 2026-10-22 UTC — r237: MV-B-01..22 cerrado bilateralmente

**MV-B-01..22 (determinantes) — PASS_SCOPED_BILATERAL.**

- Lite `09ac205f7716994a2a04a222c5d276f35cef78fa`: cumulative [39725461570] — **SUCCESS**, 353 archivos, **2127 passed**, 8 expected fail, 34 todo; `tests/matricesMvB01to22.audit.test.ts` **27/27** (22 filas + integridad del JSONL + anclaje + canales exactos); guard `skip=false` (`checkout_sha` exacto, «No reusable completed evidence found»). h1d [39725461610] — SUCCESS, 22 passed; scientific-ui [39725461481] — SUCCESS, 456 passed.
- Plus `c31e54091302acd102945858cfbbce7d70e034ed`: cumulative [39725461036] — **SUCCESS**, backend **1891 passed**, 6 xfailed, cobertura **88.28%**; `tests/test_matrices_mv_b01_l22.py` **26/26 PASSED** (22 filas + 4 meta); frontend 149 archivos, 1008 passed, 28 todo; guards `skip=false`. h1d [39725461033] — SUCCESS, 38 passed; native-syntax [39725461074] — SUCCESS (26 desktop + 52 tablet/mobile).
- Los 6 gates de alcance por `head_sha` exacto, `attempt=1` y `success`; los guards de los seis runs registran `skip=false` y `checkout_sha` exacto.
- **Resultados numéricos (01–15).** 01=`5`, 02=`-2`, 03=`6`, 04=`24`, 05=`0`, 06=`4`, 07=`19`, 08=`30`, 09=`1/6048000`, 10=`1/266716800000`, 11=`7`, 12=`0`, 13=`-8`, 14=`2`, 15=`-0.02`; ambos motores coinciden con el oráculo congelado.
- **Resultados simbólicos (16–21).** 16 Lite=`a*d-b*c`, Plus=`a*d - b*c`; 17 Lite=`-x^2+1` (equivalente a `1-x^2`), Plus=`-(x-1)*(x+1)` (factorizado, equivalente); 18 Lite forma expandida equivalente, Plus=`-(a-b)*(a-c)*(b-c)` (factorizado exacto); 19 Lite forma expandida equivalente, Plus=`(a-1)^2*(a+2)`; 20=`1`; 21=`0`. 22 devuelve `DIMENSION_MISMATCH` en ambos.
- **Producto Lite `09ac205f`.** Nuevo `src/engine/symbolicDeterminant.ts`: expansión por cofactores hasta 4×4 y `simplify` de Algebrite; `src/workers/compute.worker.ts` enruta determinante Fraction → constantes → simbólico. El camino numérico exacto (`Fraction`) no cambia; una matriz mayor que 4×4 con variables sigue fuera de alcance y se rechaza.
- **Producto Plus `c31e5409`.** `parse_matrix(..., allow_symbolic=True)` y `_parse_matrix_cell(..., allow_symbolic=True)` aceptan variables libres y trigonométricas elementales (`sqrt/abs/sin/cos/tan`); la rama simbólica de `determinant()` aplica `trigsimp`+`simplify` y `factor` si el resultado es polinómico. Solo `/matrix/determinant` activa `allow_symbolic=True`; el resto de `/matrix/*` conserva el contrato numérico estricto. `result_approx=None` cuando hay variables libres.
- **Traducciones de harness.** Lite numérico: `\frac{a}{b}` → `a/b`. Plus simbólico: `a^{2}` → `a^2` y `\cos\theta` → `cos(theta)`. MV-B-13/14 se componen con operaciones del producto (`det(2A)`, `det(AB)`). 18/19 se aceptan por equivalencia algebraica exacta; 18 y 19 se verifican además como producto factorizado. `toLatex` de Lite elimina `*`, por eso los tests comparan la expresión exacta, no el texto LaTeX.
- **Regresión permanente.** Lite `tests/matricesMvB01to22.audit.test.ts` (27/27) ancla cada fila al `.gz` y exige el resultado por el worker real; Plus `backend/tests/test_matrices_mv_b01_l22.py` (26/26) ancla las filas y exige los canales exactos del API. Regresión de matrices: Lite 9 archivos/119 tests, Plus 10 archivos/127 tests.
- **Fallos pre-existentes (no atribuibles).** Lite local: 5 timeouts de factorización (`AS-FAC-08/09`, `AS-B-06/18/20`), de entorno; Plus local: SG28 interruptible/cancelación, S25 CORS y SY-X-16 (7 failed + 2 errors de entorno Windows). El CI acumulativo quedó verde en ambos repos.
- **Gate security/dependency (independiente).** No se disparó: el push solo tocó `backend/app/services/matrix_service.py`, `backend/app/routers/matrices.py` y `backend/tests/test_matrices_mv_b01_l22.py`, fuera de su filtro. **SECURITY-S25** sigue como blocker independiente; no se usa como evidencia de MV-B. Global `OPEN`.

- **Cierre documental.** Los commits r237 (`34efd08f` Lite, `3b7f1864` Plus) y su corrección (`55c59d03`/`e3c4a907`) tienen **0 workflow runs** consultados por `head_sha`; los filtros excluyen `**/*.md` y `qa/certification/continuity.json`. No se relanzó CI.

**Siguiente objetivo — MV-C (19 filas).** Extender `matrices_ejecutables.jsonl`/ejecutor y los tests de auditoría; MV-A y MV-B quedan cerradas y no se reabren salvo regresión. Blockers independientes sin cambios; certificación global `OPEN`.

## 2026-10-22 UTC — r236: MV-A-01..25 cerrado bilateralmente

**MV-A-01..25 (operaciones básicas con matrices) — PASS_SCOPED_BILATERAL.**

- Lite `c191bcc2cea091ac18342418ae8ed0369f6760c2`: cumulative [39714994068] — **SUCCESS**, 352 archivos, **2100 passed**, 8 expected fail, 34 todo; `tests/matricesMvA01to25.audit.test.ts` **29/29** (25 filas + integridad del JSONL + anclaje + canales exactos); `tests/exhaustive-module06-matrices.test.ts` 10/10; guard `skip=false` (`checkout_sha` exacto, «No reusable completed evidence found»). h1d [39714994065] — SUCCESS, 22 passed. scientific-ui [39714994064] — SUCCESS, 456 passed.
- Plus `dfdf7d1a87043901b10ff1e6926fafe835e65bca`: cumulative [39715004689] — **SUCCESS**, backend **1865 passed**, 6 xfailed, cobertura **88.16%**; `tests/test_matrices_mv_a01_l25.py` **27/27 PASSED** (25 filas + 2 meta); frontend 149 archivos, 1008 passed, 28 todo. h1d [39715004680] — SUCCESS, 38 passed.
- Los 5 gates de alcance por `head_sha` exacto, `attempt=1` y `success`. native-syntax y SG28 no se dispararon (sin rutas de producto modificadas en Plus); el gate security/dependency se trata abajo.
- **JSONL.** `qa/certification/matrices_ejecutables.jsonl` se deriva de `legacy_sources/matriz_matrices_vectores.md.gz` con `qa/certification/derive_matrices_ejecutables.py`; 153 filas, conteos A25/B22/C19/D17/E12/F17/G22/H12/J7, sha256 `6C93E908…`, bytes idénticos en ambos repos. El generador falla si el total o los conteos por sección no coinciden; no calcula ni altera oráculos.
- **Ejecución Lite.** Cada fila se envía al worker real (`matrixOp`/`matrixExpression`), no a una copia del motor. Traducción declarada: celda LaTeX `\frac{a}{b}` → `a/b` (la grilla del módulo Matrices es ASCII; el camino del calculador normaliza la misma forma). Las 25 filas coinciden con la matriz/valor esperado; 20–23 devuelven `DIMENSION_MISMATCH`.
- **Ejecución Plus.** Cada fila se envía a `/api/v1/matrix/*`. El escalar×matriz (MV-A-03/04) usa la ruta diagonal `(k·I)×A` que ya usa `BasicMode.tsx`; MV-A-24 se compone con `multiply`/`subtract` del producto (`(A+B)^2-(A^2+2AB+B^2)=BA-AB`). Las 25 filas coinciden; 20–23 devuelven `DIMENSION_MISMATCH`.
- **Producto Lite `c191bcc2`.** `engine/matrixOps.ts`: `powerMatrix` acepta enteros negativos invirtiendo primero (`A^{-2}=(A^{-1})^2`), conserva el rechazo de matrices singulares (`DOMAIN_ERROR`) y de exponentes no enteros. `engine/matrixExpression.ts`: un token numérico produce un escalar, habilitando `2*A*B` y por tanto MV-A-24. `modes/Matrices/MatrixMode.tsx`: el exponente admite negativos (mínimo −10). Sin cambio en Plus.
- **Regresión permanente.** Lite `tests/matricesMvA01to25.audit.test.ts` ancla cada fila al `.gz` (entrada y esperado) y exige el resultado exacto por el worker; actualiza `tests/exhaustive-module06-matrices.test.ts` para el nuevo contrato de potencia negativa. Plus `backend/tests/test_matrices_mv_a01_l25.py` ancla las filas y exige los canales exactos del API.
- **Fallos pre-existentes (no atribuibles).** `AS-FAC-09`, `AS-B-18` y `AS-B-20` fallan igual en el baseline `fd779625` con `git stash`; bajo carga paralela se suman `AS-FAC-08` y `AS-B-06`. Son de factorización y de entorno, ajenos a matrices.
- **Gate security/dependency (independiente).** El push disparó [39715004827] por el filtro `qa/certification/*.jsonl`; `mutation/plus-frontend-stryker` excedió el límite duro de 35 min y el run quedó **cancelled**. La revalidación por `workflow_dispatch` (mismo SHA, `attempt=1`, [39718717187]) ejecutó además `security/frontend-audit`, que falló por **10 advisories npm** (4 moderate, 6 high); `frontend/package-lock.json` es idéntico entre `d1e38753` y `dfdf7d1a`, por lo que el hallazgo es externo y corresponde al blocker **SECURITY-S25**. No se usa como evidencia de MV-A; el dispatch se canceló tras el fallo. Global `OPEN`.

**Siguiente objetivo — MV-B (determinantes, 22 filas).** Blockers independientes sin cambios.

## 2026-10-21 UTC — r235: EV-T-01..12 cerrado bilateralmente; Matrices/Vectores siguiente

**EV-T-01..12 (trigonométricas, hiperbólicas e inversas) — PASS_SCOPED_BILATERAL.**

- Lite `e8b1def62e2e…`: cumulative [39701580546] — **SUCCESS**, 351 archivos, **2071 passed**, 8 expected fail, 34 todo; `tests/logExpEvT01to12.audit.test.ts` **8/8**; guard `skip=false` («No reusable completed evidence found», `checkout_sha=e8b1def6…`). h1d [39701580477] — SUCCESS, 22 passed. scientific-ui [39701580446] — SUCCESS, 456 passed.
- Plus `d1e387536713…`: cumulative [39701587699] — **SUCCESS**, **1838 passed**, 6 xfailed, cobertura **88.05%**; `tests/test_log_exp_matrix_ev_t01_l12.py` **7/7 PASSED**; guard `skip=false` (`checkout_sha=d1e38753…`). Frontend 149 archivos, 1008 passed. h1d [39701587450] — SUCCESS, 38 passed; native-syntax [39701587574] — SUCCESS (26 + 52); SG28 [39701587542] — SUCCESS, 69 passed.
- Los 7 gates consultados por `head_sha` exacto (`e8b1def6…`/`d1e38753…`), `attempt=1`, conclusión `success`. El gate security/dependency no se disparó porque el cambio no toca ninguna ruta de su filtro (`evaluate_service.py` está fuera); advisories sin cambio.
- Resultados por fila (Lite / Plus): 01=`0`/`0`; 02=`exp(1/2)`(≡√e)/`exp(1/2)`; 03=`2`/`2`; 04=`0`/`0`; 05=`0.433781…` (canal 6 decimales)/`ln(cosh(1))`+`result_approx=0.433780830`; 06=`1/4*pi`/`pi/4`; 07=`sin(1000…0)`+`-0.852201…`/`sin(1000…0)`+`result_approx=-0.852200850`; 08=`i`/`I`; 09=`1`/`1`; 10=`3^(1/2)`/`sqrt(3)`; 11=`DOMAIN_ERROR`/`DOMAIN_ERROR`; 12=`i`/`I`.
- Producto Lite `e8b1def6`: nuevo `engine/inverseHyperbolicExact.ts` restituye el valor exacto de dos composiciones que Algebrite deja sin resolver y que el reintento `float()` degradaba a decimales espurios: `asinh((e-e^{-1})/2)=asinh(sinh 1)=1` (EV-T-09) y `exp(atanh(1/2))=((1+1/2)/(1-1/2))^{1/2}=3^{1/2}` (EV-T-10). Se aplica **antes** del `float()` y solo sobre formas literales completas.
- Producto Plus `d1e38753`: `services/evaluate_service.py` añade una guarda simbólica de singularidad logarítmica (EV-T-11): si un argumento de `log` no está demostrado distinto de cero, simplifica y emite `DOMAIN_ERROR` cuando el resultado es `zoo/oo/-oo/nan`. `ln(1-1)`, `ln(0)`, `ln(0+0)`, `ln(cos(pi/2))` y `log(0,10)` ahora dan error claro; `ln(-1)=I*pi`, `ln(e)=1`, `log(100)=2`, `sqrt(cos(pi))=I` intactos. Cierra la fuga abierta en r232/r234.
- Convenciones declaradas en `MANUAL_CAPABILITY_GAPS.md`: canal numérico de EV-T-05 (misma regla que EV-H); equivalencia exacta admitida (EV-T-02 `exp(1/2)≡√e`, EV-T-10 `3^(1/2)≡√3`); `i`(fila)≡`I`(SymPy) en EV-T-08/12; rama compleja de EV-T-12; traducción plana `arsinh/artanh→asinh/atanh` en Plus (el frontend mapea `arsinh→\operatorname{asinh}`; Plus mantiene su rechazo documentado de `arcsinh/arccosh/arctanh`, capacidad sin cambio).
- Sin regresiones atribuibles: Lite local 2069 passed + 34 todo con 3 timeouts de factorización por carga paralela (verdes en aislamiento); Plus local 1838 passed, 6 xfailed, con 2 fallos pre-existentes confirmados en baseline por `git stash` (SG28 interruptible, SY-X-16) y 3 de S25 que pasan aislados. CI acumulativo verde en ambos repos.

**Siguiente objetivo — Matrices/Vectores (`legacy_sources/matriz_matrices_vectores.md.gz`), orden canónico posterior a Log/Exp/Radicales.** Precondición: verificar la fila congelada antes de asumir expresión/resultado. Blockers independientes sin cambios; certificación global `OPEN`.

## 2026-10-21 UTC — r234: EV-M-01..13 cerrado bilateralmente; EV-T diagnosticado

**EV-M-01..13 (mixtas: logaritmos, exponenciales, radicales y polinomios) — PASS_SCOPED_BILATERAL.**

- Lite `737a82d4eacf…`: cumulative [39697894520] — **SUCCESS**, 350 archivos, **2063 passed**, 8 expected fail, 34 todo; `tests/logExpEvM01to13.audit.test.ts` **7/7**; guard `skip=false` («No reusable completed evidence found»). h1d [39697894475] — SUCCESS, 22 passed. scientific-ui [39697894504] — SUCCESS, 456 passed.
- Plus `16df9f6e5e1e…`: cumulative [39697901542] — **SUCCESS**, **1831 passed**, 6 xfailed, cobertura **88.05%**; `tests/test_log_exp_matrix_ev_m01_l13.py` **6/6 PASSED**; guard `skip=false`. Frontend 149 archivos, 1008 passed. h1d [39697901415] — SUCCESS, 38 passed; native-syntax [39697901339] — SUCCESS (26 + 52); SG28 [39697901366] — SUCCESS, 69 passed; security/dependency [39697901513] — SUCCESS, 24 + 121 passed, sin vulnerabilidades conocidas.
- Todos los gates consultados por `head_sha` exacto (`737a82d4…`/`16df9f6e…`), `attempt=1`, conclusión `success`.
- Resultados por fila en ambos motores: 01=`2`, 02=`9`, 03=`3/2`, 04=`1`, 05=`3^(2/3)`, 06=`4*exp(-2)`, 07=`exp(-1)`, 08=`4`, 09=`2^(1/2*2^(1/2))`, 10=`log(1/2+1/2*5^(1/2))`, 11=`3/2+1/2*5^(1/2)`, 12=`3`, 13=`0`.
- Producto Lite `737a82d4`: `engine/expLogSimplify.ts` aplica la identidad exacta `exp(k·log r) = r^k` para `k` entero (`|k| ≤ 400`) y `r` racional positivo, con producto BigInt acotado por `MAX_SAFE_PRODUCT`; `engine/logSimplify.ts` reduce `log(a−√b)+log(a+√b)` a `0` solo para pares conjugados con `a>0` y `a²−b = 1`; `engine/parsing/index.ts` lee una definición local de una variable seguida de su llamada aceptando `\left`/`\right` y paréntesis equilibrados en el argumento. La sustitución sigue siendo efímera (sin registro global).
- Producto Plus `16df9f6e`: `services/evaluate_service.py` lee la definición-llamada con delimitadores equilibrados y **reemite los logaritmos naturales como `ln(...)`** tras la ida y vuelta por SymPy, de modo que `f(x)=\ln(x^2+1);\ f(\sqrt{e-1}) = 1`; `log` conserva la base 10 (`f(x)=log(x); f(100) = 2`). `services/parsing.py` rechaza solo literales numéricos de notación científica (`(?<=\d)[eE][+-]?\d+`), así que la constante `e` de `e−1` ya no se bloquea.
- La fila congelada es LaTeX; el test Plus evalúa la **traducción plana documentada** (`f(x)=ln(x^2+1); f(sqrt(e-1))`), igual que EV-E/EV-R, y ancla la fila LaTeX original del `.gz`. El API de Plus no consume LaTeX crudo con `\left`/`\right`; la conversión es responsabilidad del frontend.
- Convenciones declaradas en `MANUAL_CAPABILITY_GAPS.md`: alcance exacto y acotado de `exp(k·log r)`; suma de conjugados solo con `a²−b = 1`; definición-llamada efímera; semántica base 10/natural conservada en Plus; notación científica solo numérica.
- Sin regresiones atribuibles: CI acumulativo verde en ambos repos; los fallos locales previos son de entorno (timeouts de factorización por 350 workers en Lite; encoding cp1252 en Windows para Plus).

**Siguiente objetivo — EV-T-01..12 (trigonométricas, hiperbólicas e inversas).** Precondición obligatoria antes de certificar: corregir la fuga de dominio semántica de Plus (`ln(1-1)` y `ln(cos(pi/2))` devuelven `success=true` con `result_text="zoo"`); EV-T-11 (`\ln(\cos\frac{\pi}{2})`, indefinido) debe exigir `DOMAIN_ERROR`. Filas a verificar: EV-T-01..12, incluyendo reducción de argumento (`\sin(10^{22})`, EV-T-07), `i` (`e^{i\pi/2}`, EV-T-08), `arsinh`/`artanh` (EV-T-09/10) y la doble rama real/compleja de EV-T-12. Blockers independientes sin cambios; certificación global `OPEN`.

## 2026-10-21 UTC - r233: reconciliación documentación ↔ GitHub Actions

**Alcance.** Contraste de las 477 citas de runs (URL o `[id]`) y de los 197 SHA completos documentados contra la API de Actions, en ambos repos y en toda la historia de certificación. Se consultó además el conjunto completo de runs por SHA (no solo los citados) y se descargaron los logs acumulativos de r229–r232.

**Resultado.** 0 runs inexistentes; 0 casos de SUCCESS documentado sobre un run fallido; 0 fallos ocultos en los cierres r229–r232 (todos los gates `SUCCESS`, `attempt=1`); conjunto de workflows por SHA idéntico a lo declarado; conteos de r229, r230, r231 y r232 idénticos a los logs; 297 citas resuelven en el repo par (documentación bilateral esperada). Los seis commits documentales previos (`6287463d`, `b7bd70a3`, `29d08a47`, `4ec07aed`, `8ec414bb`, `6eab838d`) tienen 0 corridas; `574ca8bf` y `a5009a79` dispararon 2 cada uno por filtro de rutas, ya documentado en r232. El propio commit r233 (`895a09ef` Lite, `5e412582` Plus) disparó 3 y 2 corridas porque la anotación de SHA tocó `SY_P_23_CONVENTION.md`, re-incluido en el filtro; las cinco terminaron SUCCESS en `attempt=1` (Lite 2056 passed; Plus 1825 passed, 88.06%).

**Brecha corregida.** 12 citas (6 SHA) identificaban el run pero no el commit. Se añadió el SHA en el punto de cita: `8db3456b` y `0fcdc9bb` (AS-DIV-07, `CONTINUITY.md`), `482d81d5` (run fallido inicial, `CURRENT_STATE.md`), `0690d475` y `19daac09` (`SY_P_23_CONVENTION.md`), `9f17dc51` (primer run AS-PAR-09, dashboard Plus). Con ello toda cita permite reconstruir run → SHA.

**Informe:** `qa/certification/RUN_RECONCILIATION_2026-10-21.md`. Veredicto: historia documental consistente con Actions; sin runs inventados. Siguiente sin cambios: `EXP-EV-M-EVALUATION`, con la precondición EV-T del defecto Plus `zoo`.

## 2026-10-21 UTC - r232: auditoría lógica de la certificación; correcciones documentales

**Auditoría lógica (informe: `qa/certification/LOGIC_AUDIT_2026-10-21.md`).** Revisadas las decisiones tomadas para ejecutar la matriz y la cadena de evidencia de EV-L/I/E/R, más las filas singulares del bloque EV. Veredicto: las decisiones matemáticas son correctas y ninguna convirtió una singularidad en un valor finito; `0^0=1` es la convención que la fila admite y queda acotada a evaluación directa (no a límites 4.M); las ramas complejas y la raíz real impar están declaradas y son coherentes entre EV-L-13, EV-R-13, EV-E-13 y EV-T-12. La cadena de evidencia (SHA exacto, guard `skip=false`, suite ejecutada, conteos) se mantiene en los bloques certificados.

**Brechas corregidas.** (a) `CONTINUITY_NEXT_ACTION.json` estaba en revisión 160 (y el aviso de Lite citaba la 191): reemplazado por puntero a `continuity.json` rev 232. (b) `CONTINUITY.md` terminaba en AS-PAR-02 con "Reentrada exacta" obsoleta: banner de vigencia. (c) `GLOBAL_CERTIFICATION_DASHBOARD.md` no tenía corte posterior al 2026-10-19: corte r232. (d) `EXECUTION_PROTOCOL.md` de Plus carecía de tres guardarraíles de Lite (no certificación global por pruebas estructurales; no bloquear por deuda independiente salvo regresión; recertificar subbloque ante fuga de sintaxis): sincronizado. (e) Oráculos EV-E/EV-R anclados a la fila congelada y forma exacta obligatoria en filas `\approx` (Lite `c4a49a51`, Plus `89bf0e26`).

**Defecto abierto no certificado - Plus `zoo`.** `ln(1-1)` y `ln(cos(pi/2))` devuelven `success=true` con `result_text="zoo"`; `ln(0)`, `ln(0+0)`, `ln(sin(0))` y `log(0,10)` sí dan `DOMAIN_ERROR`. Lite da `DOMAIN_ERROR` en los dos casos. EV-T-11 exige error claro, de modo que Plus falla hoy esa fila; queda registrado como precondición obligatoria de EV-T (la prueba debe exigir `DOMAIN_ERROR`, no solo `success`). No afecta a bloques ya cerrados.

**Gates r232 (SHA exacto).** Lite `c4a49a51`: cumulative [39686329058] SUCCESS, 349 archivos, **2056 passed**, 8 expected fail, 34 todo, guard `skip=false`; h1d [39686328895] SUCCESS; scientific-ui [39686328765] SUCCESS. Plus `89bf0e26`: cumulative [39686337173] SUCCESS, **1825 passed**, 6 xfailed, cobertura 88.04%, guard `skip=false`; h1d [39686337053] SUCCESS. Docs r232 `574ca8bf`: el filtro de rutas re-ejecuto cumulative+h1d (39687537314/39687537328), ambos SUCCESS; no fue un relanzamiento deliberado. El filtro no excluye `CONTINUITY_NEXT_ACTION.json`.

**Sin cambio de producto.** Siguiente objetivo sin cambio: **EV-M-01..13**; precondición añadida para EV-T-11. Global **OPEN**; bloqueos sin cambio.

## 2026-10-21 UTC — r231: EV-R-01..14 cerrado bilateralmente; EV-M diagnosticado

**EV-R-01..14 (radicales) — PASS_SCOPED_BILATERAL.**

- Lite `c7875936249e…`: cumulative [39683361872] — **SUCCESS**, 349 archivos, **2055 passed**, 8 expected fail, 34 todo; `tests/radicalsEvR01to14.audit.test.ts` **6/6**; guard `skip=false` («No reusable completed evidence found»). h1d [39683361229] y scientific-ui [39683361538] — SUCCESS.
- Plus `870766b99a02…`: cumulative [39683393101] — **SUCCESS**, **1824 passed**, 6 xfailed, cobertura 88.00%; `tests/test_radical_matrix_ev_r01_l14.py` **6/6 PASSED**; guard `skip=false`. h1d [39683393214], native-syntax [39683393055] y SG28 [39683393053]/[39683393210] — SUCCESS. El job `security/backend-security` del gate de seguridad también terminó SUCCESS; `mutation/plus-backend-mutmut` seguía en curso al cierre y es un gate independiente, ajeno a la evidencia EV-R.
- Producto Lite (`radicalRationalize.ts`): reescribe solo un resultado completo `1/(a±√b)` con enteros literales y `|b−a²| = 1` mediante la identidad conjugada exacta; `1/(√2+1)` pasa de `1/(1+2^(1/2))` a **`2^(1/2)-1`**. El resto de formas queda intacto.
- Producto Plus: (a) `parsing.py` convierte la notación radical de índice impar con radicando literal negativo a la **raíz real** (EV-R-03/05: `\sqrt[3]{-8} = -2`, `\sqrt[5]{-32} = -2`), sin tocar el resto de la sintaxis de potencia; (b) `routers/evaluate.py` aplica `sqrtdenest` solo a una raíz cuadrada completa cuyo radicando ya contiene otra raíz cuadrada, con lo que EV-R-11/12 devuelven `1+sqrt(2)` y `sqrt(2)+sqrt(3)`.
- Convenciones **declaradas antes de certificar** en `MANUAL_CAPABILITY_GAPS.md`: notación radical de índice impar = raíz real; potencia con exponente fraccionario = rama principal (`2(-1)^{1/3} = 1+\sqrt{3}i`, EV-R-14); `\sqrt{-4} = 2i` en la rama compleja declarada (EV-R-13); alcances acotados de la racionalización y del denesting.
- Sin regresiones locales: Lite 2050 passed con las 5 fallas patológicas ya conocidas (`algebra114AsFac08/09`, `algebra229AsB06/B18/B20`); CI es el oráculo y quedó verde.

**Siguiente objetivo — EV-M-01..13 (mixtas).** Sondeo local verificado en Lite: EV-M-01, 03, 05, 06, 07, 08, 09, 10, 11 y 12 ya devuelven la forma o el valor pedidos. Defectos detectados antes de certificar:

- **EV-M-02** `e^{2\ln 3}`: Lite devuelve `exp(2*log(3))`; falta la identidad exacta `exp(k·log r) = r^k` (el módulo EV-E solo cubre sumas de logaritmos sin coeficiente).
- **EV-M-04** `f(x)=\ln(x^{2}+1);\ f(\sqrt{e-1})`: error de parseo por `Carácter no reconocido: ";"` en la forma con `\left(...\right)` dentro de la definición (EV-M-05/06/07/08/12 sí resuelven la sustitución).
- **EV-M-13**: Lite devuelve `log(2-3^(1/2))+log(2+3^(1/2))`; falta la identidad `log a + log b = log(a·b)` para concluir `0`.
- Falta verificar la paridad Plus de las 13 filas.

## 2026-10-21 UTC — r230: EV-E-01..14 cerrado bilateralmente; EV-R diagnosticado

**EV-E-01..14 (exponenciales) — PASS_SCOPED_BILATERAL.**

- Lite `16e5ca750f10…`: cumulative [39681554692] — **SUCCESS**, 348 archivos, **2049 passed**, 8 expected fail, 34 todo; `tests/logExpEvE01to14.audit.test.ts` **6/6**; guard `skip=false` («No reusable completed evidence found»). h1d [39681554639] y scientific-ui [39681554580] — SUCCESS.
- Plus `9a06ae8da282…`: cumulative [39681592267] — **SUCCESS**, **1818 passed**, 6 xfailed, cobertura 88.06%; `tests/test_log_exp_matrix_ev_e01_l14.py` **6/6 PASSED**; guard `skip=false`. h1d [39681592361] — SUCCESS.
- Producto (solo Lite): `engine/expLogSimplify.ts` aplica únicamente la identidad exacta `exp(±log r1 ± log r2 …) = producto/cociente` de racionales literales, con enteros seguros y reducción por mcd; se engancha tras `simplifyLogResult`. `e^{ln 2+ln 3}` pasa de `exp(log(2)+log(3))` a **`6`**. Las formas no soportadas (términos no logarítmicos, argumentos simbólicos, magnitudes fuera del rango entero seguro) se devuelven intactas: sin aproximación ni heurística.
- Oráculos por fila: exactos EV-E-01/03/04/05/06/10/13; EV-E-02/07/08/09/11/12 contra las referencias de nueve decimales (EV-E-11 en relativo); EV-E-13 `-1` (la fila lo documenta en ℂ); EV-E-14 `1` bajo la convención declarada.
- Decisiones declaradas en `MANUAL_CAPABILITY_GAPS.md`: (a) `0^0 = 1` para EV-E-14; (b) EV-E-12 conserva como `result_text` la fracción exacta de ~3600 dígitos en **ambos** motores mientras el canal aproximado da `2.716923932` — limitación de presentación/complejidad, no matemática; el oráculo numérico de la fila se cumple.

**Siguiente objetivo — EV-R-01..14 (radicales).** Sondeo local verificado en Lite: EV-R-01..07, 09, 10, 11 y 12 ya devuelven la forma pedida. Defectos y convenciones a resolver antes de certificar:

- **EV-R-08** `1/(√2+1)`: Lite devuelve `1/(1+2^(1/2))` (valor correcto, forma sin racionalizar); la fila exige `√2−1`.
- **EV-R-13** `√−4`: Lite devuelve `2i`; la fila admite la rama compleja **solo si se declara** (en ℝ exige error claro).
- **EV-R-14** `(−8)^{1/3}`: Lite devuelve la forma principal `2*(-1)^(1/3)` (≈1+1.732i); la fila exige declarar real `−2` o principal.
- Falta verificar la paridad Plus de las 14 filas y fijar ambas convenciones antes de emitir PASS.

## 2026-10-21 UTC — r229: EV-L cerrado, EV-I-09/I-10 cerrados bilateralmente; EV-E diagnosticado

**Reconciliación previa:** el índice estaba en r228 (EV-I-07) mientras HEAD ya había avanzado con la implementación EV-L (Lite `86cd568b`, `47988786`; Plus `fd9158ff`…`6edbb54d`). Se verificó la evidencia real de esos SHA antes de heredar objetivo: guard `skip=false` ("No reusable completed evidence found") y pruebas EV-L ejecutadas y aprobadas, no omitidas.

**EV-L-01..14 (logarítmicas) — PASS_SCOPED_BILATERAL.**

- Lite `47988786a6340d434db67a7a627ff525ae697864`: cumulative [39651672489](https://github.com/c2melendez/precision-lab-lite/actions/runs/39651672489) — SUCCESS, 346 archivos, 2034 passed, 8 expected fail, 34 todo; `tests/trigonometryEvL01to14.audit.test.ts` 6/6. h1d [39651672506](https://github.com/c2melendez/precision-lab-lite/actions/runs/39651672506) y scientific-ui [39651672303](https://github.com/c2melendez/precision-lab-lite/actions/runs/39651672303) — SUCCESS.
- Plus `6edbb54d2b13e897e98c83f3a6872eefae869765`: cumulative [39661568080](https://github.com/c2melendez/precision-lab-plus/actions/runs/39661568080) — SUCCESS, backend 1806 passed, 6 xfailed, cobertura 88.08%; `tests/test_log_matrix_ev_l01_l14.py` 5/5 PASSED. h1d [39661568110](https://github.com/c2melendez/precision-lab-plus/actions/runs/39661568110), native-syntax [39661568063](https://github.com/c2melendez/precision-lab-plus/actions/runs/39661568063) y SG28 [39661568064](https://github.com/c2melendez/precision-lab-plus/actions/runs/39661568064) — SUCCESS.
- Alcance: EV-L-01/02/03/04/06/07/10 exactos; EV-L-05/08/11 con forma exacta y referencia redondeada a 9 decimales; EV-L-09 producto de logs en ASCII y LaTeX; EV-L-12 `DOMAIN_ERROR`; EV-L-13 `i*pi` (rama compleja que documenta la fila); EV-L-14 base inválida con error claro.

**EV-I-09 / EV-I-10 — PASS_SCOPED_BILATERAL.** Eran los dos defectos abiertos exclusivos de Lite.

- Producto (Lite): nuevo `engine/inverseTrigComposition.ts` conectado en `evaluate`. `arcsin(sin 2)` devuelve `-2+pi` (antes `2`, rama incorrecta) y `sin(arccos 3/5)` devuelve `4/5` (antes sin evaluar). Se cubren además las ramas principales de `arccos(cos t)` y `arctan(tan t)` (antes `2` en ambos) y las identidades pitagóricas `cos(arcsin u)`, `tan(arcsin u)`, `tan(arccos u)`. Solo actúa sobre una composición completa con argumento numérico; lo simbólico queda intacto.
- Hallazgo adicional: la validación G3 rechazaba los macros LaTeX contractuales (`\arcsin`, `\arccos`, `\arctan`, `\arcsec`, `\arccsc`, `\arccot` y las inversas hiperbólicas) con «Comando desconocido», de modo que las filas oficiales EV-I solo eran certificables por el canal ASCII. Corregido en `parsing/normalize.ts`.
- Lite `bd9c207c1b091bfd017fb8f3ca7ff8f21e06415b`: cumulative [39679799460](https://github.com/c2melendez/precision-lab-lite/actions/runs/39679799460) — SUCCESS, 347 archivos, 2043 passed, 8 expected fail, 34 todo; `tests/trigonometryEvI09I10.audit.test.ts` 9/9; h1d [39679798743](https://github.com/c2melendez/precision-lab-lite/actions/runs/39679798743) y scientific-ui [39679798735](https://github.com/c2melendez/precision-lab-lite/actions/runs/39679798735) — SUCCESS.
- Plus `996ed03026c95ced15443a579c35115f25d5e3c3`: cumulative [39679906072](https://github.com/c2melendez/precision-lab-plus/actions/runs/39679906072) — SUCCESS, backend 1812 passed, 6 xfailed, cobertura 88.08%; `tests/test_trigonometry_ev_i09_i10.py` 6/6 PASSED; h1d [39679906136](https://github.com/c2melendez/precision-lab-plus/actions/runs/39679906136) — SUCCESS. Sin cambio de producto: Plus ya devolvía `-2+pi` y `4/5`.

**Siguiente objetivo — EV-E-01..14 (exponenciales) de `matriz_log_exp_radicales`.** Sondeo local verificado en ambos motores: EV-E-01..09, EV-E-11 y EV-E-13 ya son correctos; **EV-E-10** `e^{ln 2+ln 3}` devuelve `6` en Plus pero queda simbólico `exp(log(2)+log(3))` en Lite (defecto de producto Lite); **EV-E-12** `(1+1/1000)^{1000}` devuelve una fracción exacta de ~3600 dígitos como `result_text` en **ambos** motores, mientras `result_approx` sí es `2.716923932` (defecto bilateral de presentación/complejidad); **EV-E-14** `0^{0}` devuelve `1` en ambos, valor que la fila admite solo bajo convención declarada (declarar en `MANUAL_CAPABILITY_GAPS.md`). No se declara ningún PASS de EV-E.

Certificación global continúa **OPEN** por los bloqueos independientes registrados (SG28/DIST, S25, SY-P-23, SY-X-04 Plus HTTP, Algebra229-AS-B-29).

---

## 2026-10-21 UTC — EV-I-07 cierre r228 y arranque de EV-L (logarítmicas)

**EV-I-07 — `arccot(-1) = 3π/4`: PASS_SCOPED_BILATERAL.** La matriz congelada exige el rango principal `(0, π)`; los motores usaban la rama `arctan(1/x)` / `acot` de SymPy (`-π/4`).

- Cambio de producto: `arccot(a) = π/2 − arctan(a)` en el parser de Lite (incluye la ruta `\cot^{-1}`) y reescritura de `acot` en `evaluate_service` de Plus (solo cuando la expresión contiene `acot`).
- Lite `76e89a9b3546ad73b4be61fea4cd48de5905195f`: cumulative [39648569475](https://github.com/c2melendez/precision-lab-lite/actions/runs/39648569475) — SUCCESS, 2028 passed, 8 expected fail, 34 TODO; h1d [39648569239](https://github.com/c2melendez/precision-lab-lite/actions/runs/39648569239) y scientific-ui [39648569417](https://github.com/c2melendez/precision-lab-lite/actions/runs/39648569417) — SUCCESS.
- Plus `f8bdd40a2bbd6016f412019a246e4dbce23835f1`: cumulative [39648580772](https://github.com/c2melendez/precision-lab-plus/actions/runs/39648580772) — SUCCESS, 1801 passed; h1d [39648579685](https://github.com/c2melendez/precision-lab-plus/actions/runs/39648579685) — SUCCESS.
- Resultado: `arccot(-1)=3π/4`, `arccot(0)=π/2`, `arccot(1)=π/4` en ambos motores; oráculos de parser y alias actualizados.

**Defectos EV-I aún abiertos (solo Lite; Plus ya los resuelve):**

- **EV-I-09** `arcsin(sin 2)`: Lite devuelve `2` (Algebrite simplifica sin respetar la rama principal); correcto `π−2 ≈ 1.141592654`. Plus devuelve `-2 + pi`.
- **EV-I-10** `sin(arccos(3/5))`: Lite deja la expresión sin evaluar; correcto `4/5`. Plus devuelve `4/5`.

**EV-L (logarítmicas) — primeros hallazgos de sondeo (sin cambios de producto todavía):**

- LaTeX correcto: `\log_{2}(8)` → `3`; `\log_{10}(0.001)` → `-log(1000)/log(10)` (sin simplificar a `-3`); `\log_{4}(8)` → `log(8)/log(4)` (sin simplificar a `3/2`); `\log_{8}(2)` → `log(2)/log(8)` (sin simplificar a `1/3`); `\ln(0)` → `DOMAIN_ERROR`; `\ln(-1)` → `i*pi`.
- `\ln(10^{50})` → `log(1000…0)` sin aplicar `n·ln 10` (esperado `50 ln 10 ≈ 115.129254650`).
- `\log_{1}(5)` → error de división entre cero (esperado error claro de base inválida).
- `\log_{2}(3)\cdot\log_{3}(4)` → **error de parseo** (`Carácter no reconocido: "_"`); la segunda base no se normaliza tras `\cdot`.
- La forma ASCII `log_2(8)` se parsea como producto de variables (`log*S*U*B*T*W*O*(8)`): no es el canal contractual (la matriz usa LaTeX), pero es un riesgo de entrada.
- Plus resuelve exactamente `log(8)/log(2)`, `log(8)/log(4)`, `log(2)/log(8)`, `log(1000)/log(10)` y `ln(10^50)=50*ln(10)`.

---

## 2026-10-21 UTC — EV-H cierre r227: PASS_SCOPED (canal numérico)

**EV-H-01..12 — PASS_SCOPED.** Gates SUCCESS sobre el SHA técnico `54f81f21806fbe02ebf4c40ed237ed244a667de4`:

- cumulative: [39596870367](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596870367) — SUCCESS; 2025 passed, 8 expected fail, 34 TODO; EV-H 9/9.
- h1d: [39596869965](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596869965) — SUCCESS; scientific-ui: [39596870180](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596870180) — SUCCESS.
- Alcance: EV-H-01..03 exactos (`0`,`1`,`0`); EV-H-04..09 verificados por valor numérico (Lite imprime `0.75`, `1.25`, `0.6`, `1.333333...`, `0.8`, `1.666667...`); EV-H-10/11 a 9 decimales; EV-H-12 identidad exacta `1`.
- Limitación registrada: la forma racional exacta (`3/4`, `5/4`, `3/5`, `4/3`, `4/5`, `5/3`) no aparece en `result_text` en ninguno de los dos motores (Plus deja la forma simbólica y expone `result_approx`).
- EV-I grupo A quedó cerrado bilateralmente (scientific-ui de Lite confirmado SUCCESS).
- Certificación global continúa OPEN por bloqueos independientes.
- Siguiente objetivo: EV-I-07 (rango principal de `arccot`) y los defectos Lite EV-I-09/I-10; después continuar con las matrices siguientes del protocolo (Log/Exp/Radicales).

---

## 2026-10-21 UTC — EV-I grupo A cierre r226; EV-H en ejecución

**EV-I-01..06, EV-I-08 y EV-I-11 — PASS_SCOPED_BILATERAL.** Cobertura publicada en `11d0192582c337e38ec3718940f5f620644e44f0`. Resultados:

- cumulative: [39596378248](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596378248) — SUCCESS; 2016 passed, 8 expected fail, 34 TODO.
- h1d: [39596378313](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596378313) — SUCCESS.
- scientific-ui: [39596378121](https://github.com/c2melendez/precision-lab-lite/actions/runs/39596378121) — SUCCESS (confirmado; el listado de la API mostró `in_progress` rezagado durante varios minutos).
- Plus: cumulative [39596384431](https://github.com/c2melendez/precision-lab-plus/actions/runs/39596384431) — SUCCESS, 1794 passed, 6 xfailed; h1d [39596384432](https://github.com/c2melendez/precision-lab-plus/actions/runs/39596384432) — SUCCESS.

**EV-H-01..12 (hiperbólicas) test-first publicado** — Lite `54f81f21806fbe02ebf4c40ed237ed244a667de4` / Plus `e7107279a0309e9c31114b3b725b51103cffbef7`; gates en ejecución.

- Alcance previsto: EV-H-01..03 exactos (`0`,`1`,`0`); EV-H-04..09 certificables por canal numérico (ningún motor simplifica `sinh(ln 2)` a `3/4`: Lite muestra `0.75`/`0.6`/`1.333333...`, Plus deja la forma simbólica y expone `result_approx`); EV-H-10/11 aproximaciones a 9 decimales; EV-H-12 identidad exacta `1`.
- Limitación a registrar: la forma racional exacta de EV-H-04..09 no se muestra en `result_text` en ninguno de los dos motores.

---

## 2026-10-21 UTC — AUD-SING cierre r225 y EV-I grupo A en ejecución

**AUD-SING-01/02 — PASS_SCOPED (correcciones reales de producto).** Gates SUCCESS sobre el SHA técnico `7d83a9ac14c73dc70fb52d8902e01dc9313d1924`:

- cumulative: [39595606769](https://github.com/c2melendez/precision-lab-lite/actions/runs/39595606769) — SUCCESS; 2008 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS.
- h1d: [39595606725](https://github.com/c2melendez/precision-lab-lite/actions/runs/39595606725) — SUCCESS; scientific-ui: [39595606686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39595606686) — SUCCESS.
- `arccot(0) = π/2` (ya no error de división entre cero); `arcsinh/arccosh/arctanh/arccoth/arccsch/arcsech` se resuelven como funciones (antes `arcsinh(1)` = `arcsin*h*1` = **0**); en GRAD `sec/csc/cot` convierten ángulo (`sec(90)`→`DOMAIN_ERROR`, `cot(45)`→1, `csc(30)`→2); `arcsin(2)`/`arccos(2)`→`DOMAIN_ERROR`.
- Plus alineado: gates SUCCESS en `587aecc1f978e03bb976212f3c32fc632b76d0b0` — cumulative [39595617829](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617829) (1791 passed, 6 xfailed), h1d [39595617779](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617779), native syntax [39595617887](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617887), SG28 prototype [39595617826](https://github.com/c2melendez/precision-lab-plus/actions/runs/39595617826).

**EV-I grupo A en ejecución** — Lite `11d0192582c337e38ec3718940f5f620644e44f0` / Plus `43738a0fd6387e99a71bdf0124e15fb5c698c877`: EV-I-01..06 (`arcsin(1/2)`, `arccos(-1/2)`, `arctan(1)`, `arctan(√3)`, `arccsc(2)`, `arcsec(2)`), EV-I-08 (`arccot(0)=π/2`) y EV-I-11 (`cos(arctan 2)=√5/5`), con fila congelada verificada.

**Pendientes EV-I con defecto demostrado (no certificados):**
- **EV-I-07** `arccot(-1)`: la matriz exige `3π/4`; ambos motores devuelven `-π/4` (rama `arctan(1/x)` / convención SymPy). Requiere decisión de contrato y corrección bilateral a rango principal (0, π).
- **EV-I-09** `arcsin(sin 2)`: el motor devuelve `2` (simplificación que ignora la rama principal; el valor correcto es `π-2 ≈ 1.141592654`). Defecto de producto pendiente.
- **EV-I-10** `sin(arccos(3/5))`: el motor deja la expresión sin evaluar (`4/5` esperado). Capacidad pendiente.

---

## 2026-10-21 UTC — EV-D-12 cierre r224 y auditoría de singularidades evitables (AUD-SING)

**EV-D-12 — `tan(π/2)` indefinida (error claro): PASS_SCOPED.** Fila congelada verificada; los tres gates Lite terminaron SUCCESS con `head_sha` exacto.

- cumulative: [39593868026](https://github.com/c2melendez/precision-lab-lite/actions/runs/39593868026) — SUCCESS; EV-D-12 7/7; 1999 passed, 8 expected fail, 34 TODO; SHA `7cc7bf8a458d37c182adbfd898a1626e665aba76`.
- h1d: [39593867990](https://github.com/c2melendez/precision-lab-lite/actions/runs/39593867990) — SUCCESS; scientific-ui: [39593867986](https://github.com/c2melendez/precision-lab-lite/actions/runs/39593867986) — SUCCESS.
- Corrección de producto: `tan(π/2+kπ)` devolvía la forma sin evaluar `tan(1/2*pi)`; ahora se detecta el polo con el coseno exacto del motor y se emite `DOMAIN_ERROR` ("Tangente no definida"), solo para el resultado que es exactamente `tan(...)`. `log(0)`/`ln(0)` también emiten `DOMAIN_ERROR` (paridad con Plus).
- Plus ya cumplía (`DOMAIN_ERROR` en `tan(pi/2)` y `log(0)`): [39593883422](https://github.com/c2melendez/precision-lab-plus/actions/runs/39593883422) — SUCCESS, 1783 passed, 6 xfailed, cobertura 88.05%; h1d [39593883403](https://github.com/c2melendez/precision-lab-plus/actions/runs/39593883403) — SUCCESS.

**Auditoría de decisiones previas que creaban singularidades/valores silenciosos (AUD-SING), en ejecución sobre Lite `7d83a9ac` / Plus `587aecc1`:**

- **AUD-SING-01 — `arccot(0)`:** era un error de división entre cero por la reescritura `arctan(1/0)`, pese a que `arccot(0)=π/2`. Corregido en el parser (caso exacto 0 → `pi/2`), conservando `arctan(1/x)` para `x≠0` (rama compatible con Plus).
- **AUD-SING-02 — alias hiperbólicos:** `arcsinh/arccosh/arctanh/arccoth` no estaban en el mapa de alias y se partían como producto implícito (`arcsinh(1)` → `arcsin*h*1` → **0**). Añadidos al mapa y a los dos pasadas de reescritura; `arccoth → acoth`, `arccsch → acsch`, `arcsech → asech` en forma canónica.
- **AUD-SING-02 — modo grados:** `sec/csc/cot` no convertían ángulo en GRAD porque solo `sin/cos/tan` estaban en la lista de conversión; `sec(90)` daba `-2.2318`, `cot(45)` `0.6174`, `csc(30)` `-1.0121`. Ahora las tres convierten y coinciden con Plus (`DOMAIN_ERROR`/`1`/`2`).
- **EV-I-12 (adelanto):** `arcsin(2)`/`arccos(2)` devolvían la llamada sin evaluar; ahora `DOMAIN_ERROR` claro en ambos motores (Plus corregido en `evaluate_service.py`).
- Gates de este lote en ejecución; no se declara PASS hasta revisar conclusión y logs.

---

## 2026-10-21 UTC — EV-D-11 cierre r223: PASS_SCOPED_EQUIVALENT

**EV-D-11 — `sin²(π/8) + cos²(π/8) = 1`: PASS_SCOPED_EQUIVALENT.** Fila congelada verificada; los tres gates Lite terminaron SUCCESS con `head_sha` exacto.

- cumulative: [39583453889](https://github.com/c2melendez/precision-lab-lite/actions/runs/39583453889) — SUCCESS; EV-D-11 3/3; 339 archivos, 1992 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS.
- h1d: [39583453775](https://github.com/c2melendez/precision-lab-lite/actions/runs/39583453775) — SUCCESS; mismo SHA `52f50ea44558343c88c2a926e438d61d0f03486d`.
- scientific-ui: [39583453805](https://github.com/c2melendez/precision-lab-lite/actions/runs/39583453805) — SUCCESS; mismo SHA.
- Alcance: `evaluate()` conserva la identidad en forma exacta `cos(1/8*pi)^2+sin(1/8*pi)^2`; el oráculo certifica equivalencia exacta (`simplify(...) = 1`, diferencia `= 0`) y valor numérico `≈ 1`, conforme a la regla G2 de no exigir igualdad textual cuando existen representaciones equivalentes. Limitación registrada: la identidad pitagórica no se colapsa automáticamente a `1` en el canal primario.
- Plus sí devuelve `1` literal (`2f37ee2f10f8bac361eff592bbe3e0a5a3b654e9`).
- Certificación global continúa OPEN por bloqueos independientes.
- Siguiente objetivo: TRIG-EV-D-12-TEST-FIRST (`tan(π/2)` indefinida: contrato de error claro). Verificar antes la fila fuente y el contrato de error vigente.

---

## 2026-10-21 UTC — EV-D-10 cierre r222: PASS_SCOPED_BILATERAL (con corrección de producto)

**EV-D-10 — `cot(π/2) = 0`: PASS_SCOPED_BILATERAL.** Fila congelada verificada. El caso destapó un defecto real de producto en Lite y se corrigió la capa correcta (parser), no el oráculo.

- Diagnóstico: `cot(a)` se reescribía como `1/tan(a)`; en `a = π/2` eso deja una singularidad evitable y el motor devolvía `1/(tan(1/2*pi))` en vez de `0`.
- Corrección: `cot(a)` se reescribe como `cos(a)/sin(a)` en `src/engine/parsing/index.ts`; `cos(π/2)/sin(π/2) = 0/1 = 0` y `cot(0)` sigue indefinida.
- Primer gate acumulativo del SHA de la corrección `b5bd0fa3b06da410d10b9a0fe2503756d7f6570a` falló [39563431468](https://github.com/c2melendez/precision-lab-lite/actions/runs/39563431468) solo en el oráculo `EN-AL-11` de alias C3, que exigía `cot(` o `1/tan(`. Se amplió la expectativa a la codificación canónica `cos(...)/sin(...)` (commit de tests `4c92b797189cb41ffe70de93332938ba67d389b5`); producto sin cambios adicionales.
- Evidencia final (SHA `4c92b797189cb41ffe70de93332938ba67d389b5`):
  - cumulative: [39564052659](https://github.com/c2melendez/precision-lab-lite/actions/runs/39564052659) — SUCCESS; EV-D-10 3/3; 338 archivos, 1989 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS.
  - h1d: [39564052660](https://github.com/c2melendez/precision-lab-lite/actions/runs/39564052660) — SUCCESS; mismo SHA.
  - scientific-ui: [39564052665](https://github.com/c2melendez/precision-lab-lite/actions/runs/39564052665) — SUCCESS; mismo SHA.
- Plus no requirió cambio de producto (SymPy ya devuelve `0`); su evidencia es `b635db5fa6e00fab92a144d421398ff5d5df0763`.
- Siguiente objetivo en ejecución: TRIG-EV-D-11-TEST-FIRST (identidad pitagórica `sin²(π/8)+cos²(π/8)=1`), tests publicados en el SHA técnico `52f50ea44558343c88c2a926e438d61d0f03486d`.
- Certificación global continúa OPEN por bloqueos independientes.

---

## 2026-10-21 UTC — EV-D-09 cierre r221 y EV-D-10 con defecto de producto corregido

**EV-D-09 — `cos(2) ≈ -0.416146837`: PASS_SCOPED_BILATERAL.** Fila congelada verificada; los tres gates Lite terminaron SUCCESS con `head_sha` exacto.

- cumulative: [39562383033](https://github.com/c2melendez/precision-lab-lite/actions/runs/39562383033) — SUCCESS; SHA técnico `7e6d29ae4c391805154ebae8029436792ee010fb` exacto.
- h1d: [39562383038](https://github.com/c2melendez/precision-lab-lite/actions/runs/39562383038) — SUCCESS; mismo SHA.
- scientific-ui: [39562383018](https://github.com/c2melendez/precision-lab-lite/actions/runs/39562383018) — SUCCESS; mismo SHA.
- Prueba EV-D-09: 4/4; suite Vitest 337 archivos, 1986 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.

**EV-D-10 — `cot(π/2) = 0`: defecto de producto confirmado y corregido (gate en ejecución).** La prueba test-first reprodujo el fallo: el motor devolvía `1/(tan(1/2*pi))` en vez de `0` porque `cot(a)` se reescribía como `1/tan(a)`, con singularidad evitable en los ceros de `tan`.

- Corrección de producto en `src/engine/parsing/index.ts`: `cot(a)` se reescribe como `cos(a)/sin(a)` (misma identidad, resuelve `cos(π/2)/sin(π/2) = 0/1 = 0` y mantiene `cot(0)` indefinida). Se actualizó la expectativa del contrato de parser en `tests/parsing.test.ts`.
- Evidencia local previa al cambio: `expected '1/(tan(1/2*pi))' to be '0'` en las dos pruebas de `tests/trigonometryEvD10.audit.test.ts`; tras el cambio, 129 pruebas relacionadas (EV-D-06, EV-D-10, parsing, trigonometría exhaustiva, paridad de teclado) pasan.
- SHA con la corrección: Lite `b5bd0fa3b06da410d10b9a0fe2503756d7f6570a`; Plus `b635db5fa6e00fab92a144d421398ff5d5df0763` (Plus no requirió cambio de producto: SymPy ya devuelve `0`).
- Gates EV-D-10 en ejecución; no se declara PASS hasta revisar conclusión y logs.
- Certificación global continúa OPEN por bloqueos independientes.

---

## 2026-10-21 UTC — EV-D-08 cierre r220: PASS_SCOPED_BILATERAL

**EV-D-08 — `sin(1) ≈ 0.841470985`: PASS_SCOPED_BILATERAL.** Se verificó la fila congelada `| EV-D-08 | \`\sin(1)\` | \`\approx 0.841470985\` |` y se documentó la convención de oráculo para filas `\approx` en `EXECUTION_PROTOCOL.md`. No se modificó código de producto.

- cumulative: [39561366616](https://github.com/c2melendez/precision-lab-lite/actions/runs/39561366616) — SUCCESS; SHA técnico `d605a23bac884d99b5eee38a5a1f4197c4172c57` exacto.
- h1d: [39561366691](https://github.com/c2melendez/precision-lab-lite/actions/runs/39561366691) — SUCCESS; mismo SHA.
- scientific-ui: [39561366624](https://github.com/c2melendez/precision-lab-lite/actions/runs/39561366624) — SUCCESS; mismo SHA.
- Prueba EV-D-08: 4/4 en `tests/trigonometryEvD08.audit.test.ts`; suite Vitest 336 archivos, 1982 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.
- El motor conserva la forma exacta `sin(1)`; el oráculo comprueba que `0.841470985` es el redondeo correcto a 9 decimales y que el canal `float` (6 decimales) coincide con tolerancia 1e-6. Una salida solo decimal no certifica.
- Certificación global continúa OPEN por bloqueos independientes; este cierre solo certifica EV-D-08.
- Siguiente objetivo en ejecución: TRIG-EV-D-09-TEST-FIRST (`cos(2) ≈ -0.416146837`), tests publicados en el SHA técnico `7e6d29ae4c391805154ebae8029436792ee010fb`.

---

## 2026-10-21 UTC — EV-D-07 cierre r219: PASS_SCOPED_BILATERAL

**EV-D-07 — `sin(5π/4) = -√2/2`: PASS_SCOPED_BILATERAL.** Se verificó la fila congelada `| EV-D-07 | \`\sin\left(\frac{5\pi}{4}\right)\` | \`-\frac{\sqrt{2}}{2}\` |`. Los tres gates requeridos terminaron SUCCESS con `head_sha` exacto; no se modificó código de producto.

- cumulative: [39560031960](https://github.com/c2melendez/precision-lab-lite/actions/runs/39560031960) — SUCCESS; SHA técnico `1275c24933b2ca77a31bba6e1d2c01274e97795e` exacto.
- h1d: [39560031969](https://github.com/c2melendez/precision-lab-lite/actions/runs/39560031969) — SUCCESS; mismo SHA.
- scientific-ui: [39560031973](https://github.com/c2melendez/precision-lab-lite/actions/runs/39560031973) — SUCCESS; mismo SHA.
- Prueba EV-D-07: 3/3 en `tests/trigonometryEvD07.audit.test.ts`; suite Vitest 335 archivos, 1978 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.
- El motor devuelve la forma exacta `-1/2*2^(1/2)` (equivalente a `-√2/2`); el oráculo exige equivalencia algebraica y valor numérico y rechaza una salida decimal.
- Certificación global continúa OPEN por bloqueos independientes; este cierre solo certifica EV-D-07.
- Siguiente objetivo: TRIG-EV-D-08-TEST-FIRST (`sin(1) ≈ 0.841470985`). Antes de escribir pruebas, definir el oráculo contractual para filas con `\approx` (tolerancia y dígitos documentados) en ambos motores.

---

## 2026-10-21 UTC — EV-D-06 cierre r218: PASS_SCOPED_BILATERAL

**EV-D-06 — `cot(pi/4)=1`: PASS_SCOPED_BILATERAL.** Se verificó la fila de la matriz trigonométrica congelada. Todos los gates requeridos terminaron SUCCESS y sus `head_sha` coinciden con el SHA técnico indicado. No se modificó código de producto.

- cumulative: [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991) — SUCCESS; SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8` exacto.
- h1d: [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974) — SUCCESS; SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8` exacto.
- scientific-ui: [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008) — SUCCESS; SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8` exacto.

- Prueba específica EV-D-06: 3/3; suite Vitest 1975 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS. Scientific UI: 456/456 passed.
- Diagnóstico del primer intento Lite: la aserción no admitía el resultado `1` entre backticks como aparece en la matriz. Se corrigió únicamente el test. Producto sin cambios.
- Certificación global continúa OPEN por bloqueos independientes registrados; este cierre solo certifica EV-D-06.
- Siguiente objetivo pendiente de ejecución: TRIG-EV-D-07-TEST-FIRST. Antes de escribir pruebas, confirmar la fila EV-D-07 en la fuente congelada; no asumir expresión ni resultado.

---

## 2026-10-21 UTC — EV-D-06 actualización r217: Plus acumulativo PASS

- **Plus cumulative PASS** [39557484508](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484508), SHA técnico `6369a617e59f2f23fe73ac4e464683de310a688a`: backend 1766 passed, 6 xfailed, cobertura 88.05%; `test_ev_d06_source_row_present_and_frozen` y `test_ev_d06_cot_pi_over_4_http_ascii` PASSED. Frontend typecheck, regresión y production build SUCCESS.
- **Plus H1d PASS** [39557484518](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484518), mismo SHA.
- **Lite cumulative PASS** [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991): EV-D-06 3/3, 1975 passed, 8 expected fail, 34 TODO; typecheck/build SUCCESS. **Lite H1d PASS** [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974).
- Único gate pendiente para el cierre del objetivo: **Lite Scientific UI** [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008), todavía ejecutando Native desktop/tablet/mobile scientific result verification. EV-D-06 permanece IN_PROGRESS hasta que este gate termine; no se declara PASS bilateral todavía.
- Producto sin cambios. Certificación global OPEN.

---

## 2026-10-21 UTC — EV-D-06 checkpoint r216: gates parciales verificados

- **Lite cumulative PASS** [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991), SHA técnico `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8`: suite EV-D-06 3/3; 334/334 archivos Vitest, 1975 passed, 8 expected fail, 34 TODO; typecheck y production build SUCCESS.
- **Lite H1d PASS** [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974), mismo SHA. **Lite Scientific UI** [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008) continúa en el paso Native desktop/tablet/mobile scientific result verification.
- **Plus H1d PASS** [39557484518](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484518), SHA técnico `6369a617e59f2f23fe73ac4e464683de310a688a). **Plus cumulative** [39557484508](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484508): frontend SUCCESS; backend regression sigue IN_PROGRESS.
- La fila fuente está confirmada como `| EV-D-06 | `\\cot\\left(\\frac{\\pi}{4}\\right)` | `1` |`. Fallo inicial de Lite fue solo el regex que no aceptaba backticks; corregido. No se cambió producto.
- EV-D-06 permanece **IN_PROGRESS** hasta que terminen Lite Scientific UI y Plus cumulative y se revisen logs y SHA. Certificación global OPEN.

---

## 2026-10-21 UTC — EV-D-06 test-first checkpoint; gates pending

**Fuente congelada verificada:** la fila EV-D-06 es `cot(pi/4)=1`, representada como `\\cot\\left(\\frac{\\pi}{4}\\right)` con el resultado en backticks. Se agregó cobertura test-first en ambos motores; no se modificó código de producto.

- **Lite**: commit de pruebas corregido `00892789a8cd5c6e12ba43cb47fce4d97f7b1bc8`. La corrida acumulativa inicial [39557278838](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557278838) falló únicamente porque la aserción del resultado no aceptaba los backticks del formato fuente. El log confirma que las pruebas ASCII y LaTeX sí pasaron; total previo a la corrección: 1974 passed, 1 failed (solo formato de la prueba), 8 expected fail, 34 TODO. Corregido para aceptar `1` y `1` con formato literal de matriz.
- **Plus**: test `backend/tests/test_trigonometry_ev_d06.py`; commit corregido `6369a617e59f2f23fe73ac4e464683de310a688a`, con el mismo ajuste para que la aserción fuente acepte el resultado documentado con backticks. No se ha observado ni autorizado cambio de producto.
- Gates del SHA final están en ejecución: Lite cumulative [39557479991](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479991), H1d [39557479974](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557479974), Scientific UI [39557480008](https://github.com/c2melendez/precision-lab-lite/actions/runs/39557480008); Plus cumulative [39557484508](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484508), H1d [39557484518](https://github.com/c2melendez/precision-lab-plus/actions/runs/39557484518). Validar conclusión y SHA exacto antes de marcar PASS.
- **Estado EV-D-06: IN_PROGRESS.** Próxima acción: revisar todos los gates finales y logs, resolver solo fallos demostrados, luego cerrar bilateralmente. Certificación global continúa OPEN por bloqueos previos.

---

## 2026-10-21 UTC — r214: EV-D-05 PASS_SCOPED_BILATERAL; EV-D-06 preparado

**EV-D-05 — `sec(pi/3)=2`: PASS_SCOPED_BILATERAL.** La fila fuente de la matriz congelada y el resultado esperado fueron verificados en las pruebas de ambos motores. No se modificó código de producto.

- **Lite**, test commit `24871267ec1ee9f64bbd2d34fd449b41ee74f99c`: cumulative [39555164790](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164790), H1d [39555164686](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164686), Scientific UI [39555164730](https://github.com/c2melendez/precision-lab-lite/actions/runs/39555164730): todos SUCCESS con SHA exacto. El log acumulativo confirma el archivo `tests/trigonometryEvD05.audit.test.ts` con 3/3 pruebas aprobadas; 1972 passed, 8 expected fail y 34 TODO en el total de Vitest.
- **Plus**, test corregido commit `8885a3b47dc6509c52a08312bbc87d5f1651c6da`: cumulative [39556359520](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359520) y H1d [39556359572](https://github.com/c2melendez/precision-lab-plus/actions/runs/39556359572): ambos SUCCESS con SHA exacto. Backend: 1764 passed, 6 xfailed, cobertura 88.07%; tanto `test_ev_d05_source_row_present_and_frozen` como `test_ev_d05_sec_pi_over_3_http_ascii` PASSED. Frontend typecheck, regresión y build SUCCESS.
- Diagnóstico del intento inicial Plus `7be68dcfbcd9ed64b4f4ae98399276d01ede0034`: import incorrecto `backend.main`, corregido en el test sin alterar el producto. El primer cumulative [39555174858](https://github.com/c2melendez/precision-lab-plus/actions/runs/39555174858) fue FAIL de harness/colección, no fallo matemático; la nueva evidencia válida es la de `8885a3b`.
- Estado global de certificación permanece OPEN por bloqueos independientes registrados (SG28/DIST, S25, SY-P-23, SY-X-04 Plus HTTP y Algebra229-AS-B-29).

**Siguiente objetivo único: `TRIG-EV-D-06-TEST-FIRST` — READY.** Primero leer/verificar la fila EV-D-06 de la matriz congelada; después añadir pruebas test-first bilaterales según los canales contractuales (Lite parser ASCII+LaTeX; Plus HTTP ASCII), activar gates por push y no cambiar producto salvo que la prueba y la fuente demuestren un defecto. No asumir el resultado ni la expresión de EV-D-06 antes de leer la fila oficial.

---

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

# Registro de ejecución — índice vigente

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



## 2026-10-21 UTC — Cierre documental r208: gates D20 de r207 verificados

Los seis gates D20 del commit documental r207 terminaron `completed/success`; se verificó la igualdad exacta entre el SHA de cada run y el SHA documental del repositorio:
- Lite `cumulative`: [39551266478](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551266478) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.
- Lite `h1d`: [39551268683](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551268683) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.
- Lite `scientific-ui`: [39551270883](https://github.com/c2melendez/precision-lab-lite/actions/runs/39551270883) — SUCCESS; `head_sha=5b7a642dbfdb56cc932101116ca8f28afe4da871` exacto.

La expresión de EV-D-04 se normalizó en documentación a `\csc(\frac{\pi}{6}) → 2`, corrigiendo el exceso de barras y las llaves duplicadas. Esto es una corrección documental únicamente; EV-D-04 permanece `READY`, no iniciado. Global `OPEN`.

---

## 2026-10-21 UTC — Gates D20 de r206 registrados (continuity r207)

Gates documentales de r206 (`workflow_dispatch` sobre `de987a4`, `head_sha` exacto, todos SUCCESS):
- Lite `de987a4`: cumulative [39549979912](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549979912), h1d [39549982104](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549982104), scientific-ui [39549984347](https://github.com/c2melendez/precision-lab-lite/actions/runs/39549984347).

Gates documentales de r207 (commit de este cierre): se disparan con `workflow_dispatch` sobre el SHA documental (D20); sus resultados se registran en r208.

Siguiente sin cambios: EV-D-04 `\\csc(\\frac{{\\pi}}{{6}}) → 2`, `READY`; no iniciado. Global OPEN.

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

## 2026-10-21 UTC — EV-D-01 PASS_SCOPED bilateral (continuity r204)

**Trigonometría EV-D-01** — sin(pi/6)=1/2.

- Lite `13bdc7c` (solo tests): cumulative [39545169322](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169322), h1d [39545169419](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169419), scientific-ui [39545169496](https://github.com/c2melendez/precision-lab-lite/actions/runs/39545169496) SUCCESS.
- Plus `4e625d1` (HTTP ASCII; LaTeX raw fuera de alcance): cumulative [39545579931](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579931), h1d [39545579919](https://github.com/c2melendez/precision-lab-plus/actions/runs/39545579919) SUCCESS.

Sin cambio de producto. Global OPEN. Siguiente: EV-D-02.

---

## 2026-10-21 UTC — AS-B-28 PASS_SCOPED bilateral (continuity r203)

**ALGEBRA229-AS-B-28** — factorizar el entero 4294967297 → `641*6700417` (fila N3). Sintaxis D25.

- Lite `2f869fa`: cumulative [39541626385](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626385), h1d [39541626256](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626256), scientific-ui [39541626315](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626315) SUCCESS (sin producto).
- Plus `ae70b7c`: cumulative [39542004229](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004229), h1d [39542004282](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004282), Native Syntax [39542004162](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004162) SUCCESS (regla acotada).

D20 r202: Lite `038703f` y Plus `a2a4968` SUCCESS.

Global OPEN. AS-B-29 ON_HOLD.
