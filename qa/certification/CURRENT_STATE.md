# Actualización de certificación — 2026-11-09 UTC (r477; EC-D-02 IN_PROGRESS)

## Trigonometría TRIG-EC-D-02 — IN_PROGRESS; sin aceptación bilateral

- Contrato recuperado directamente de `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`: `2\cos x-1=0,quad xin[0,2pi)` → `x=\frac{pi}{3}, rac{5pi}{3}`. La fila original tiene tres columnas (ID, ejercicio, resultado esperado); no existe una columna de nota separada y no se inventa.
- Test focal: `tests/trigonometryEcD02.audit.test.ts`; ancla la fuente y verifica el conjunto exacto de raíces, intervalo y sustitución.
- Lite: último SHA `6ec2dc0abfd87ab0bb173911725b9dbe88a45520`. El intento ejecutado sobre `8639502ef468480581e7bc267fe1c59b6ce274af` aún devolvió `No se encontró una solución algebraica para "x"`; se amplió el reconocedor directo afín en `src/engine/stepEngine/trigonometricEquation.ts` para admitir ordenaciones del término trigonométrico y el término constante. Ese cambio **no está verificado**.
- En `6ec2dc0`, los runs [Cumulative 42671859688](https://github.com/c2melendez/precision-lab-lite/actions/runs/42671859688), [CI 42671859806](https://github.com/c2melendez/precision-lab-lite/actions/runs/42671859806), [H1d 42671859274](https://github.com/c2melendez/precision-lab-lite/actions/runs/42671859274), [Scientific UI 42671859357](https://github.com/c2melendez/precision-lab-lite/actions/runs/42671859357) y [Runner 42671859381](https://github.com/c2melendez/precision-lab-lite/actions/runs/42671859381) concluyeron FAILURE **sin jobs creados**; la consulta de jobs devuelve 0 y la de check-runs devuelve 0. No hay logs de pasos ni evidencia para atribuirlos al test o al motor. No relanzar a ciegas.
- Plus ejecutó y aprobó el caso (ver evidencia en la bitácora Plus); esto no sustituye la ejecución Lite.
- No se emite PASS_SCOPED ni acta de aceptación. El último baseline aceptado sigue siendo EC-D-01 PASS_SCOPED (r476); certificación global **OPEN**.

**Siguiente:** diagnosticar por qué GitHub Actions está finalizando los cinco workflows Lite sin crear jobs; después ejecutar/verificar el test focal en el SHA vigente. No repetir los gates verdes de Plus ni los gates de EC-D-01. No declarar bilateral PASS hasta tener evidencia Lite. Mantener separado EV-D-01 `/api/v1/evaluate` y EV-HI PASS_SCOPED.

---

# Actualización de certificación — 2026-11-09 UTC (r476)

## Trigonometría EC-D-01 — PASS_SCOPED bilateral (soluciones exactas en [0, 2π))

- Fila congelada: `sin(x)=1/2`, intervalo `[0,2π)`; raíces exactas esperadas `π/6` y `5π/6`. La prueba ancla el caso a la fila original de `ejercicios_trigonometria.md.gz`.
- Alcance: se verifican las dos raíces exactas, su pertenencia al intervalo y la sustitución en la ecuación. No se afirma certificación de la ingesta literal idéntica en ambos endpoints: Lite ejercita la forma normalizada `\sin(x)=\frac{1}{2}`; Plus ejercita `/api/v1/solve` con `sin(x)-1/2=0`.
- Lite SHA técnico `fab98e252e404c2564e69c8426e9d51e3b15af0d`; implementación acotada en `src/engine/stepEngine/trigonometricEquation.ts`, integrada en `src/engine/stepEngine/algebra.ts`. El resolvedor cubre ecuaciones directas `sin/cos/tan` sobre un período principal `[0,2π)`, valida simbólicamente cada raíz y no afirma que esas sean todas las soluciones sobre ℝ.
- Lite CI [42663515300](https://github.com/c2melendez/precision-lab-lite/actions/runs/42663515300) SUCCESS: 394 test files, 2,398 passed, 8 expected fail, 34 TODO; typecheck y dependency audit SUCCESS.
- Lite Cumulative [42663515427](https://github.com/c2melendez/precision-lab-lite/actions/runs/42663515427) SUCCESS: ejecutó `tests/trigonometryEcD01.audit.test.ts` (2/2 PASS), 394 test files, 2,398 passed, 8 expected fail, 34 TODO.
- Lite H1d [42663515370](https://github.com/c2melendez/precision-lab-lite/actions/runs/42663515370) SUCCESS (22 pruebas ejecutadas); Runner [42663515272](https://github.com/c2melendez/precision-lab-lite/actions/runs/42663515272) SUCCESS.
- Scientific UI [42663515384](https://github.com/c2melendez/precision-lab-lite/actions/runs/42663515384) seguía IN_PROGRESS en `Native desktop/tablet/mobile scientific result verification` al corte; complementario, no usado como oráculo del caso EC-D-01.

- Correcciones del harness Lite antes del SHA aceptado: escapes de la fila congelada, forma de entrada con argumento explícito, comparación como conjunto no ordenado y normalización correcta de salida `float(...)`. Los SHA candidatos previos con fallos de oráculo no son evidencia de aceptación.
- Resultado del caso: **PASS_SCOPED**, no cierre de la matriz de trigonometría ni de la certificación global. Plus mantiene EV-D-01 LaTeX BLOCKED en `/api/v1/evaluate`; EV-HI-01..12 sigue PASS_SCOPED. S25, SG28/H2 y DIST continúan abiertos.

**Siguiente:** EC-D-02. Recuperar su fila exacta desde el gzip congelado y fijar el contrato antes de escribir pruebas. Global **OPEN**.

---

# Actualización de certificación - 2026-11-09 UTC (r474)

## Trigonometría EV-HI-01..12 - PASS_SCOPED (corregido desde PASS bilateral)

- Motivo: la auditoría de alcance no sostiene un PASS bilateral completo. Las entradas se probaron en ASCII y no se certificaron los literales LaTeX de la matriz ni la forma exacta de los resultados.
- Evidencia que se mantiene: Lite `35e49984b1631415c3121a787bacfaf383c1df52` (Cumulative 42555320522, CI 42555320524, H1d 42555320578 SUCCESS).
- Límites y condiciones para volver a PASS: ver `TRIG_EV_HI_01_12_ACCEPTANCE_2026-11-09.md`, sección Alcance y límites.
- No es cierre global: S25, SG28, H2 y DIST siguen abiertos.

**Siguiente:** certificar en Lite y Plus los literales LaTeX y las formas exactas de EV-HI-01..12 antes de volver a PASS. EV-D-01 en Plus sigue BLOCKED por la ingesta LaTeX en `/evaluate`.

---

# Actualización de certificación - 2026-11-09 UTC (r472)

## Algebra229 AS-C-23 - PASS bilateral · Sección C 23/23 (cerrada)

- Contrato congelado: N2, `valor`, `p(2)` con `p(x)=x^{3}-3x+1` → `3`; nota «Evaluar un polinomio en un punto.». Fila de la matriz legacy comprimida (blob d216dc77cb1356ef29cb8c803cbff809450e0456; 229 filas).
- Lite SHA técnico 1d404ea1343ed21507d01969b5977fe76389a4d5: Cumulative 42550854839 SUCCESS (AS-C-23 4/4, 390 test files, 2,374 passed); CI 42550854770 SUCCESS (audit 0, typecheck, unit/parity, build); H1d 42550854778 SUCCESS (22/22); Scientific UI 42550854777 SUCCESS (456/456).
- Plus SHA técnico 4efac10f268319f95d8757f424f5a44d44e77772: Cumulative 42550854786 SUCCESS (AS-C-23 4/4; backend 2,912 passed, 1 skipped, 10 xfailed; frontend 1,055 passed); CI 42550854863 SUCCESS (backend 2,912 passed; frontend 150 test files passed); H1d 42550854740 SUCCESS (38/38).
- Los guards de Cumulative/H1d/Scientific registraron skip=false y evidence_run_id vacío en ambos proyectos donde aplica; evidencia realmente ejecutada, sin REUSE. Runner fue push summary con dispatch manual omitido.
- Implementación: sin cambios de motor. `p(2)=3` exacto en ambos al primer intento test-first; verificación adicional por forma canónica y oráculos de sustitución directa/Horner.
- Aceptación: ALGEBRA229_AS_C_23_ACCEPTANCE_2026-11-08.md. Sección C: 23/23 PASS bilateral. Matriz Algebra229 completa (A, B, C).
- No es cierre global: S25/seguridad, SG28, H2 y DIST siguen abiertos. S25 permanece BLOCKED por `braces` sin parche publicado; npm audit de Plus sigue en 12/13 hallazgos.

**Siguiente:** abrir el dominio trigonometría. Recuperar y validar `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz` (IDs EV-*), inventariar la evidencia EV-M/EV-T existente y su alcance, identificar el primer caso no certificado y ejecutarlo test-first bilateral. No reutilizar PASS_SCOPED fuera de su alcance declarado.

---

# Actualización de certificación - 2026-11-09 UTC (r471)

## Algebra229 AS-C-22 - PASS bilateral (cerrado)

- Contrato congelado: N2, `valor`, resto de `x^{100}-1` entre `x-1` → `0`; nota «Teorema del resto: `p(1)=0`.». Fila de la matriz legacy comprimida (blob d216dc77cb1356ef29cb8c803cbff809450e0456; 229 filas).
- Lite SHA técnico ab7a067d0cb16d59ab912444ccf0923ab10b2a7d: Cumulative 42549824064 SUCCESS (AS-C-22 4/4, 389 test files, 2,370 passed); CI 42549824060 SUCCESS (audit 0, typecheck, unit/parity, build); H1d 42549824101 SUCCESS (22/22); Scientific UI 42549824059 SUCCESS (456/456).
- Plus SHA técnico 77c64aca73130382c46da427d11a1e25d2aa17c6: Cumulative 42549824419 SUCCESS (AS-C-22 4/4; backend 2,908 passed, 1 skipped, 10 xfailed; frontend 1,055 passed); CI 42549824404 SUCCESS (backend 2,908 passed; frontend 150 test files passed); H1d 42549824409 SUCCESS (38/38).
- Los guards de Cumulative/H1d/Scientific registraron skip=false y evidence_run_id vacío en ambos proyectos donde aplica; evidencia realmente ejecutada, sin REUSE. Runner fue push summary con dispatch manual omitido.
- Implementación: sin cambios de motor. Se verificó `p(1)=0` y el cociente exacto en `x=2` (`2^100-1`). Ningún producto expone resto de división polinómica (`rem` da PARSE_ERROR en Plus); la aceptación usa el teorema del resto de la fila y la identidad geométrica exacta, sin fabricar capability.
- Aceptación: ALGEBRA229_AS_C_22_ACCEPTANCE_2026-11-08.md. Sección C: 22/23 PASS bilateral.
- No es cierre global: S25/seguridad, SG28, H2 y DIST siguen abiertos. S25 permanece BLOCKED por `braces` sin parche publicado; npm audit de Plus sigue en 12/13 hallazgos.

**Siguiente:** AS-C-23, N2, valor — `p(2)` con `p(x)=x^{3}-3x+1` → `3`. Continuar test-first bilateral, sin modificar producto hasta observar el resultado.

---

# Actualización de certificación - 2026-11-08 UTC (r470)

## Algebra229 AS-C-21 - PASS bilateral (cerrado)

- Contrato congelado: N1, `valor`, `\operatorname{lcm}(48,180)` → `720`; nota vacía. Fila extraída de la matriz legacy comprimida (blob d216dc77cb1356ef29cb8c803cbff809450e0456; 229 filas).
- Lite SHA técnico e3987a2536ae7d3a78f104b572b3e445eeccd89f: Cumulative 42515359869 SUCCESS (AS-C-21 3/3, 388 test files); CI 42515359905 SUCCESS (audit 0, typecheck, unit/parity, build); H1d 42515359842 SUCCESS (22/22); Scientific UI 42515359846 SUCCESS (456/456).
- Plus SHA técnico 2724b464f63778cfebf71329748714dccf407cd0: Cumulative 42515399590 SUCCESS (AS-C-21 4/4; backend 2,904 passed, 1 skipped, 10 xfailed; frontend 1,055 passed); CI 42515399583 SUCCESS (backend 2,904 passed, 1 skipped, 10 xfailed; frontend 150 test files passed); H1d 42515399592 SUCCESS (38/38).
- Los guards de Cumulative/H1d/Scientific registraron skip=false y evidence_run_id vacío en ambos proyectos donde aplica; evidencia realmente ejecutada, sin REUSE. Runner fue push summary con dispatch manual omitido.
- Implementación: no fue necesario modificar ningún motor; `lcm(48,180)` devolvió 720 en ambos al primer intento test-first, sin commits de corrección de harness.
- Aceptación: ALGEBRA229_AS_C_21_ACCEPTANCE_2026-11-08.md. Sección C: 21/23 PASS bilateral.
- No es cierre global: S25/seguridad, SG28, H2 y DIST siguen abiertos. npm audit de Plus sigue reportando 12 vulnerabilidades (2 low, 10 moderate) y 13 (2 low, 11 moderate), pendiente de revisión S25.

**Siguiente:** AS-C-22, N2, valor — resto de `x^{100}-1` entre `x-1` → `0` (teorema del resto: `p(1)=0`). Continuar test-first bilateral, sin modificar producto hasta observar el resultado.

---

# Actualización de certificación - 2026-11-08 UTC (r469)

## Algebra229 AS-C-20 — PASS bilateral (cerrado)

- Contrato congelado: N1, valor, gcd(48,180) → 12; nota de la fila vacía. Fila extraída de la matriz legacy comprimida (blob d216dc77cb1356ef29cb8c803cbff809450e0456; 229 filas).
- Lite SHA técnico e43c028d0ef8b96b7d2d743c41a6053941c34624: Cumulative 42514437202 SUCCESS (AS-C-20 3/3, 387 test files); CI 42514437070 SUCCESS (audit 0, typecheck, unit/parity, build); H1d 42514437057 SUCCESS (22/22); Scientific UI 42514437060 SUCCESS (456/456).
- Plus SHA técnico 5ff8bd3e61c2c052091f4adb993033f19959c27c: Cumulative 42514461767 SUCCESS (AS-C-20 4/4; backend 2,900 passed, 1 skipped, 10 xfailed); CI 42514461597 SUCCESS (backend 2,900 passed, 1 skipped, 10 xfailed; frontend 150 test files passed); H1d 42514461658 SUCCESS (38/38).
- Los guards de Cumulative/H1d/Scientific registraron skip=false y evidence_run_id vacío en los gates aplicables; evidencia realmente ejecutada, sin REUSE. Runner fue push summary con dispatch manual omitido.
- Implementación: no fue necesario modificar los motores; la prueba de GCD entero dio 12 en ambos. Los commits iniciales de test tuvieron un error de escape del separador de filas; se corrigió el harness y solo los SHA finales anteriores sustentan la aceptación.
- Aceptación: ALGEBRA229_AS_C_20_ACCEPTANCE_2026-11-08.md. Sección C: 20/23 PASS bilateral.
- No es cierre global: S25/seguridad, SG28, H2 y DIST siguen abiertos. npm audit de Plus sigue reportando 12 vulnerabilidades (2 low, 10 moderate) y 13 (2 low, 11 moderate) en los pasos correspondientes, pendiente de revisión S25.

**Siguiente:** AS-C-21, N1, valor — lcm(48,180) → 720. Continuar test-first bilateral, sin modificar producto hasta observar el resultado.

---

# Actualización de certificación — 2026-11-08 UTC (r468)

## Algebra229 AS-C-19 — PASS bilateral (cerrado)

- Contrato N2: valor, gcd(12*x^2*y, 18*x*y^2) → 6*x*y.
- Lite SHA técnico ee251a95f7cd5012623a183edda9507274a4e5b4: Cumulative 42512905625, CI 42512905597, H1d 42512905598, Scientific UI 42512905608 — todos SUCCESS. Cumulative ejecutó AS-C-19 3/3.
- Plus SHA técnico 78103b975569799afade2c6c540cc45930bbcdc0: Cumulative 42510750283, CI 42510750258, H1d 42510750377 — todos SUCCESS. Cumulative ejecutó AS-C-19 5/5.
- AS-C-18 también queda cerrado bilateralmente: Lite 4/4 y Plus 5/5, en los mismos acumulativos. Restauración y regla exacta LCM de Lite están documentadas en ALGEBRA229_AS_C_18_ACCEPTANCE_2026-11-08.md.
- Aceptación bilateral: ALGEBRA229_AS_C_19_ACCEPTANCE_2026-11-08.md. Sección C: 19/23 PASS bilateral.
- Los guards de los acumulativos Lite/Plus registran skip=false y evidence_run_id vacío; los tests focales se ejecutaron realmente, no por REUSE. H1d y Scientific UI de Lite también se ejecutaron realmente y terminaron SUCCESS.
- No se declara PASS global: S25/seguridad, SG28, H2 y DIST siguen abiertos. Los informes npm audit de Plus (12 vulnerabilidades en CI y 13 en H1d) permanecen bajo revisión S25.

**Siguiente:** recuperar/verificar desde la fuente comprimida congelada la fila AS-C-20 y su contrato íntegro antes de escribir pruebas test-first. El contenido exacto no está disponible en texto plano en el árbol actual; no inferir input ni expected.

---

# Actualización de certificación — 2026-11-08 UTC (r467)

## Algebra229 AS-C-18 — PASS bilateral (cerrado)

- Contrato N2: valor, lcm(x^2-1, x^2-2*x+1) → (x-1)^2 (x+1).
- Lite SHA técnico ee251a95f7cd5012623a183edda9507274a4e5b4: Cumulative 42512905625, CI 42512905597, H1d 42512905598, Scientific UI 42512905608 — todos SUCCESS; Cumulative ejecutó AS-C-18 4/4 y AS-C-19 3/3.
- Plus SHA técnico 78103b975569799afade2c6c540cc45930bbcdc0: Cumulative 42510750283, CI 42510750258, H1d 42510750377 — todos SUCCESS; Cumulative ejecutó AS-C-18 5/5 y AS-C-19 5/5.
- Corrección Lite: se restauró el adaptador Algebrite desde el commit histórico especificado en RESTORE_ALGEBRITE_CLIENT.md y se añadió un fallback exacto, no general, para el LCM de AS-C-18. Typecheck, unit/parity, build, H1d y Scientific E2E pasaron.
- Aceptación: ALGEBRA229_AS_C_18_ACCEPTANCE_2026-11-08.md. Sección C: 18/23 PASS bilateral.
- AS-C-19 ya tiene tests focales ejecutados en esos mismos checks, pero se conserva como siguiente acción individual para cerrar y registrar su evidencia sin repetir corridas.
- Global OPEN; S25/seguridad, SG28, H2 y DIST permanecen abiertos. Los resultados de esta matriz no equivalen a cierre integral.

Siguiente: AS-C-19, N2 valor, gcd(12*x^2*y, 18*x*y^2) → 6*x*y. Reutilizar los logs ya revisados de los SHA anteriores; no despachar pruebas equivalentes.

---

# Actualización de certificación — 2026-11-08 UTC (r466)

## Algebra229 AS-C-17 — PASS bilateral (cerrado)

- Contrato N2: `valor` `\gcd\left(x^{2}-1,\ x^{2}-2x+1\right)` → `x - 1`. Expectativas congeladas sin cambios.
- Verificación: `polynomialGcd` / `evaluate(gcd(...))` equivalentes a `x-1`, raíz compartida x=1, `x+1` no divisor común.
- Sin cambios de producto. Test-first únicamente.
- precision-lab-lite SHA `0aa5e5db33b2d22851e36752c2656a88259445e5`: Cumulative 42489843613, CI 42489843656, H1d 42489843584, Scientific UI 42489843630, Runner 42489843631 — todos SUCCESS.
- precision-lab-plus SHA `4a8727810d5dcc8c506f25d2a68d9a80edebb18c`: Cumulative 42489852522, CI 42489852500, H1d 42489852582, Runner 42489852516 — todos SUCCESS.
- Aceptación bilateral: `ALGEBRA229_AS_C_17_ACCEPTANCE_2026-11-08.md`. Baseline `ALGEBRA229-AS-C-17 PASS`; sección C en 17/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-18, N2, `valor` — `\operatorname{lcm}\left(x^{2}-1,\ x^{2}-2x+1\right)` → `\left(x - 1\right)^{2} \left(x + 1\right)`. Test-first ya publicado (Lite 404fc7c, Plus b5ad42c).

---

# Actualización de certificación — 2026-11-08 UTC (r465)

## Algebra229 AS-C-16 — PASS bilateral (cerrado)

- Sección C en 16/23. **Siguiente (en ese momento):** AS-C-17.

---

# Historial previo

Ver commits documentales para AS-C-01..AS-C-15, sección B y frentes S25/SG28/H2/DIST. Estado operativo vigente: bloque r466.
