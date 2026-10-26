## 2026-10-24 UTC — r286: handoff de remediación refinado

- `continuity.json` actualizado a `BLOCKED_ENVIRONMENT`: el análisis del árbol y la consulta de advisories terminó, pero el entorno no contiene checkout local ni npm para regenerar el lock de forma segura.
- Próximo paso para la siguiente sesión: usar un entorno npm con checkout; probar Vitest/mocker 5.0.3, fast-uri 3.1.9, serialize-javascript 7.1.3 y KaTeX 0.18.2; resolver Tailwind/parser por separado. Validar lock, audit, typecheck, tests, build y E2E antes de cualquier nueva Action.
- No se modificó `package-lock.json`; no se lanzaron Actions; CI sigue BLOCKED por 8 advisories; global OPEN; PR #48 sin merge.

---

## 2026-10-24 UTC — r286 addendum: versiones parcheadas contrastadas con advisories oficiales

- Candidatos mínimos documentados: Vitest/`@vitest/mocker` 5.0.3; `fast-uri` 3.1.9 (el aviso GHSA-w74x-v6f9-j3xg hace insuficiente 3.1.8); `serialize-javascript` 7.1.3; KaTeX 0.18.2.
- KaTeX 0.18.2 requiere ampliar el rango directo actualmente `^0.16.11` y validar renderizado. `postcss-selector-parser` está corregido en 7.1.6, pero sus consumidores del árbol Lite piden 6.x; no forzar override incompatible.
- Fuentes oficiales enlazadas en `LITE_NPM_AUDIT_TRIAGE_R286.md`. Ningún paquete ni lockfile se modificó; sin checkout/npm local, no se lanza CI. Hard gate continúa BLOCKED; global OPEN; PR #48 abierto.

---

## 2026-10-24 UTC — r286 addendum: dependencia exacta del hard gate

- Actualizada `continuity.json` a r286: commit `e68df94f83ed3eab1452d9807745a741f6d5d9c3`; siguiente acción es preparar una remediación reproducible, sin relanzar Actions idénticas.
- Inspección de lockfile v3: `fast-uri@3.1.8` llega por `ajv@8.20.0`; `serialize-javascript@7.1.0` por `@rollup/plugin-terser@1.0.0`; Vitest y `@vitest/mocker` están ambos en 5.0.1; Tailwind 3.4.19 requiere parser selector 6.x mediante sí mismo y `postcss-nested`.
- Añadida la cadena de dependencias al documento `LITE_NPM_AUDIT_TRIAGE_R286.md` (commit `457d189d361c6a824cc6b4c96de86d3b07bd29cb`). No se alteró `package-lock.json` ni se dispararon Actions: no existe checkout local con npm en el entorno actual.
- Estado: CI hard gate BLOCKED por 8 advisories (2 low, 6 moderate); global OPEN; PR #48 no mergeado. Próximo paso: remediación reproducible en entorno npm, validar antes de cualquier CI.

---

## 2026-10-24 UTC — r286: reconciliación H1c/E2E y bloqueo de auditoría

- SHA técnico: `14153e8bfd4f8557c24c7d195915b0a0907baa00`.
- H1c 40072711602, Playwright 40072711609, cumulative 40072711574, Algebra 229 integrity 40072711589, H1a/H1b/H1d, G3 parser/E2E, S22, S23, S25, Scientific UI y cross-browser: SUCCESS.
- CI 40072711615: FAILURE en `QA dependency audit (hard gate)`, 2 low + 6 moderate. No bajar umbral ni omitir auditoría.
- S19 de Plus usó Lite SHA antiguo `6cbec7645b73ad18875d4472182c704eb35228b0`; no valida diferencialmente el SHA `14153e8`.
- No repetir gates verdes sin cambios relevantes. Global OPEN; PR #48 no mergeado. Siguiente acción: remediar advisories con cambio mínimo y reevaluar auditoría antes de repetir CI.

## 2026-10-24 UTC — r285: EN-RE-12 corregido y gates exactos conciliados

- HEAD técnico: `5113fd28ee0ddf5233be930eb23c74772fcace97`; rama `qa/syntax-audit-in625-a1`; PR #48 no mergeado.
- La salida `\text{x < -2 o x > 2}` ahora se reconoce solo mediante el adaptador acotado `readRenderedInequalityUnion` y se valida como unión real de intervalos. No se relajó `preprocessLatex` para aceptar texto general.
- H1b [40069116272](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116272) SUCCESS: 8 passed; EN-RE-12 explícitamente passed. H1d [40069111537](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069111537) SUCCESS: 22 passed. Cumulative [40069111608](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069111608) SUCCESS: 360 archivos, 2232 passed, 8 expected fail y 34 TODO. G3 parser [40069116074] SUCCESS: 26 passed; syntax diagnostic [40069115987], Scientific UI [40069116227] y S25 [40069116120] también SUCCESS.
- Se registra el fallo intermedio: commit `1014abe9a185d760eb531b953b24ace9aa31e4ae`, CI [40069062729](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069062729) FAILURE por escape mal formado del adaptador; corregido en el HEAD actual `5113fd28`.
- CI [40069116121](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116121) FAILURE por el hard gate de dependencias: 6 moderate + 2 low, 0 high. No se redujo el umbral ni se alteró el gate.
- Playwright E2E [40069116223](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116223) seguía IN_PROGRESS al corte, mismo SHA. No relanzar; inspeccionar sus logs finales y resolver EN-RE-20/21 solo si fallan de nuevo con aserción concreta.
- Global OPEN. SECURITY-S25, SG28/DIST y capacidad EDCX mantienen estados bloqueados documentados. PR #48 no mergeado.

---

## 2026-10-24 UTC — r284: vite HIGH fuera de S25; EN-RE-12 sigue

- HEAD `935366887f1bb670690db90061b75d708f3f9dd8`.
- S25 [40049504130](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504130) SUCCESS (`--audit-level=high`).
- CI [40049504154](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504154) FAILURE: audit sin nivel, 6 moderate + 2 low, 0 high. Gate no se relaja.
- H1b [40049504150](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504150) FAILURE EN-RE-12 PARSE_ERROR al reinyectar `\text{x < -2 o x > 2}`. Producto.
- Playwright [40049504117](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504117) FAILURE: EN-RE-12 en tres viewports; EN-RE-20 mobile y EN-RE-21 tablet/mobile en REVIEW.
- Siguiente: causa de EN-RE-12 antes de otra corrida. Global OPEN. No merge de PR #48.

---

## 2026-10-23 UTC — r264: registro gates r263 — Lite success

- r264: gates r263 Lite en success: cumulative 40015124636, H1d 40015127464, scientific-ui 40015130309 sobre 61f438d2.
- Plus/Lite B4 mantienen la clasificación de r263; no se toca producto.
- Siguiente: EDCX-B5 READY, no iniciado.

---

## 2026-10-23 UTC — r266: EDCX-B5 brecha de capacidad (Lite)

- Filas VC-LG-01..25 con `canal` vacío. Lite NO_EJECUTADO; Plus BLOCKED por capacidad (espejo).
- Sin CI (solo documentación). Global OPEN.
- Siguiente: EDCX-B6 (53 filas, VC-FE), REVIEW por canal vacío.


## 2026-10-23 UTC — r263: EDCX B4 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `7f5f69be`); no se ejecutó B4.
- Plus `7e501f5` (test-first) y `177955d` (cierre docs): B4 medido en 34 filas -> 14 PASS / 14 PASS_SCOPED / 4 FAIL / 2 BLOCKED.
- Siguiente: EDCX-B5 READY, no iniciado.

---

## 2026-10-23 UTC — r262: EDCX B3 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó B3.
- Plus `ab220425`: cumulative [39945613218] SUCCESS — 2345 passed, 1 skipped,
  6 xfailed, cobertura 87.92%; H1d [39945613228] SUCCESS. Harness B3 22/22.
- B3: 19 filas -> 7 PASS exactos + 10 PASS_SCOPED / 2 BLOCKED. `evaluate`
  resuelve potencias enteras y negativas exactas; `sqrt`/`root` devuelven solo
  la raíz principal; `/solve` sobre `z^n=w` enumera todas las raíces.
- PASS_SCOPED: `VC-PR-07..16` por la ruta `/solve` (`z^4=-4 -> ±1±i`,
  `z^3=8 -> 2, -1±i√3`, `z^6=1` en seis radicales cartesianos).
- BLOCKED: `VC-PR-17` (sin nodo de sumatoria) y `VC-PR-18` (sin producto de
  raíces).
- Hallazgos: `sqrt(i)` -> `sqrt(I)` sin simplificar; `(-8)^(1/3)` ->
  `2*(-1)**(1/3)`, no `-2`.
- Acumulado EDCX (A + B1 + B2 + B3): 319 / 638 filas, 188 PASS / 131 BLOCKED.
- Siguiente: EDCX Parte B, bloque B4 (ecuaciones en C, 34 filas).

---

## 2026-10-23 UTC — r261: EDCX B2 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó B2.
- Plus `7c87b95f`: cumulative [39943293295] SUCCESS — 2323 passed, 1 skipped,
  6 xfailed, cobertura 87.96%; H1d [39943293116] SUCCESS. Harness B2 38/38.
- B2: 41 filas -> 20 PASS exactos + 13 PASS_SCOPED / 8 BLOCKED. La forma
  binómica se evalúa literalmente, incluida la multiplicación implícita; las
  nueve entradas `r_{theta}` devuelven `PARSE_ERROR`.
- PASS_SCOPED: `P-01..P-09` (traducción y salida binómica/raíz), `T-05` (Euler),
  `X-04` (potencia principal en forma de raíz), `X-08` y `X-09` (equivalentes
  exactos con parámetros reales).
- BLOCKED: `T-04/X-10` (potencia sin combinar), `T-06/T-07/T-08` (sin expansión
  de ángulo múltiple), `T-09` (sin sumatoria) y `X-11/X-12` (sin media ángulo ni
  serie geométrica).
- Hallazgo: `cos3theta` es un símbolo libre, no `cos(3*theta)`.
- Acumulado EDCX (A + B1 + B2): 300 / 638 filas, 171 PASS / 129 BLOCKED.
- Siguiente: EDCX Parte B, bloque B3 (potencias y raíces, 19 filas).

---

## 2026-10-23 UTC — r260: EDCX B1 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó B1.
- Plus `a53449db`: cumulative [39940618566] SUCCESS — 2285 passed, 1 skipped,
  6 xfailed, cobertura 87.94%; H1d [39940618559] SUCCESS. Harness B1 61/61.
- B1: 49 filas -> 45 PASS_SCOPED / 4 BLOCKED. Sin notación polar de entrada ni
  de salida; la conversión se certifica con `abs`+`arg` y oráculo sympy. Las 10
  filas P requieren la traducción `r_theta -> r*(cos+i*sin)`.
- BLOCKED: `B-17` (`arg(0)=0` sin aviso frente a `topolar(0)=DOMAIN_ERROR`) y
  `T-09/T-10/X-12` (formas semángulo simbólicas sin reducir).
- Acumulado EDCX (A + B1): 259 / 638 filas, 138 PASS / 121 BLOCKED.
- Siguiente: EDCX Parte B, bloque B2 (operaciones, 41 filas).

---

## 2026-10-23 UTC — r259: EDCX A8 y cierre Parte A (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó A8.
- Plus `c3d38972`: cumulative [39935820474] SUCCESS — 2224 passed, 1 skipped,
  6 xfailed, cobertura 87.94%; H1d [39935820754] SUCCESS. Harness A8 7/7.
- A8: 6 filas -> 0 PASS / 6 BLOCKED (no unicidad indistinguible, integral
  implícita sin ramas, intervalo máximo no aplicado, rama singular única y
  frontera incompatible rechazada por el límite de una condición inicial).
- Parte A completa en Plus (A1–A8): 210 / 638 filas, 93 PASS / 117 BLOCKED.
- Siguiente: EDCX Parte B, bloque B1 (conversión de formas, 49 filas).

---

## 2026-10-23 UTC — r258: EDCX A7 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó A7.
- Plus `795a97ef`: cumulative [39934588535] SUCCESS — 2217 passed, 1 skipped,
  6 xfailed, cobertura 87.90%; H1d [39934588487] SUCCESS. Harness A7 19/19.
- A7: 25 filas -> 2 PASS exactos (`ED-Q-23/24`) + 2 PASS_SCOPED (`ED-Q-05/06`:
  intervalo máximo solo por oráculo) + 21 BLOCKED (sin canal cualitativo,
  numérico, recurrencias ni retardo).
- Acumulado EDCX A1–A7 en Plus: 204 filas, 93 PASS / 111 BLOCKED.
- Siguiente: EDCX A8 (casos límite, 6 filas) en Plus.

---

## 2026-10-23 UTC — r257: EDCX A6 (Plus scoped; Lite sin ejecución)

- Lite `11d79a37`: sin cambios técnicos; espejo documental de r257.
- Plus `9a828f3c` (A6): cumulative [39932526897] y H1d [39932526943] SUCCESS;
  2198 passed, 1 skipped, 6 xfailed, cobertura 87.90%. Harness A6 30/30.
- A6: 1 PASS_SCOPED (`ED-P-25`, laplaciano compuesto con derivadas parciales
  reales y suma exacta 0) + 25 BLOCKED (sin motor de EDP).
- Lite **NO_EJECUTADO**: el motor ODE no cubre EDP, clasificación,
  características, Fourier ni núcleo del calor. Sin PASS/FAIL bilateral.
- Siguiente: EDCX A7 (cualitativo/numérico/retardo, 25 filas) en Plus.

---

## 2026-10-23 UTC — r256: EDCX A5 (Plus scoped; Lite sin ejecución)

- Lite `2fc34002`: sin cambios técnicos; espejo documental de r256.
- Plus `50d9ca03` (A5): cumulative [39929466812] y H1d [39929467052] SUCCESS;
  2168 passed, 1 skipped, 6 xfailed, cobertura 87.85%. Harness A5 11/11.
- A5: 5 PASS exactos + 3 PASS_SCOPED + 2 BLOCKED.
- Lite **NO_EJECUTADO**: el motor ODE no cubre series, Frobenius ni clasificación
  de puntos singulares. Sin PASS/FAIL bilateral.
- Siguiente: EDCX A6 (EDP, 26 filas) en Plus.

---

## 2026-10-23 UTC — r255: EDCX A3+A4 (Plus scoped; Lite sin ejecución)

- Lite `36319b4a`: sin cambios técnicos; espejo documental de r255.
- Plus `6aef2571` (A3): cumulative [39926515965] y H1d [39926515979] SUCCESS;
  2130 passed, 1 skipped, 6 xfailed, cobertura 87.92%. Harness A3 17/17.
- Plus `02e198ac` (A4): cumulative [39927284848] y H1d [39927284862] SUCCESS;
  2157 passed, 1 skipped, 6 xfailed, cobertura 87.85%. Harness A4 27/27.
- A3: 3 PASS_SCOPED + 13 BLOCKED; A4: 1 PASS + 23 BLOCKED.
- Lite **NO_EJECUTADO**: el motor ODE no cubre sistemas, `expm`, Laplace,
  integrales ni series. Sin PASS/FAIL bilateral.
- Defecto confirmado en Plus: la segunda condición inicial con `;` no está
  implementada (`PARSE_ERROR` medido); no se corrige en r255.
- Siguiente: EDCX A5 (series / Frobenius, 10 filas) en Plus.

---

## 2026-10-23 UTC — r254: EDCX A1+A2 PASS_SCOPED (Plus); Lite sin ejecución

- Lite `40b000b8` (MV-J): cumulative [39914455096] SUCCESS — catálogo MV cerrado.
- EDCX A1 (53) + A2 (50) en Plus `fdcf2d63`: 76 PASS / 27 BLOCKED; cumulative
  [39924322798] SUCCESS (backend 2113 passed, cobertura 87.92%) y H1d
  [39924322809] SUCCESS.
- Regresión `86241e40` (`mp.pool.Pool` sin importar el submódulo) corregida en
  `5a76477a`; los runs fallidos no se usan como evidencia.
- Lite: A1/A2 NO_EJECUTADO (gap de alcance de `stepEngine/ode.ts`). Sin PASS ni
  FAIL bilateral.
- Siguiente: EDCX A3 (16 filas) en Plus.

---

## 2026-10-23 UTC — r246: cierre formal MV-D-01..17 PASS_SCOPED_BILATERAL

- Producto Lite ya verificado en `c28091c` (cumulative/h1d/scientific-ui SUCCESS).
- Campaña Plus S25/S19 CLEAR (39890525978, 39899659414).
- Cierre documental bilateral; siguiente objetivo MV-E.

## 2026-10-24 UTC — r287: npm audit remediado y verificado en CI

- SHA técnico `1cf29a7192c803afc461e10fb4912f9bc88cec4e`. Se actualizaron `vitest`/`@vitest/mocker` a 5.0.3, `fast-uri` a 3.1.9, `serialize-javascript` a 7.1.4 y `katex` a 0.18.2; `package-lock.json` regenerado con npm (lockfile v3) y validado con `npm ci`.
- `postcss-selector-parser` se resolvió con override a 7.1.7 porque Tailwind 3.4.19 no admite el rango 7.x. La compatibilidad se demostró, no se asumió: el CSS de producción es byte a byte idéntico antes y después (`index-BcOzQwa2.css`, 59,816 bytes, SHA-256 `E9D13FB752B976D46FF6CE78F2D81FCDF4D71A93ACF20B1EB67BD14F38B43436`), con typecheck, suite completa y build correctos.
- **Hard gate CLEARED**: `npm audit --package-lock-only` devuelve 0 vulnerabilidades (antes: 2 low, 6 moderate). No se rebajó el gate ni se añadió excepción. Detalle en `LITE_NPM_AUDIT_REMEDIATION_R287.md`.
- Evidencia en GitHub: CI [40138503619](https://github.com/c2melendez/precision-lab-lite/actions/runs/40138503619) **SUCCESS** con `found 0 vulnerabilities`, 360 archivos / 2,232 passed / 8 expected fail / 34 TODO y build 5.71 s; cumulative [40137719189](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719189), H1d [40137719188](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719188), scientific [40137719203](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719203) y dependency gates [40137719274](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719274) SUCCESS.
- PR #48 está `OPEN`/`DRAFT` con `mergeable: false` (`dirty`), por lo que GitHub no dispara workflows de `pull_request` en los pushes nuevos. Para no declarar verde un gate no ejecutado, CI y Playwright se despacharon con `workflow_dispatch` sobre la rama; no se modificó ningún workflow ni filtro.
- Playwright [40138909348](https://github.com/c2melendez/precision-lab-lite/actions/runs/40138909348) **FAILURE**: 979 passed, 4 failed, todos en `e2e/in625-h1c-reentry.spec.ts` (EN-RE-21 en desktop/tablet/mobile y EN-RE-20 con timeout de 30 s en desktop esperando `math-field[read-only]`). En `a8d726f0` (run 40078650376, antes de la remediación) ya fallaba EN-RE-21 y EN-RE-20 pasaba en 2.2 s; no hay vínculo demostrado con los paquetes cambiados (build/test o no usados en runtime). No se tocaron specs ni oráculos.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24 UTC — r288: EN-RE-21/20 diagnosticados y canal H1c cerrado

- **EN-RE-21 no era un fallo de producto.** En la corrida de diagnóstico el campo MathLive ya contenía `5\cdot2` tras ANS → `\cdot` → `2`, pero el spec leía de inmediato el resultado anterior `5`; con 2 s de espera el mismo flujo devolvía `10`. Era una carrera entre el reemplazo del nodo de resultado y la lectura.
- **EN-RE-20 era un timeout de CI, no de producto.** Desktop local pasa en 5.1 s (7.1 s dentro del spec completo) y tablet/mobile ya pasaban en `1cf29a71`. El nodo `math-field[read-only]` se desmonta durante el re-render y Playwright aguardaba el elemento completo hasta agotar los 30 s.
- Corrección solo de arnés en `444df962` (`e2e/in625-h1c-reentry.spec.ts`): `readOutcomeAfterChange` exige un resultado distinto del anterior antes de afirmar, y la lectura del `math-field` queda acotada a 5 s con fallback al texto de estado accesible. No se modificaron producto, specs de contrato, oráculos, matrices ni gates.
- Evidencia local: spec H1c completo **18/18** en desktop/tablet/mobile (1.3 m) y EN-RE-20 desktop aislado en 5.1 s.
- Evidencia en GitHub sobre `444df962`: H1c [40143756120](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143756120) **SUCCESS**, 6 passed desktop (EN-RE-20 1.6 s, EN-RE-21 1.6 s); Playwright [40143758336](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143758336) **SUCCESS**, 983 passed y 1 skipped (11.6 m), con EN-RE-20/21 verdes en los tres viewports; cumulative [40143738485](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143738485) **SUCCESS**, 360 archivos / 2,232 passed / 8 expected fail / 34 TODO; H1d [40143738467](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143738467) **SUCCESS**, 22 passed.
- El bloqueo `LITE-PLAYWRIGHT-H1C-EN-RE-21` queda **RESUELTO y verificado** por runs exactos en HEAD; se retira de la lista de bloqueos activos y su evidencia queda en `h1c_harness_fix_r288`.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 OPEN; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24/25 UTC — r289: PR #48 diagnosticado; merge mecánico verificado sin publicar

- PR #48 sigue `OPEN`/`DRAFT`, `mergeable: false` (`dirty`), head `ea68e99a`, base declarada `7cbef02b`; `main` real está en `773f7b28`.
- `git merge-tree --write-tree FETCH_HEAD HEAD` (solo lectura) devuelve **un único conflicto en `package.json`**; `package-lock.json` se auto-fusiona. Causa: `main` avanzó dos commits (`vitest` 5.0.3 y `katex` 0.18.2) y su cola de `devDependencies` choca con el bloque `overrides` que añadió la rama; la rama ya contiene `vitest ^5.0.3` y `katex ^0.18.2`.
- `main` queda además internamente inconsistente: `package.json` declara `katex ^0.16.11`, la raíz del lock declara `^0.18.2` y el paquete instalado es `0.16.47`. La rama es consistente (`^0.18.2` / `^0.18.2` / `0.18.2`).
- Experimento local en un worktree desechable: merge de `773f7b28` conservando `package.json` y `package-lock.json` de la rama → **árbol byte a byte idéntico a `ea68e99a`** (`git diff --stat ea68e99a` vacío). El commit de merge local es `773bcba9` y **no se publicó**.
- Motivo para no publicarlo: el merge no cambia contenido frente a su primer padre; al volverse `mergeable` el PR, GitHub volvería a despachar los workflows de PR ya verdes y el clasificador de alcance evaluaría un delta vacío. La decisión queda explícita en `next_action`.
- Reconciliación de evidencia por SHA: `ea68e99a` es solo documentación y los workflows de push ignoran `**/*.md` y `continuity.json`, por lo que no generó runs; `444df962` aporta H1c, Playwright, cumulative y H1d verdes; `1cf29a71` aporta CI, cumulative, H1d, scientific y dependency gates verdes. El único delta hasta `444df962` es un spec E2E, que no entra en `tsconfig.app.json` (`include: src`) ni en la suite unitaria, así que esos verdes siguen aplicando a la fuente sin cambios.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 OPEN; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24/25 UTC — r290: decisión sobre PR #48 (mantener draft)

- Decisión registrada: PR #48 permanece **OPEN/DRAFT** y **no se publica** el merge de topología contra `main`. El conflicto es solo textual en `package.json` y la resolución local no cambia contenido (árbol idéntico a `ea68e99a`), pero publicarlo haría mergeable el PR y volvería a despachar workflows de PR ya verdes sin evidencia nueva.
- La integración se reconsiderará cuando cierren los bloqueos de certificación (SECURITY-S25, ALGEBRA229-AS-B-29, H2-SG28-DIST-01..08, EDCX-B5, SY-X-04-PLUS-HTTP) o exista autorización explícita.
- Evidencia de gates vigente: `444df962` (H1c, Playwright, cumulative, H1d verdes) y `1cf29a71` (CI, cumulative, H1d, scientific y dependency gates verdes). No hay cambios de fuente desde `1cf29a71`; el único delta es el arnés E2E, fuera de `tsconfig.app.json` y de la suite unitaria. No se repiten esos gates.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 OPEN; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-25 UTC — r291: triage local cerrado; los bloqueos restantes son bilaterales o de capacidad

- **Estado del repositorio:** HEAD `4cee0e76` en `qa/syntax-audit-in625-a1`, árbol limpio. No hay cambios de fuente, fixtures, workflows, dependencias ni contrato desde `1cf29a71` (gates verdes) y `ea68e99a`/`444df962` (H1c, Playwright, cumulative y H1d verdes). PR #48 sigue **OPEN/DRAFT** con `mergeable: false`.
- **Triage de bloqueos:** no queda ningún bloqueo de certificación accionable solo en Lite.
  - **SECURITY-S25**: el canal de remediación de Lite quedó cerrado en r287 (`LITE_NPM_AUDIT_REMEDIATION_R287.md`); lo que resta es evidencia del gate de seguridad compartido, que se reconcilia desde Plus.
  - **ALGEBRA229-AS-B-29**: ON_HOLD por decisión de contrato; no es PASS ni FAIL y no se desbloquea ejecutando pruebas de Lite.
  - **H2-SG28-DIST-01..08**: requiere la topología distribuida y la evidencia de Plus; Lite no tiene canal equivalente.
  - **EDCX-B5**: VC-LG-01..25 carece de canal y endpoint de producto en ambos repos; no se simula capacidad inexistente.
  - **SY-X-04-PLUS-HTTP**: es un canal HTTP de Plus; la evidencia de parser/UI de Lite no lo sustituye.
  - **SY-P-23**: sigue **OPEN** por convención no declarada (`a/bc`); no se certifica como PASS ni se cierra por pruebas numéricas de las lecturas explícitas.
- **Decisión registrada:** no se despachan runs nuevos ni se repiten H1c, Playwright, cumulative, H1d, CI, scientific ni dependency gates mientras no cambie un insumo técnico o exista una decisión explícita de contrato/alcance. El PR #48 permanece en draft y no se publica el merge de topología. La certificación global sigue **OPEN**.
- **Siguiente acción única:** reentrar cuando Plus produzca evidencia nueva de S19/seguridad o cuando se autorice una decisión de contrato para ALGEBRA229, SG28 distribuido, EDCX-B5 o SY-P-23; en ese momento se reevalúa el merge de PR #48 y se ejecuta solo el gate afectado.

## 2026-10-26 UTC — h1d: evidencia conservada en b8b77e5

- Decisión: se conserva la evidencia existente de `h1d` en `b8b77e5` (run `40271318616`, success, 22/22 tests). No se lanza gate nuevo.
- Motivo: entre `b8b77e5` y `88a2593` solo cambian archivos de `qa/certification/` (`SY_P_23_CONVENTION.md`, `continuity.json` y registros de runner). No hay cambios en `src/` ni en tests, así que el código certificado es idéntico.
- Nota técnica: `continuity.py` no reutiliza evidencia por SHA. La huella de `h1d` difiere entre `b8b77e5` (`3df6e85a…`) y `88a2593` (`63ff7cae…`), así que un gate sobre `88a2593` se decidiría como `RUN`. Esta decisión es documental.
- Este registro está en un archivo de solo prosa, así que no altera la huella de `h1d`.
- Estado: certificación global OPEN; bloqueos sin cambios.

## 2026-10-26 UTC — r294: runner v3 con publicación documental

- PR #52 (`ci/runner-v3-docs`) fusionado en `main`: merge `11806ba5b2dc05d8690d4300f3897e073859b76a`; workflow blob `23e42cf6dad30b281036cbbb63eff938c6646fde`.
- La operación `docs` aplica `git format-patch` con `git am --3way`, valida alcance documental y publica con compare-and-swap. La operación `gate` no cambia.
- Pruebas locales 27/27 y validación de YAML/shell. Esta revisión se publica con el propio mecanismo (`operation=docs`); no se lanzaron gates.
- Playwright de Plus reconciliado: runs 40155180977 (`9acc0bff`) y 40154343463 (`73be7940`) SUCCESS.
- Bloqueos sin cambios; siguiente acción en `continuity.json` r294.

## 2026-10-26 UTC — r295: IDs de publicación y audit canónico

- `operation=docs` publicó r294: run 40286599978 (dry-run 40286528777), base `c1627046`, commits `58bdbafe` + `66bd7ec7`.
- `npm audit --package-lock-only` en la rama canónica: 0 vulnerabilidades. El rojo de CI del PR #52 pertenece a `main`, no a la rama certificada.
- SECURITY-S25 sigue BLOCKED; no se cierra por audit local ni se reutiliza evidencia por SHA.

## 2026-10-26 UTC — r296: paridad con decisión S19 de Plus

- Registro documental de `2026-10-26-s19-focused-acceptance-v1` (Plus r309, `04962ba`). Sin impacto en gates ni evidencia de Lite; índice r296.

## 2026-10-26 UTC — r297: paridad SG28 un solo host

- Registro documental de `2026-10-26-sg28-single-host-scope-v1` (Plus r310). Sin impacto en gates de Lite; índice r297.


## 2026-10-26 UTC — r298: exclusión de registros generados del fingerprint; validación pendiente

- Corrección aplicada en `scripts/certification/continuity.py`: la huella ignora únicamente `qa/certification/runner/<id>.json` con ID numérico; el algoritmo pasa a versión 2.
- Pruebas de regresión: cambiar el contenido de un registro generado no invalida evidencia; añadir un archivo no numérico en `runner/` o modificar un contrato sí invalida la huella.
- Se actualizó `CONTINUITY.md` para eliminar el snapshot histórico r235 y documentar la excepción estricta y los marcadores de Actions.
- El siguiente paso es validar este commit mediante la corrida acumulativa activada por el cambio técnico y reconciliar `technical_baseline_sha` con evidencia exacta antes de volver a usar el planificador. No repetir otros gates verdes por rutina.
- Certificación global: OPEN. Bloqueos existentes: sin cambios.

## 2026-10-26 UTC — r299: el runner deja de suprimir workflows por el mensaje del commit

- Corrección adicional: el commit que registra una ejecución ya no lleva `[skip ci]`. `paths-ignore` evita bucles cuando el push contiene únicamente archivos `qa/certification/runner/`; no silencia el mismo push si también cambia un contrato.
- El runner v2 de esta rama conserva su operación gate; el runner v3 del branch predeterminado recibe la misma corrección para gate y docs.
- Las corridas iniciadas sobre el SHA previo no deben atribuirse al HEAD que contiene esta corrección. Esperar evidencia exacta del commit actual y reconciliar la baseline tras revisar las pruebas.
- Certificación global OPEN; bloqueos de producto sin cambio.

## 2026-10-26 UTC — r300: continuidad del runner validada en Lite

- HEAD técnico validado: `8c2cd395752959dbdc70cdf4e262d7bf8c597b82`.
- Cumulative [40359884483](https://github.com/c2melendez/precision-lab-lite/actions/runs/40359884483) SUCCESS exacto en este SHA; el job de regresiones de continuidad ejecutó 35 pruebas y terminó `OK`.
- H1d [40359884531](https://github.com/c2melendez/precision-lab-lite/actions/runs/40359884531) SUCCESS exacto en este SHA. Certification Runner push [40359884623](https://github.com/c2melendez/precision-lab-lite/actions/runs/40359884623) SUCCESS.
- Se fija `technical_baseline_sha` en el SHA probado. Esta publicación posterior solo actualiza CURRENT_STATE, EXECUTION_LOG y continuity.json; dichas rutas están excluidas de la huella, por lo que no se necesita otro gate.
- Resultado acotado: validada la corrección de continuidad en Lite, **no** significa certificación global ni desbloquea otros bloqueos. Global OPEN. Siguiente: esperar validación equivalente de Plus; no repetir gates de Lite.