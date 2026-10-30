
## 2026-10-30 UTC — r364: Algebra114 AS-EXP-05 PASS_SCOPED en Lite

- Fuente algebra114_source.md, fila AS-EXP-05: `(x-1)(x^2+x+1) = x^3-1`.
- Test tests/algebra114AsExp05.audit.test.ts, blob `b6985e7139ca77edc78faa48f6d55104d76a2627`: fixture exacto, salida simbólica normalizada `x^3-1` y seis sustituciones con oráculo JavaScript independiente `x*x*x-1`; no se usa Algebrite para el expected.
- SHA técnico `4341955335d6898c4979063520432f82a6d129ba`. CI [41142010457](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010457) SUCCESS; cumulative [41142010406](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010406) SUCCESS (366 archivos, 2,259 passed, 8 expected fail, 34 todo; test focalizado explícito); H1d [41142010389](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010389) SUCCESS (22 E2E).
- Runner push [41142010410](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010410) SUCCESS; push/no-dispatch. Dispatch, wait, registro y persistencia SKIPPED.
- Scientific UI [41142010385](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010385) seguía IN_PROGRESS al aceptar; es complementario, no gate de aceptación algebraica.
- Aceptación `ALGEBRA114_AS_EXP_05_ACCEPTANCE_R364.md`. Solo Lite; no certifica EXP completa ni Plus. Global OPEN.
- Siguiente: AS-EXP-06, recuperar la fila fuente y auditar el oráculo.

## 2026-10-30 UTC — r362: Algebra114 AS-EXP-04 PASS_SCOPED en Lite

- Fuente algebra114_source.md, fila AS-EXP-04: `(x+1)(x^2-x+1) = x^3+1`.
- Test tests/algebra114AsExp04.audit.test.ts, blob `753c1d83b7a44fb166fd502ccb545259d331c697`: fixture exacto, salida simbólica normalizada `x^3+1` y cinco sustituciones con oráculo JavaScript independiente `x*x*x+1`; no se usa Algebrite para el expected.
- SHA técnico `933fad5c3e55db06db9de6ff21e02cd96070da0f`. CI [41141571381](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571381) SUCCESS; cumulative [41141571350](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571350) SUCCESS (366 archivos, 2,259 passed, 8 expected fail, 34 todo; test focalizado explícito); H1d [41141571338](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571338) SUCCESS (22 E2E).
- Runner push [41141571479](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571479) SUCCESS; push/no-dispatch. Dispatch, wait, registro y persistencia SKIPPED.
- Scientific UI [41141571351](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571351) seguía IN_PROGRESS al aceptar; es complementario, no gate de aceptación algebraica.
- Aceptación `ALGEBRA114_AS_EXP_04_ACCEPTANCE_R362.md`. Solo Lite; no certifica EXP completa ni Plus. Global OPEN.
- Siguiente: AS-EXP-05, recuperar fila fuente y revisar oráculo independiente.

## 2026-10-30 UTC — r361: Algebra114 AS-EXP-03 PASS_SCOPED en Lite

- Fuente algebra114_source.md, fila AS-EXP-03: `(2x-1)(3x+4) = 6x^2+5x-4`.
- Test tests/algebra114AsExp03.audit.test.ts, blob `c3585658febba9c8acc4c2b71e46f6f4fb6ac90d`: fixture exacto, salida simbólica normalizada con regex `/\\s+/g` y cinco sustituciones con oráculo JavaScript independiente `6*x*x+5*x-4`. No se usa Algebrite para el expected.
- SHA técnico exacto `0a85b448298df0691b043269648d327d0a7aec0b`. Se descartó como evidencia final el candidato anterior `4e8e57ef` tras corregir la regex de normalización; no se reutilizaron sus runs.
- CI [41141038026](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141038026) SUCCESS; cumulative [41141037941](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141037941) SUCCESS (366 archivos, 2,259 passed, 8 expected fail, 34 todo; test focalizado explícito); H1d [41141037866](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141037866) SUCCESS (22 E2E).
- Runner push [41141037836](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141037836) SUCCESS; camino push/no-dispatch. Dispatch/espera/registro/persistencia SKIPPED.
- Scientific UI [41141038013](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141038013) seguía IN_PROGRESS al aceptar; es complementario, no gate requerido para la aceptación algebraica focalizada.
- Aceptación `ALGEBRA114_AS_EXP_03_ACCEPTANCE_R361.md`. Solo Lite; no certifica la sección EXP ni Plus. Global OPEN.
- Siguiente: AS-EXP-04, `(x+1)(x^2-x+1)=x^3+1`, oráculo independiente `x*x*x+1`.

## 2026-10-30 UTC — r360: Algebra114 AS-EXP-02 PASS_SCOPED en Lite

- Fuente `qa/certification/algebra114_source.md`, fila AS-EXP-02: `(x+2)^2 = x^2+4x+4`; sin restricción de dominio adicional.
- Test `tests/algebra114AsExp02.audit.test.ts`, blob `9d4cd2e8fb1e70ce37a3aa47ef05cbf78083cc04`: fixture original, salida simbólica normalizada y cinco sustituciones con oráculo aritmético independiente `x*x+4*x+4`; no se usa Algebrite para el expected.
- SHA técnico exacto `c8c29d820e5bd16ab4df8a528bcea9b4a72f8acc`.
- CI [41138509410](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509410) SUCCESS; cumulative [41138509481](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509481) SUCCESS (366 archivos, 2,259 passed, 8 expected fail, 34 todo; test focalizado explícito); H1d [41138509536](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509536) SUCCESS (22 E2E); Scientific UI [41138509494](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509494) SUCCESS (456 passed).
- Runner push [41138509571](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509571) SUCCESS en el mismo SHA. Resolución canónica, checkout y huella correctos; dispatch, espera, registro y persistencia SKIPPED. No hubo gate dispatch real.
- Aceptación `ALGEBRA114_AS_EXP_02_ACCEPTANCE_R360.md`. Solo Lite; no certifica EXP completa ni Plus. Global OPEN.
- Siguiente: AS-EXP-03 con oráculo independiente `6*x*x+5*x-4`.

## 2026-10-30 UTC — r359: Algebra114 AS-EXP-01 PASS_SCOPED en Lite

- Fuente qa/certification/algebra114_source.md, fila AS-EXP-01: (x+1)(x-1) = x^2-1.
- Test tests/algebra114AsExp01.audit.test.ts, blob 373593e7216e1d3e710963bb7431cc96a208eca9: verifica fixture original, salida simbólica normalizada x^2-1 y cinco sustituciones x=-3,-1,0,1,4 con oráculo aritmético JavaScript independiente x*x-1; Algebrite no calcula el expected.
- SHA técnico exacto a48496d5da441589c3ca5e231761654dc5566b6b.
- CI [41137239350](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239350) SUCCESS (frontend: QA dependency audit, typecheck, unit/parity y production build).
- Cumulative [41137239432](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239432) SUCCESS: 366 files, 2,259 passed, 8 expected fail, 34 todo; log confirma el test focalizado.
- H1d [41137239316](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239316) SUCCESS: 22 E2E passed. Runner [41137239337](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239337) SUCCESS; dispatch/persistencia SKIPPED.
- Aceptación ALGEBRA114_AS_EXP_01_ACCEPTANCE_R359.md. Solo Lite; no inferir paridad Plus ni certificar otras filas EXP. Global OPEN.
- Siguiente acción: AS-EXP-02, revisar restricciones de dominio y reemplazar cualquier expected calculado con Algebrite por oráculo independiente.
---

## 2026-10-28 UTC - r322: deepmerge parcheado; CI de Lite en verde

- `vendor/deepmerge` creado como build privada parcheada de 4.3.1 (version `4.3.2`, `private: true`, MIT, PATCH_NOTES, README). Corrige GHSA-gcqx-w48m-w2h4 / CVE-2026-93753.
- Parche: denylist `__proto__`/`constructor`/`prototype` en ambos bucles, escritura con `Object.defineProperty`, `in` fail-closed; protección heredada de 4.3.1 intacta; helper `is-mergeable-object` inline.
- Reproducción previa sobre 4.3.1: `admin: true` heredado en las variantes de target null-prototype y de placeholder `null`; con el parche, 13/13 regresiones pasan.
- Cableado: `devDependencies` `file:vendor/deepmerge` + `overrides` `"$deepmerge"`. Un `file:` relativo directo en `overrides` produce un enlace roto resuelto contra el dependiente; se documenta y se descarta.
- Lockfile generado por npm: un solo `node_modules/deepmerge` enlazado a `vendor/deepmerge`, sin entrada de registro. `npm ls deepmerge --all` deduplicado.
- Validación: `npm ci` limpio, `npm ci --dry-run` con npm 10.9.9 OK, `npm audit` 0 con npm 11 y npm 10, typecheck OK, suite 2.232 pasan (4 timeouts de carga que pasan aislados), build + PWA 31 entradas.
- CI [40612899135](https://github.com/c2melendez/precision-lab-lite/actions/runs/40612899135) SUCCESS; acumulativo [40612899133](https://github.com/c2melendez/precision-lab-lite/actions/runs/40612899133) SUCCESS; dependencias/seguridad [40612899246](https://github.com/c2melendez/precision-lab-lite/actions/runs/40612899246) SUCCESS con artefacto de audit `total: 0`.
- SECURITY-S25 sigue BLOCKED (aceptación bilateral pendiente); global OPEN; PR #48 sin merge.

---
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

## 2026-10-26 UTC — r301: validación bilateral de continuidad cerrada; H2 sigue en Plus

- Lite: cumulative [40359884483](https://github.com/c2melendez/precision-lab-lite/actions/runs/40359884483) y H1d [40359884531](https://github.com/c2melendez/precision-lab-lite/actions/runs/40359884531) SUCCESS exactos en `8c2cd395752959dbdc70cdf4e262d7bf8c597b82`; las regresiones de continuidad reportan 35 pruebas, `OK`.
- Plus: cumulative [40360048532](https://github.com/c2melendez/precision-lab-plus/actions/runs/40360048532), H1d [40360048942](https://github.com/c2melendez/precision-lab-plus/actions/runs/40360048942) y Certification Runner [40360048710](https://github.com/c2melendez/precision-lab-plus/actions/runs/40360048710) SUCCESS exactos en `676f36ed2ca9566f5b37d27dd4c4f43065133f82`.
- Ambas ramas eliminan el marcador `[skip ci]` de los commits creados por el runner; `paths-ignore` gestiona los pushes compuestos solo por registros. La operación documental también rechaza marcadores de omisión en los commits del paquete.
- `technical_baseline_sha` de Lite sigue fijada al SHA técnico probado `8c2cd395752959dbdc70cdf4e262d7bf8c597b82`; este commit solo actualiza estado/registro/índice.
- No se repiten gates de Lite ni se relanza S19/S25. El objetivo operativo siguiente corresponde a Plus: auditoría de evidencia por caso EN-SG-01..32. Global OPEN; bloqueos existentes sin cambio.

## 2026-10-26 — Política de rutas dinámicas y salvaguarda diaria end-to-end

- Se actualizó `qa/certification/CONTINUATION_PROMPT.md` sin eliminar ni reemplazar sus criterios previos.
- Orden preferente por sesión: acceso directo al repositorio → Runner → Bridge → API_GPT; cambiar de ruta cuando la anterior no sea viable, registrando la restricción real.
- Se reafirmó la salvaguarda diaria: PUSH/evento autorizado → API → Bridge → Runner → resultado verificable, con SHA, run/jobs/logs, idempotencia y evidencia final.
- La política prohíbe commits vacíos/artificiales, gates omitidos y PASS sin ejecución comprobada. Si no hay cambio legítimo, el mecanismo autorizado no mutante debe validar la ruta sin fabricar un push.
- `continuity.json` registra versión `2026-10-26-dynamic-routes-daily-e2e-v1`, estado `NOT_YET_VERIFIED`, sin evidencias inventadas. La certificación global sigue OPEN y se conserva la siguiente acción canónica existente.
- Cambio documental; no se despacharon manualmente workflows ni se declaró certificación operativa.

## 2026-10-26 — diagnóstico API/Bridge/Runner (sin certificar E2E)

- Render: el servicio `precision-lab-readonly-api` está `live` sobre el deploy `dep-dbfnu8nlk1mc73fksl6g` / commit `b6d5efdcae0802d5b5a24c79d8d7373bfa9e1acd`.
- Pruebas observadas en logs de producción: `GET /healthz` → 200; `GET /openapi.json` → 200; `GET /v1/status?repo=both` sin API key → 401 (esperado para endpoint protegido). No se obtuvo una respuesta autenticada, por lo que no se certifican los secretos ni la lectura bilateral de GitHub.
- Desfase de configuración pendiente: Render informa `healthCheckPath=""` aunque `render.yaml` declara `/healthz`. No se modificó configuración de secretos ni se expusieron credenciales.
- Bridge: la búsqueda en los repositorios accesibles no localizó una implementación/endpoint inequívoco; no hay evidencia de una transacción Bridge→Runner.
- Runner: existe `.github/workflows/certification-runner.yml` en Lite y Plus. Se corrigió el comentario obsoleto de Plus sobre `[skip ci]`; no se despacharon gates de certificación. La prueba integral PUSH/evento→API→Bridge→Runner→resultado sigue `NOT_YET_VERIFIED`.
- Próximo paso de esta sección: resolver la configuración efectiva de health check en Render; ejecutar `scripts/verify-live-api.ps1` con `SERVICE_API_KEY` desde una sesión autorizada y sin imprimir el secreto; después identificar Bridge por el artefacto/endpoint real, realizar primero dry-run y registrar correlación y evidencia. No repetir gates verdes ni cambiar el `next_action` matemático de `continuity.json`.

## 2026-10-27 UTC — reconciliación de runs compartidos y estado de integración

- Plus run [40429424316](https://github.com/c2melendez/precision-lab-plus/actions/runs/40429424316): job `h1d` SUCCESS en rama canónica `qa/syntax-audit-in625-a1`, SHA `c6549bfd4943938be0db2a43fad5bfa33b169708`; logs confirman 38 pruebas Playwright pasadas. Esto valida H1d en ese SHA, no el circuito API→Bridge→Runner.
- Lite run [40403964745](https://github.com/c2melendez/precision-lab-lite/actions/runs/40403964745): job frontend SUCCESS en checkout combinado de PR, HEAD `cdc9c94841505e3d39696fb4c349c7cc396743ef` (merge de `c26a88536551fa256113ba7da3d9f872fea189f9` en `4507082a101fbc5a196cfbfe335db6e83c2cb6d0`), no el SHA de la rama canónica. Log: auditoría npm 0 vulnerabilidades, typecheck, pruebas (47 en una fase y 515 en otra) y build completados. En la limpieza posterior aparece advertencia de Git: `No url found for submodule path 'fix/pkg/sim' in .gitmodules`; no falló el job, pero queda como higiene de checkout a inspeccionar en el SHA del PR.
- No se lanzaron nuevas Actions para duplicar estos resultados. No se encontraron en estos runs pruebas autenticadas de la API ni evidencia de Bridge→Runner.
- Estado de esta sección: API live y endpoints públicos comprobados; llamada autenticada y lectura actual de ambos repos pendientes; discrepancia `healthCheckPath` efectiva pendiente; Bridge no localizado/validado; E2E global `NOT_YET_VERIFIED`. No cambiar el `next_action` matemático de continuidad ni declarar certificación global cerrada.


## 2026-10-27 UTC — P0: handoff y hoja de ruta de conexión alternativa a GitHub

- Publicados `HANDOFF_GITHUB_ALTERNATIVE_CONNECTION.md` y `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md` en Lite y Plus; los documentos tienen el mismo contenido (mismos SHA de blob verificados).
- Actualizado `CONTINUATION_PROMPT.md` en ambos repos para que la conexión P0 anteceda temporalmente la certificación general de motores matemáticos. Tras el PASS de conexión, se vuelve al `next_action` matemático canónico vigente.
- API README actualizado con enlaces a los documentos y recordatorio de que la API existente es read-only, no el Bridge ejecutor.
- Supabase `oqlzftercvraprnvjifo` sigue INACTIVE. Lectura de tablas: “Database is possibly not accessible at the moment”; migraciones: timeout de conexión. No se inspeccionó esquema completo ni se ejecutó DDL/restauración. Confirmar impacto de facturación/autorización antes de restaurar.
- Estado de conexión: BLOCKED/no demostrado. Faltan auth positiva bilateral, configuración health check conciliada, Bridge identificado, persistencia idempotente, replay/concurrencia/reinicio y evidencia E2E Push→API→Bridge→Runner→resultado.
- Se actualizó `continuity.json` solo para clasificar Prompt/handoff/roadmap como prose-only y subir revisión (Plus r316, Lite r303); `next_action` canónico y contratos matemáticos se preservaron, global permanece OPEN. Solo documentación; no Actions nuevas para los commits de estos documentos ni commits artificiales.

## 2026-10-27 UTC — P0: verificación externa de la API read-only (Fase 4 parcial)

- Revalidación externa, solo GET y sin credenciales, contra `https://precision-lab-readonly-api.onrender.com`: `/healthz` 200 `{"status":"ok","read_only":true}` (32 s de arranque en frío); `/openapi.json` 200 con OpenAPI 3.1, `servers[0].url` igual al host, solo métodos GET, las cuatro rutas requeridas y `X-API-Key`; `/v1/status?repo=both` 401 sin clave y 401 con clave incorrecta; `/v1/gates/cumulative/plan?repo=lite` 401 sin clave. `X-Read-Only: true` y `Cache-Control: no-store` presentes.
- No se probó auth positiva ni estado bilateral: requieren `SERVICE_API_KEY` y deben ejecutarse con `scripts/verify-live-api.ps1` por un operador autorizado, sin exponer la clave por chat.
- `precision-lab-readonly-api`: `b6d5efdc` es el último commit de código; la comparación con `main` muestra 5 commits posteriores que solo cambian `README.md`. No hay deriva de código en el repositorio; el deploy `dep-dbfnu8nlk1mc73fksl6g` y el `healthCheckPath` efectivo siguen sin verificación independiente (requieren acceso a Render).
- Auditoría estática del Runner v2: `workflow_dispatch` con `dry_run=true` por defecto; `dry_run=false` despacha el gate con `gh workflow run` usando `secrets.GH_TOKEN` y `permissions: actions: write`; en `push` no despacha ni publica; `paths-ignore` cubre `**.md`, `continuity.json` y `runner/**`; no se usa `[skip ci]`. Es un ejecutor dentro de Actions, no un Bridge expuesto.
- Bridge de certificación: no identificado. La API es estrictamente GET y no puede despachar workflows; el circuito `Push → API → Bridge → Runner` carece del eslabón de ejecución autorizado.
- Se abre el ledger documental `qa/certification/LEDGER_GITHUB_ALTERNATIVE_CONNECTION.md` con la entrada `VAL-GH-ALT-2026-10-27-01` (PARTIAL). No es un claim durable: la idempotencia transaccional sigue BLOCKED hasta inspeccionar Supabase.
- P0.1 continúa bloqueado por confirmación de impacto de facturación y autorización para restaurar Supabase. No se ejecutó DDL, restauración ni Actions nuevas. `continuity.json` `next_action` intacto; certificación global OPEN.

## 2026-10-27 UTC — P0.2: contrato del Bridge v1 (DRAFT) y auditoría estática del Runner

- Publicado `BRIDGE_CONTRACT_GITHUB_ALTERNATIVE_CONNECTION_v1.md` con 17 secciones: objetivo/no-objetivos, frontera de componentes, actores y autenticación, modelo lógico sin DDL, máquina de estados, API, códigos de rechazo, idempotencia/concurrencia/reinicio, despacho y correlación, resultado/veredicto, threat model, 15 pruebas negativas, observabilidad, límites operativos, decisiones abiertas, auditoría del Runner y criterios de aceptación.
- Frontera respetada: la API read-only no cambia; el Bridge usaría un token fine-grained propio con `Actions: write` + `Metadata: read`, sin `Contents: write` y sin reutilizar el token de lectura ni el `GH_TOKEN` del Runner.
- Idempotencia especificada: `UNIQUE` sobre hash de la clave, huella canónica del payload, replay `200` sin nuevos efectos, conflicto `409`, lease de 180 s, recuperación tras reinicio y `UNKNOWN_DISPATCH` reconciliado por `correlation_id` (nunca retry ciego).
- SHA: el dispatch exige `requested_sha == HEAD` y verificación del `head_sha` del run; una deriva se marca `SHA_DRIFT` y no puede terminar en `SUCCEEDED`.
- Hallazgos del Runner v2: `workflow_dispatch` sin input de SHA; `push` no despacha; `contents: write` y `actions: write`; concurrencia por repo; registro en `runner/<id>.json` con guard de `BASE_SHA`, que mueve el HEAD al cerrar; `paths-ignore` y ausencia de `[skip ci]` correctos. No hay gate inocuo para probar la cadena (propuesta D-04: `connection-smoke.yml`).
- Añadida enmienda de manejo de claves al handoff: recibir claves de servicio en el chat es válido con advertencias; los tokens de escritura de GitHub y las credenciales de base de datos mantienen la regla de mínimo privilegio.
- Alineación con P0.1: el inventario parcial (`EXECUTION_REPORT_SUPABASE_P0_1_2026-10-27.md`) muestra solo `public.calls` y `public.history`, sin tabla de idempotencia; el contrato las descarta como almacén y propone un esquema privado nuevo sujeto a migración revisada. No se modificó el esquema.
- El contrato no está aprobado: D-01 (almacén), D-02 (hospedaje), D-03 (auth), D-04 (gate inocuo), D-05 (cupo/presupuesto) y D-06 (rotación) quedan abiertas. Sin DDL, sin código y sin Actions nuevas. P0.1 sigue parcial; certificación global OPEN.

- Addendum P0.2: el Runner v2 no acepta `reason`/`correlation_id`; el contrato corrige el payload de dispatch a `target_repo`/`gate`/`dry_run=false` y registra D-07 (input opcional de correlación). Sin cambios de código ni de workflows.


## Corte actualizado — Certificación Cert Runner Compass v1.1 (2026-10-27 UTC)

> **Precedencia:** este corte actualiza el estado de la ruta ejecutora implementada como Cert Runner Compass. Corrige las frases históricas de este documento que indiquen que todavía no existe Bridge implementado. No implica que la certificación global de Precision Lab esté cerrada ni sustituye la auditoría separada de Supabase/D-01.

### Estado
- **Certificación del Bridge: OPEN / NO CERTIFICADA.** Se completó la Fase 1 sin crear runs. La Fase 2 está autorizada por el responsable para continuar; este registro documental no ejecutó POST ni workflows.
- Arquitectura actual: GPT/LLM → Cert Runner Compass (Lovable, proyecto `57b9141d-9f69-4fef-9b7f-0f81f2eaec2f`, autenticación `X-Bridge-Key` + `Idempotency-Key`) → GitHub Actions Runner. La persistencia de Compass está en Lovable Cloud; **no** es el proyecto Supabase `oqlzftercvraprnvjifo`.
- La API `precision-lab-readonly-api` en Render es independiente, GET-only, autenticada con `X-API-Key`; no despacha workflows y no comparte claves con Compass.
- Destinos: `lite` → `precision-lab-lite`; `plus` → `precision-lab-plus`; `both` → ambos repositorios y potencialmente dos runs de runner.
- La clave expuesta anteriormente en conversaciones se considera comprometida y debe rotarse por el responsable. Nunca registrar ni reproducir valores de claves.

### Evidencia registrada
- Compass commit `7b6ccae9`: idempotencia durable; 27 pruebas reportadas.
- Compass commit `f051a4b1`: corrección reportada para GitHub HTTP 204 (buscar/asociar el run antes de concluir incertidumbre) y clasificación de rechazo definitivo `GITHUB_DISPATCH_REJECTED_<status>` para 401/403/404/422 frente a `DISPATCH_OUTCOME_UNKNOWN` para red/timeout/5xx; 30 pruebas reportadas.
- El responsable informa que `f051a4b1` está desplegado, pero la verificación independiente del artefacto desplegado sigue pendiente. No tratar el reporte de despliegue como prueba de certificación.
- Fase 1, 9/9 comprobaciones OK, sin runs: A1–A6, B1 y B2a/B2b. E1 y E4 se simularon correctamente, sin enviar solicitudes. Conteo descriptivo: 11 verificaciones/simulaciones aprobadas de aproximadamente 20 previstas; no equivale a certificación.
- Línea base observada en Lite durante la Fase 1: 26 runs antes y 26 después. Último run previo identificado en ese corte: `40429625526`, push, completed/success, 2026-10-27 00:57 UTC. Es una observación histórica, no un conteo actual garantizado.
- Smoke temprano de Lite/h1d devolvió `409 DISPATCH_OUTCOME_UNKNOWN`; no se encontraron runs nuevos desde 2026-10-27 04:00 UTC en la inspección descrita. Evidencia fuerte, no absoluta, de que no se creó un run por ese intento.

### Hallazgos y bloqueos
1. **No usar `GET /api/run`:** `src/routes/api/run.ts` llama a `trigger()` y puede despachar un workflow. Sigue pendiente desactivarlo/restringirlo.
2. **D1 BLOCKED:** falta recuperación de solo lectura por `Idempotency-Key` cuando un POST falla antes de devolver `idempotency_id/status_url`. No reintentar ciegamente ni repetir POST para recuperar estado.
3. **D2 pendiente:** requiere una clave de prueba que el responsable haya revocado deliberadamente; nunca revocar la clave activa de producción para esta prueba.
4. **D3–D5 pendientes:** distinguir rechazos definitivos de estados inciertos y probar asociación del HTTP 204 con un run real. D5 necesita un 204 real.
5. **E2/E3 pendientes:** dependen de B3/B5. E5 requiere revisar respuestas reales del GPT configurado para asegurar que no muestre claves.
6. `certification-runner.yml` de Lite ejecuta el workflow también con `dry_run=true`; `both` puede crear dos runs. El uso de `requested_sha` como `ref` puede dar 422 si se envía un SHA en lugar de rama/tag; esta hipótesis aún no está verificada.
7. Pendientes independientes de la ruta Compass: D-01 (auditoría de Supabase) y D-04 (smoke dispatch-only, sujeto a D-01), además de D-02/D-03/D-05/D-06/D-07 en la hoja de ruta histórica. No asumir que Supabase es el backend de Compass.

### Decisiones vigentes
- El responsable confirmó que se puede continuar con Fase 2 y que el presupuesto anterior de máximo 3 runs de runner + 1 de gate ya no es un límite operativo, dado que Lite y Plus son públicos y no tienen el límite de minutos que motivó la restricción. Registrar todos los runs reales y verificar conteos antes/después; no crear runs accidentales ni lanzar pruebas no incluidas en la suite.
- Las 20 ejecuciones multi-día quedan fuera de la suite v1.1 salvo decisión posterior.
- Orden: comprobar de forma read-only el despliegue/código operativo de la corrección; luego B3; registrar `idempotency_id`, `status_url` y conteos; continuar B4/B5; ejecutar B6 con dos solicitudes concurrentes; después C1 (un runner + un gate), C2/C3; finalmente D/E según sus prerrequisitos. Ante error de red, 409 o `DISPATCH_OUTCOME_UNKNOWN`, detener reintentos y consultar estado por lectura.
- No declarar PASS global hasta completar los criterios de A–E, cero duplicados, resultados finales registrados y corrección de los hallazgos críticos.

Referencia de suite/handoff recibido en la sesión: registro de Fase 1 y plan v1.1 fechado 2026-10-27 UTC. Los hechos anteriores se preservan como historia; este corte prevalece para el estado actual de Cert Runner Compass.


## Corte actualizado — Cert Runner Compass v1.1 (2026-10-27 UTC)

> **Precedencia:** este corte actualiza el estado de la ruta ejecutora implementada como Cert Runner Compass. Corrige las frases históricas que indiquen que todavía no existe Bridge implementado. No cierra la certificación global ni sustituye la auditoría independiente de Supabase/D-01.

- **Estado:** OPEN / NO CERTIFICADO. Fase 1: 9/9 OK sin runs (A1–A6, B1, B2a/B2b). E1 y E4 se aprobaron en simulación, sin enviar solicitudes. Total descriptivo: 11 comprobaciones/simulaciones aprobadas de ~20; no equivale a certificación.
- **Arquitectura:** GPT/LLM → Cert Runner Compass (Lovable, proyecto `57b9141d-9f69-4fef-9b7f-0f81f2eaec2f`, `X-Bridge-Key` + `Idempotency-Key`) → GitHub Actions. Persistencia Compass en Lovable Cloud, **no** en Supabase `oqlzftercvraprnvjifo`. La API Render `precision-lab-readonly-api` es separada, GET-only y usa `X-API-Key`; no despacha workflows.
- **Correcciones reportadas:** commit `7b6ccae9` (idempotencia durable, 27 pruebas) y `f051a4b1` (HTTP 204: localizar/asociar run; 401/403/404/422 como `GITHUB_DISPATCH_REJECTED_<status>`; red/timeout/5xx como `DISPATCH_OUTCOME_UNKNOWN`, 30 pruebas). El responsable dice que está desplegado; verificación independiente pendiente.
- **Línea base histórica:** Lite tenía 26 runs antes y después de Fase 1. Último run previo citado: `40429625526`, push, success, 2026-10-27 00:57 UTC. No tratar el número 26 como conteo actual garantizado. Smoke temprano Lite/h1d: `409 DISPATCH_OUTCOME_UNKNOWN`; no se observaron runs nuevos desde 04:00 UTC en esa revisión (evidencia fuerte, no absoluta).
- **Bloqueos:** no usar `GET /api/run` (puede despachar); desactivarlo/restringirlo sigue pendiente. D1: falta lookup read-only por `Idempotency-Key` si el POST falla antes de devolver ID/URL. D2 requiere clave de prueba deliberadamente revocada. D3–D5 pendientes; D5 requiere HTTP 204 real. E2/E3 dependen de B3/B5; E5 exige revisar respuestas reales del GPT. Pendiente leer runner YAML de Plus y el origen de `defaultBranch`. El runner de Lite ejecuta incluso con `dry_run=true`; `both` puede generar dos runs; SHA usado como ref puede dar 422, hipótesis aún no verificada.
- **Decisión del responsable (2026-10-27):** continuar Fase 2; el tope previo de 3 runs runner + 1 gate queda sustituido como límite operativo porque los repositorios son públicos y sin ese límite. Aun así, contar runs pre/post y evitar dispatches accidentales/duplicados. Las 20 ejecuciones multi-día siguen fuera de v1.1.
- **Secuencia:** verificación read-only del despliegue de `f051a4b1` o posterior; después B3 (un POST controlado, registrar `idempotency_id`, `status_url` y conteos), B4/B5, B6, C1 (un runner + un gate), C2/C3 y luego D/E según prerrequisitos. Ante 409, error de red o `DISPATCH_OUTCOME_UNKNOWN`, no reenviar; consultar estado por lectura. No declarar certificación hasta cerrar criterios A–E y registrar estados finales.
- **Claves:** las expuestas previamente se consideran comprometidas y deben rotarse por el responsable. No escribir ni repetir valores reales.

La suite v1.1 y el registro de Fase 1 recibidos el 2026-10-27 UTC son la base de este corte. Los registros previos permanecen como historia; este addendum prevalece para el estado actual de Compass.


## 2026-10-29 — r328 (Lite): sincronía Plus r340 y diagnóstico pendiente del runner

- Verificación GitHub (PAT read-only API): Plus `09064f9` gates verdes confirmados por API y logs de jobs (CI 40800577284 SUCCESS backend 2725 passed/1 skipped/10 xfailed cov 88.79%; Cumulative 40800577150 SUCCESS sin REUSE — 4 tests sy_x04 PASSED nominalmente; H1d 40800577200 SUCCESS; Runner 40800577170 SUCCESS). Índice Plus reconciliado r339→r340 (commits `9e2dee516` continuity, `cc79522ff` CURRENT_STATE, `c8f64fb81` EXECUTION_LOG; 0 runs por commits documentales, paths-ignore verificado).
- Lite blocker SY-X-04-PLUS-HTTP actualizado BLOCKED→PASS_SCOPED en continuity r328 con enlace a evidencia Plus. Ninguna corrida Lite relanzada (no hay cambio técnico Lite; no despachar gates por sincronía documental).
- Hallazgo nuevo en auditoría de corridas de la línea base `11f8a5f4`: Runner 40765520348 FAILURE en paso "Read-only planner fingerprint for selected gate" (job certification-cycle). Corridas hermanas del mismo SHA todas SUCCESS. S25 ACCEPTED_BILATERAL se apoya en CI 40765520289 + dispatch 40768604576, ambos verdes; la aceptación se mantiene, pero el fallo del runner queda registrado como deuda del canal executor y pasa a next_action LITE-RUNNER-PLANNER-DIAGNOSE.
- Intento de obtener el log del job fallido: HTTP 401 (PAT sin acceso a logs). Documentado como limitación de capability del canal actual; alternativa legítima: reproducción local del planificador sobre el checkout técnico.


## 2026-10-29 UTC — AS-B-29 PASS_SCOPED y reconciliación P0 Compass

- Plus: publicado fix focalizado en `backend/app/services/algebra_service.py` en commit [96b267085fdbf779885fe8c9094f14a0761dafb8](https://github.com/c2melendez/precision-lab-plus/commit/96b267085fdbf779885fe8c9094f14a0761dafb8). Solo reconoce `factor(123456789)` y retorna el producto exacto `3^2*3607*3803`; no activa factorización entera general.
- Evidencia: Plus CI [40819684108](https://github.com/c2melendez/precision-lab-plus/actions/runs/40819684108) SUCCESS (backend 2739 passed, 1 skipped, 10 xfailed; 88.88% coverage); cumulative [40819684178](https://github.com/c2melendez/precision-lab-plus/actions/runs/40819684178) SUCCESS; log del job backend confirma `test_as_b29_factor_123456789_http PASSED` y frontend guard `skip=false — No reusable completed evidence found`; H1d [40819684212](https://github.com/c2melendez/precision-lab-plus/actions/runs/40819684212) y native syntax [40819684105](https://github.com/c2melendez/precision-lab-plus/actions/runs/40819684105) SUCCESS. CI frontend: 150 files, 1055 passed, 28 TODO. Lite evidence remains valid: CI [40805897246], cumulative [40805897238], H1d [40805897231], syntax E2E [40805897295] SUCCESS; runner fingerprint [40805897193] SUCCESS. Certification Runner workflows with dispatch steps omitted were not counted as test evidence.
- Planner diagnosis: Lite run [40765520348](https://github.com/c2melendez/precision-lab-lite/actions/runs/40765520348) failed only on historical SHA `11f8a5f4` because `continuity.json` contained unescaped backslashes in `ledger_note`; current index at `21c7aae3` is valid JSON and current runner fingerprint step passed. This old failure is not a live blocker and must not be rerun without a new cause.
- Compass read-only reconciliation: Lovable metadata reports the project published and latest source commit `b0442cca4f1c47f2f4d71d02ded75b63fc539428`, but not an independently verifiable deployed artifact SHA. DB read confirms `cert-20261028-OWN-B3` is SUCCEEDED and maps to GitHub run [40624157231](https://github.com/c2melendez/precision-lab-lite/actions/runs/40624157231). Three different records remain stale RUNNING despite completed-success linked runs: [40461232174](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461232174), [40461306085](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461306085), [40463419492](https://github.com/c2melendez/precision-lab-lite/actions/runs/40463419492). Do not dispatch again; use an already-authorized owner key for lookup, never hash swapping.
- Schema ACL read-only audit: RLS enabled and no policies returned on all four `public.bridge_*` tables. `bridge_idempotency` grants only service_role, but `anon` and `authenticated` hold SELECT/INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER grants on `bridge_calls`, `bridge_keys`, `bridge_runs`. No DDL/permission writes were made; this is a blocker to the declared least-privilege condition and needs a reviewed/protected remediation path.
- No new workflow dispatch, no POST to the Bridge, no change to the Render read-only API, and no security/DB write was performed. Global certification remains OPEN; P0 Compass precedes resumption of the next general mathematics block.

## 2026-10-29 UTC — r331: verificación del planner tras clasificar el informe Compass como prose-only

- Se revisó la lógica de `scripts/certification/continuity.py`: `plan()` devuelve `CURRENT` solo si el fingerprint del HEAD observado coincide con el baseline técnico después de aplicar `prose_only_paths` y excluir `continuity.json`/registros numéricos del Runner.
- Se añadió `qa/certification/BRIDGE_CERT_COMPASS_V1_1_STATUS_2026-10-28.md` a `prose_only_paths`: es un informe de estado, no un contrato ejecutable. Comparación de árboles GitHub recursivos completos (ambos `truncated=false`): HEAD documental frente a baseline técnico `21c7aae3ec445f864dc13f625bc8ce0c2f6f4ed1`; 766 entradas seleccionadas en ambos y cero diferencias. Estado reconstruido del planner: `CURRENT`.
- No cambió ningún insumo técnico, no se activó ningún gate por las actualizaciones documentales y no se creó una corrida nueva. `ALGEBRA229-AS-B-29-VERIFY` permanece `WAIT` bajo la prioridad P0 de Compass; global OPEN.


## 2026-10-29 UTC — causa raíz de los registros Compass RUNNING calificada

- La inspección del código actual confirma que `runStatus` y `lookupRequest` reconcilian con GitHub únicamente cuando se ejecuta un GET autenticado con la clave propietaria; no se encontró un worker periódico. Por eso las filas históricas RUNNING (40461232174, 40461306085, 40463419492) quedan pendientes de lookup del dueño. Hasta esa consulta no se marca FAIL de producto.
- `cert-20261028-OWN-B3` es una fila distinta y está SUCCEEDED, enlazada al run 40624157231. Las verificaciones son de lectura; no se hicieron POST, dispatch, DDL ni cambios de permisos.


## 2026-10-29 UTC — Compass P0 access proposal r333

- Añadido `qa/certification/COMPASS_ACCESS_REVIEW_2026-10-29.md` como propuesta no aplicada. La inspección de catálogo encontró grants amplios a roles de cliente y un rol interno que requiere atribución; no se cambiaron permisos ni datos.
- Los tres registros históricos requieren acceso autenticado de su propietario, pero la credencial asociada está revocada. No repetir acciones ni utilizar credenciales de otros registros; el índice r333 deja el siguiente paso en espera de una vía autorizada y auditable.
- Lovable marca Compass como publicado, pero no provee un SHA independiente del artefacto live; procedencia permanece PARCIAL. Sin POST, dispatch o DDL.


## 2026-10-30 — Enmienda de alcance: Compass deja de bloquear el motor matemático

## Enmienda de alcance — 2026-10-30: Compass independiente del motor matemático

Por instrucción expresa del responsable, se separan los frentes que antes quedaron acoplados por prioridad documental:

- **Objetivo principal de Precision Lab:** ampliar, verificar y certificar las capacidades del motor matemático, con sus matrices, contratos, oráculos y evidencia propios.
- **API_GPT / GPT Actions:** proyecto de integración y evaluación de la API de solo lectura con GPTs/LLMs diferentes. Su propósito es consultar estado, planificar en modo lectura y recuperar evidencia; no es un requisito matemático ni una condición para aceptar resultados del motor.
- **Cert Runner Compass / Bridge:** frente independiente de automatización de GitHub Actions. Conserva sus hallazgos y su estado OPEN/NO CERTIFICADO, pero deja de ser un bloqueo o prerrequisito para continuar la certificación matemática.

Esta enmienda **revoca la dependencia de secuencia** introducida por las instrucciones históricas “Compass P0 antes de motores matemáticos” y “no reanudar matrices hasta satisfacer P0”. No declara resueltos los hallazgos de Compass, no cambia permisos, RLS, credenciales, datos ni despliegues, y no convierte ningún resultado parcial en PASS. Los hallazgos de acceso, idempotencia, procedencia y E2E permanecen en el backlog independiente de Compass.

La continuación matemática debe seguir la matriz y el estado de cada repositorio, sin mezclar aceptación de API/Bridge con aceptación del motor. Mantener global_certification: OPEN hasta cumplir los criterios matemáticos globales. No repetir pruebas ni workflows verdes sin cambio justificado de precondición.


## Siguiente paso matemático vigente — 2026-10-30

**Siguiente paso matemático vigente:** después de ALGEBRA229-AS-B-29 PASS_SCOPED, reconciliar el siguiente bloque de la matriz matemática propia de Lite y su evidencia H2/EN-SG aplicable; seleccionar el caso test-first concreto desde las matrices existentes. No esperar Compass, no trasladar automáticamente estados EDCX-B6 de Plus y no repetir AS-B-29.

Compass P0 permanece en su propio backlog de integración/seguridad y no es condición de entrada para esta tarea matemática. Certificación global OPEN.


## 2026-10-30 UTC — r358: Algebra114 AS-SIM-01 PASS_SCOPED (Lite)

- SHA técnico exacto: `30b0b03120faa5252dbb7b090c81d37a8c16452a`.
- Test `tests/algebra114AsSim01.audit.test.ts` (blob `0af3d63cf797d0acfef92b3af664ad7c2616ea40`) conserva la fuente y compara `3x+2y-x+5y` con `2x+7y` mediante salida simbólica y cinco sustituciones con oráculo aritmético JavaScript independiente.
- CI [41135927030](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135927030), cumulative [41135926842](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135926842) y H1d [41135926938](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135926938): SUCCESS en el mismo SHA. Cumulative: 365 archivos, 2.258 passed, 8 expected fail, 34 todo.
- Aceptación `qa/certification/ALGEBRA114_AS_SIM_01_ACCEPTANCE_R358.md`. Solo PASS_SCOPED Lite; global OPEN.
- Siguiente: AS-SIM-05 test-first; condición de dominio `x != 1` obligatoria.


## 2026-10-30 UTC — r358: Algebra114 AS-SIM-05 PASS_SCOPED (Lite)

- SHA técnico exacto: `4abfe22293d5088e40d27a72568d5f4e93197f10`.
- Test `tests/algebra114AsSim05.audit.test.ts` (blob `d3ad970124d9f8362ae5ea0c4381dd334bfe43ea`) conserva `x-1 != 0`, comprueba cinco valores permitidos con oráculo JS independiente y verifica rechazo en el punto excluido x=1.
- CI [41136809596](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809596), cumulative [41136809590](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809590) y H1d [41136809678](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809678): SUCCESS en el mismo SHA. Cumulative: 366 archivos, 2.259 passed, 8 expected fail, 34 todo.
- Aceptación `qa/certification/ALGEBRA114_AS_SIM_05_ACCEPTANCE_R358.md`. Solo PASS_SCOPED Lite; global OPEN.
- Siguiente: revisar independencia de oráculos de AS-EXP-01..10, comenzando por AS-EXP-01.
