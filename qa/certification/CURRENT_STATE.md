# Actualización de certificación — 2026-11-10 UTC (r487; EC-D-08 PASS_SCOPED bilateral)

## Trigonometría TRIG-EC-D-08 — PASS_SCOPED bilateral

- Fila congelada del gzip legacy (blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb): \(\sec x=-2,\quad x\in[0,2\pi)\) → \(\{2\pi/3,4\pi/3\}\). La fila original tiene tres columnas (ID, ejercicio y resultado esperado); no existe una nota separada.
- Oráculo: exactamente dos raíces distintas, ambas en el intervalo semiabierto y verificadas por sustitución en la ecuación secante original.
- Lite SHA técnico \`b8c3ffcf7815c373c7f46849dc547d1cf1864de8\`. Test focal tests/trigonometryEcD08.audit.test.ts: 2/2 PASS en CI y Cumulative. CI 42754588522 SUCCESS; Cumulative 42754588411 SUCCESS (401 archivos, 2,412 passed, 8 expected fail, 34 TODO; skip=false, evidence_run_id vacío); H1d 42754588566 SUCCESS (22/22); Scientific UI 42754588396 SUCCESS (456/456 desktop/tablet/mobile); Runner 42754588787 SUCCESS push-only.
- Plus SHA técnico \`fb430768589eabfb930b03790d135b879ddf9109\`. Test focal backend/tests/test_trigonometry_ec_d08.py: ambos tests PASSED explícitamente en Cumulative 42755121582. Backend 2,937 passed, 1 skipped, 11 xfailed; guard skip=false y evidence_run_id vacío. CI 42755121784 SUCCESS (backend y frontend); H1d 42755121628 SUCCESS (38/38); Native Syntax 42755121609 SUCCESS (26 desktop y 52 tablet/mobile); Runner 42755121603 SUCCESS push-only.
- Lite utiliza un helper acotado para la forma parser-normalizada 1/cos(x)=-2; Plus resuelve la entrada sec(x)=-2 mediante un helper que resuelve cos(x)=-1/2 directamente en [0,2π). Ambos verifican las raíces en la ecuación recíproca original. No son resolvedores generales de secante.
- Acta bilateral: qa/certification/TRIG_EC_D_08_ACCEPTANCE_2026-11-10.md en ambos repositorios.

## Estado y siguiente acción

- Último caso aceptado: TRIG-EC-D-08 — PASS_SCOPED bilateral.
- Siguiente: TRIG-EC-D-09; recuperar primero la fila fuente exacta del gzip y fijar ecuación, intervalo y conjunto esperado antes de escribir pruebas.
- Certificación global: OPEN. EV-D-01 en Plus /api/v1/evaluate sigue BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
- No repetir gates verdes de EC-D-01..08 ni ejecutar dispatch manual.

---

# Actualización de certificación — 2026-11-10 UTC (r486; EC-D-07 PASS_SCOPED bilateral)

## Trigonometría TRIG-EC-D-07 — PASS_SCOPED bilateral

- Fila congelada de qa/certification/legacy_sources/ejercicios_trigonometria.md.gz, blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb: \(\csc x=2,\ x\in[0,2\pi)\) → \(\{\pi/6,5\pi/6\}\). La fila original tiene tres columnas (ID, ejercicio, resultado esperado); no existe nota separada.
- Oráculo focal: exactamente dos raíces distintas, ambas en el intervalo semiabierto y ambas verificadas por sustitución en la ecuación recíproca original.
- Lite SHA técnico 3ad626602b3639310921ba6fd27952293732be39. Test tests/trigonometryEcD07.audit.test.ts: 2/2 PASS en CI y Cumulative. CI 42748347965 SUCCESS; Cumulative 42748348152 SUCCESS (400 archivos, 2,410 passed, 8 expected fail, 34 TODO; skip=false, sin evidencia reutilizada); H1d 42748347964 SUCCESS (22/22); Scientific UI 42748348035 SUCCESS (456/456 desktop/tablet/mobile); Runner 42748348237 SUCCESS push-only.
- Plus SHA de prueba 864c4cf68bb88e331b6df3b64a0ddb2354b047af, sin cambios de producto. Test backend/tests/test_trigonometry_ec_d07.py: 2/2 PASS explícitos en Cumulative 42748028770 SUCCESS (backend 2,935 passed, 1 skipped, 11 xfailed; frontend SUCCESS; skip=false, sin reutilización); CI 42748028579 SUCCESS (backend 2,935 passed; frontend 150 archivos, 1,055 passed, 28 TODO); H1d 42748028455 SUCCESS (38/38); Runner 42748028867 SUCCESS push-only.
- Lite requiere helper acotado porque el parser normaliza csc(x) a 1/sin(x); el helper reconoce únicamente la forma normalizada 1/sin(x)=2, reutiliza el caso de seno y verifica la ecuación recíproca. Plus resuelve el caso sin cambios del motor.
- No se certifica ingesta LaTeX literal en Plus /api/v1/evaluate ni se afirma resolución general de funciones recíprocas.

## Estado y siguiente acción

- Último caso aceptado: TRIG-EC-D-07 — PASS_SCOPED bilateral.
- Siguiente: TRIG-EC-D-08; recuperar primero la fila fuente exacta y fijar su contrato antes de escribir pruebas.
- Certificación global: OPEN. EV-D-01 /api/v1/evaluate continúa BLOCKED; EV-HI permanece PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
- No repetir los gates ya verdes de EC-D-01..07 ni ejecutar dispatch manual.

---

# Actualización de certificación — 2026-11-10 UTC (r485; EC-D-07 IN_PROGRESS)

## Trigonometría TRIG-EC-D-07 — Lite focal aprobado; E2E complementario pendiente

- Fila congelada recuperada directamente de `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`: `\csc x=2,quad x\in[0,2\pi)` → `x=\frac{\pi}{6},\ \frac{5\pi}{6}`. La fila original tiene tres columnas (ID, ejercicio, resultado esperado); no hay nota separada.
- Test focal `tests/trigonometryEcD07.audit.test.ts`: anclaje de fuente + resolución exacta de ambas raíces, intervalo semiabierto y sustitución recíproca.
- El primer intento Lite SHA `0bb1e92ea97e01335524e43040a49744134b4264` detectó que el resolvedor genérico no encontraba soluciones para `csc(x)=2`; el resto de las suites previas pasó.
- Corrección Lite acotada: `src/engine/stepEngine/trigonometricEquation.ts` añade `solveCosecantEqualsTwoEquation`, reconoce la forma normalizada `1/sin(x)=2` que produce el parser desde `csc(x)`, reutiliza el resolvedor directo de `sin(x)=1/2` y verifica cada raíz contra la ecuación recíproca. Enrutamiento en `src/engine/stepEngine/algebra.ts`. No es un resolvedor general de funciones recíprocas.
- SHA técnico Lite final `3ad626602b3639310921ba6fd27952293732be39`.
- Lite CI [42748347965](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748347965) SUCCESS: test EC-D-07 2/2; 400 archivos, 2,410 passed, 8 expected fail, 34 TODO.
- Lite Cumulative [42748348152](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748348152) SUCCESS: test EC-D-07 2/2; 400 archivos, 2,410 passed, 8 expected fail, 34 TODO; guard `skip=false`, `evidence_run_id=""`.
- Lite H1d [42748347964](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748347964) SUCCESS.
- Lite Scientific UI [42748348035](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748348035) seguía IN_PROGRESS en verificación nativa desktop/tablet/mobile al corte. Runner [42748348237](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748348237) es un resumen push-only, no dispatch manual.
- No emitir PASS_SCOPED bilateral ni acta mientras falta Plus CI/Cumulative backend y Scientific UI Lite sigue activo.

## Plus — test focal en curso

- Test `backend/tests/test_trigonometry_ec_d07.py` añadido en SHA `864c4cf68bb88e331b6df3b64a0ddb2354b047af`; valida fila fuente y POST `/api/v1/solve`, las dos raíces exactas y su sustitución.
- Plus H1d [42748028455](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028455) SUCCESS; Runner [42748028867](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028867) SUCCESS.
- Plus CI [42748028579](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028579) y Cumulative [42748028770](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028770) tenían frontend SUCCESS y backend IN_PROGRESS al corte. Aún no se ha demostrado si el solver general SymPy cubre el caso sin cambio de producto.

## Estado y siguiente acción

- Último baseline aceptado: EC-D-06 PASS_SCOPED bilateral.
- EC-D-07: IN_PROGRESS; Lite focal y CI/Cumulative/H1d PASS, E2E complementario pendiente; Plus H1d PASS, backend CI/Cumulative pendiente.
- Certificación global: OPEN.
- No repetir Lite CI/Cumulative/H1d que ya cerraron SUCCESS. No repetir Plus H1d ni Runner. No dispatch manual.

**Siguiente:** verificar el test focal y el total backend en Plus CI/Cumulative; confirmar el cierre Scientific UI Lite. Si la ruta general Plus pasa, no añadir código de producto innecesario. Solo entonces redactar aceptación bilateral y avanzar a EC-D-08.

---

# Actualización de certificación — 2026-11-10 UTC (r484; EC-D-06 PASS_SCOPED)

## Trigonometría TRIG-EC-D-06 — PASS_SCOPED bilateral

- Fila congelada: \`sin(2x)=cos(x)\`, \`x∈[0,2π)\` → \`{π/6, π/2, 5π/6, 3π/2}\`; gzip blob \`3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb\`. La fuente contiene tres columnas, sin nota independiente.
- Lite SHA \`2af7cefc410d1b7cb2c15483f3affd3473b54a89\`: test \`tests/trigonometryEcD06.audit.test.ts\` 2/2; Cumulative 42746381569 SUCCESS (399 archivos, 2,408 passed, 8 expected fail, 34 TODO, skip=false, sin REUSE); CI 42746381637 SUCCESS (typecheck/audit/tests/build, mismos conteos); H1d 42746381850 SUCCESS (22/22, skip=false); Scientific UI 42746381589 SUCCESS (456/456 desktop/tablet/mobile, skip=false); Runner 42746381595 SUCCESS push-only.
- Plus SHA \`2a7ff0f2b243597ef6476e665b4a102dcfffdd85\`: test \`backend/tests/test_trigonometry_ec_d06.py\` 2/2 PASS explícito en Cumulative 42746666257; backend 2,933 passed, 1 skipped, 11 xfailed, skip=false. CI 42746666105 SUCCESS (mismos conteos backend y frontend SUCCESS); H1d 42746666095 SUCCESS 38/38 (skip=false); Native Syntax 42746666542 SUCCESS 52/52 (skip=false); Runner 42746666546 SUCCESS push-only.
- Lite factoriza este caso concreto mediante identidad de ángulo doble; Plus normaliza las raíces al intervalo usando solveset sobre los factores. Cada candidato se sustituye en la ecuación original.
- Acta bilateral: \`qa/certification/TRIG_EC_D_06_ACCEPTANCE_2026-11-10.md\`.

## Alcance y límites

- PASS_SCOPED cubre solo la ecuación congelada y el conjunto exacto de cuatro raíces en \`[0,2π)\`; no generaliza a ecuaciones trigonométricas mixtas arbitrarias ni a familias sobre toda \`R\`.
- Las entradas de cálculo son ASCII/forma normalizada. No se certifica aquí ingesta literal LaTeX en Plus \`/api/v1/evaluate\`.
- Plus \`Certification dependency and security gates\` 42746666307 seguía ejecutando \`plus-backend-mutmut\`, independiente de la aceptación matemática EC-D-06.
- Certificación global **OPEN**. EV-D-01 Plus \`/api/v1/evaluate\` BLOCKED; EV-HI PASS_SCOPED; S25, SG28, H2 y DIST abiertos.

**Siguiente:** TRIG-EC-D-07, cuya fila congelada ya fue recuperada: \`csc(x)=2,\ x∈[0,2π)\` → \`{π/6,5π/6}\`. Fijar el contrato literal y continuar test-first bilateral. No repetir EC-D-01..06.

---

# Actualización de certificación — 2026-11-10 UTC (r483; EC-D-06 IN_PROGRESS)

## Trigonometría TRIG-EC-D-06 — IN_PROGRESS; Lite focal y gates principales en verde

- Fila congelada recuperada directamente del gzip, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`: `sin(2x)=cos(x)`, intervalo `[0,2π)`; resultado exacto `{π/6, π/2, 5π/6, 3π/2}`.
- Test focal `tests/trigonometryEcD06.audit.test.ts`: anclaje de la fila original y verificación del conjunto exacto de cuatro raíces, intervalo semiabierto y sustitución en la ecuación original.
- Primer intento técnico Lite SHA `9ce1e18de656ea05b39741e0c17fd47ee4176377`: el test nuevo reprodujo un gap real del solver genérico (`No se encontró una solución algebraica para "x"`); el resto de la suite pasó.
- Corrección de producto acotada en `src/engine/stepEngine/trigonometricEquation.ts` y orquestación en `src/engine/stepEngine/algebra.ts`: factoriza solo esta ecuación congelada usando `sin(2x)=2sin(x)cos(x)`, genera raíces de `cos(x)=0` y `sin(x)=1/2`, y verifica cada candidato contra la ecuación original. No es un resolvedor genérico para ecuaciones trigonométricas mixtas.
- SHA técnico final Lite `2af7cefc410d1b7cb2c15483f3affd3473b54a89`.
- Lite Cumulative [42746381569](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381569) SUCCESS: EC-D-06 focal 2/2; 399 archivos, 2,408 passed, 8 expected fail, 34 TODO; guard `skip=false`, `evidence_run_id=""`.
- Lite CI [42746381637](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381637) SUCCESS: EC-D-06 focal 2/2; typecheck, audit, unit/parity y build SUCCESS; 399 archivos, 2,408 passed, 8 expected fail, 34 TODO.
- Lite H1d [42746381850](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381850) SUCCESS, 22/22; guard `skip=false`, sin reutilización. Runner [42746381595](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381595) SUCCESS, push-only.
- Lite Scientific UI [42746381589](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381589) seguía IN_PROGRESS al corte, job `scientific-ui` dentro de `Native desktop/tablet/mobile scientific result verification`. Es complementario; no se ha contabilizado como SUCCESS.

## Estado bilateral y límites

- Plus creó su prueba focal, pero el primer SHA de prueba `7b038743f96afc782997e059f5b4215985e231e3` devolvió `-π/2` en lugar de la representación exigida `3π/2` dentro de `[0,2π)`. Se corrigió con un resolvedor acotado por intervalo en Plus; su SHA final de código es `2a7ff0f2b243597ef6476e665b4a102dcfffdd85`.
- Plus H1d [42746666095](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666095) SUCCESS (38/38; guard skip=false); Native Syntax [42746666542](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666542) SUCCESS (52/52; guard skip=false). Plus CI [42746666105](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666105) y Cumulative [42746666257](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666257) tenían frontend SUCCESS y backend IN_PROGRESS al corte. No hay todavía evidencia final del test Plus en esos gates.
- Gate de seguridad/mutación Plus [42746666307](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666307) sigue IN_PROGRESS en `plus-backend-mutmut`; es complementario y no sustituye la evidencia del solver.
- **No emitir PASS_SCOPED bilateral ni acta de aceptación** hasta revisar el test focal en el backend Plus final y que CI/Cumulative Plus cierren SUCCESS. El baseline aceptado sigue EC-D-05 PASS_SCOPED; certificación global OPEN.

**Siguiente:** terminar la inspección de logs de CI/Cumulative Plus sobre SHA `2a7ff0f2...`; confirmar explícitamente los dos tests EC-D-06 y su total de backend. Verificar si Lite Scientific UI [42746381589] termina SUCCESS. Si todo lo exigido cierra verde, redactar acta bilateral y avanzar a EC-D-07. No repetir los gates Lite que ya están SUCCESS ni H1d/Native Plus. Sin dispatch manual.

---

# Actualización de certificación — 2026-11-10 UTC (r482; EC-D-05 PASS_SCOPED)

## Trigonometría TRIG-EC-D-05 — PASS_SCOPED bilateral

- Contrato congelado desde `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`: `\sin x+\cos x=1,\quad x\in[0,2\pi)` → `\{0,\frac{\pi}{2}\}`.
- Oráculo: exactamente dos raíces reales distintas, ambas en el intervalo semiabierto y verificadas por sustitución en la ecuación original.
- Lite SHA técnico `28964186aa61be64924d49e83e929ea724fc7383`. Test `tests/trigonometryEcD05.audit.test.ts`: anclaje de fuente + resolución focal, 2/2. CI [42732509176](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509176) SUCCESS (398 archivos, 2,406 passed, 8 XFAIL esperados, 34 TODO); Cumulative [42732509088](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509088) SUCCESS (focal 2/2; guard skip=false, evidence_run_id vacío); H1d [42732509506](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509506) SUCCESS (22/22; skip=false); Scientific UI [42732509163](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509163) SUCCESS (456/456; skip=false); Runner [42732509098](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509098) SUCCESS, push-only.
- Plus SHA técnico `971774693b5e3bd35cebe188be2fa8d9d96a55dd`. Test `backend/tests/test_trigonometry_ec_d05.py`: los dos tests PASSED explícitamente en Cumulative [42731929122](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929122); backend 2,931 passed, 1 skipped, 11 xfailed; guard skip=false, evidence_run_id vacío. CI [42731929126](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929126) SUCCESS (backend/frontend); H1d [42731929115](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929115) SUCCESS (38/38; skip=false); Runner [42731929156](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929156) SUCCESS, push-only.
- Implementación Lite estrictamente acotada: sustitución `t=tan(x/2)`; el numerador resultante es `2t(1-t)`, con candidatos `t=0,1`, que se convierten en `x=0,pi/2`. Los candidatos se normalizan al intervalo y se verifican en la ecuación original. Plus no necesitó cambio de producto; SymPy resolvió por la ruta general.

## Alcance y límites

- PASS_SCOPED cubre solamente el conjunto exacto `{0, π/2}` en `[0,2π)` para `sin(x)+cos(x)=1`; no generaliza a combinaciones arbitrarias de funciones trigonométricas ni a una familia periódica sobre toda `R`.
- Las entradas de cálculo son ASCII/forma normalizada y la fila fuente se ancla como fixture. No se certifica ingesta literal LaTeX en Plus `/api/v1/evaluate` ni una interfaz dedicada a este ejercicio.
- EV-D-01 Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
- La certificación global permanece **OPEN**.

**Siguiente:** TRIG-EC-D-06. Recuperar primero la fila literal de EC-D-06 desde el gzip congelado; fijar ejercicio, intervalo y resultado esperado antes de escribir pruebas. No inferir el contrato por el identificador ni repetir EC-D-01..05.

---

# Actualización de certificación — 2026-11-10 UTC (r481; EC-D-04 PASS_SCOPED)

## Trigonometría EC-D-04 — PASS_SCOPED bilateral

- Contrato congelado: \(2\sin^{2}x-\sin x-1=0,\ x\in[0,2\pi)\) → \(\{\frac{\pi}{2},\frac{7\pi}{6},\frac{11\pi}{6}\}\). Fuente: qa/certification/legacy_sources/ejercicios_trigonometria.md.gz, blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb.
- Lite SHA 9663f1625fcca7cc668c61d55f844453eb90dfd0. Test tests/trigonometryEcD04.audit.test.ts: anclaje de la fila y oráculo 2/2 PASS; exactamente tres raíces, intervalo semiabierto y sustitución en la ecuación original.
- CI 42730206344 SUCCESS: typecheck, audit, unit/parity y build; 397 archivos, 2,404 passed, 8 XFAIL esperados, 34 TODO.
- Cumulative 42730206373 SUCCESS: focal 2/2; guard skip=false, evidence_run_id vacío; 397 archivos, 2,404 passed, 8 XFAIL y 34 TODO.
- H1d 42730206364 SUCCESS: 22/22, guard skip=false y sin reutilización.
- Scientific UI 42730206324 SUCCESS: 456/456 desktop/tablet/mobile; guard skip=false y evidence_run_id vacío.
- Runner 42730206411 SUCCESS, push-only; sin dispatch manual.
- Implementación acotada: sustitución u=sin(x), resolución del polinomio cuadrático, generación de ambas ramas, normalización a [0,2π), deduplicación y verificación de cada raíz en la ecuación original.
- Acta bilateral: qa/certification/TRIG_EC_D_04_ACCEPTANCE_2026-11-10.md.

## Alcance y límites

- Se certifica el conjunto exacto de tres raíces reales dentro de [0,2π); no se afirma que ese conjunto finito represente todas las soluciones sobre R.
- La ecuación se calcula mediante texto ASCII/forma normalizada. La fila LaTeX original se ancla como fixture, pero no se certifica ingesta literal LaTeX en todos los endpoints ni una UI dedicada a este ejercicio.
- No cierra la matriz trigonométrica ni IN625. Certificación global **OPEN**.
- EV-D-01 Plus /api/v1/evaluate sigue BLOCKED; EV-HI continúa PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.

**Siguiente:** TRIG-EC-D-05. Recuperar primero la fila exacta del gzip congelado, fijar entrada/intervalo/salida y después test-first bilateral. No inferir el contrato por el nombre del caso ni repetir los gates EC-D-01..04 ya aceptados.

---

# Actualización de certificación — 2026-11-10 UTC (r480; EC-D-04 IN_PROGRESS)

## Trigonometría EC-D-04 — pruebas focales bilaterales PASS; gates finales pendientes

- Contrato congelado desde \`qa/certification/legacy_sources/ejercicios_trigonometria.md.gz\`, blob \`3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb\`: \(2\sin^{2}x-\sin x-1=0,\ x\in[0,2\pi)\) → \(\{\frac{\pi}{2},\frac{7\pi}{6},\frac{11\pi}{6}\}\).
- Lite SHA técnico verificado \`9663f1625fcca7cc668c61d55f844453eb90dfd0\`. Test \`tests/trigonometryEcD04.audit.test.ts\`: anclaje de fila + conjunto exacto de tres raíces, intervalo semiabierto y sustitución en la ecuación original; ambas pruebas PASSED explícitamente.
- Lite [CI 42730206344](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206344) SUCCESS: 397 archivos, 2,404 passed, 8 XFAIL esperados y 34 TODO; typecheck, auditoría y build completados.
- Lite [Cumulative 42730206373](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206373) SUCCESS: EC-D-04 2/2; 397 archivos, 2,404 passed, 8 XFAIL y 34 TODO. Guard \`skip=false\`, \`evidence_run_id=""\`; ejecución real sobre este SHA.
- Lite [H1d 42730206364](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206364) SUCCESS: 22/22, guard \`skip=false\`, sin reutilización. [Runner 42730206411](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206411) SUCCESS, push-only.
- Lite [Scientific UI 42730206324](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206324) seguía IN_PROGRESS al corte en \`Native desktop/tablet/mobile scientific result verification\`; complementario, no usado como oráculo matemático de EC-D-04.
- Plus SHA técnico verificado \`633ec35dc8de728c657cd00907328a2ff6f5c2eb\`. Test \`backend/tests/test_trigonometry_ec_d04.py\`: ancla la fila y verifica \`POST /api/v1/solve\` con entrada ASCII; el resultado esperado es exactamente el conjunto de tres raíces dentro de \([0,2\pi)\).
- Plus [Cumulative 42730138929](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138929) SUCCESS: ambos tests EC-D-04 PASSED explícitamente; backend 2,929 passed, 1 skipped, 11 xfailed. Guard \`skip=false\`, \`evidence_run_id=""\`. Frontend: 150 archivos, 1,055 passed, 28 TODO; typecheck y build SUCCESS.
- Plus [H1d 42730138616](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138616) SUCCESS: 38/38, guard \`skip=false\`, sin reutilización. [Native Syntax and Recovery 42730138595](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138595) SUCCESS: 52/52 desktop/tablet/mobile. [Runner 42730138951](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138951) SUCCESS, push-only.
- Plus [CI 42730138619](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138619) seguía IN_PROGRESS al corte; frontend SUCCESS y backend tests aún activos. Este gate debe concluir antes de cerrar el caso.
- Implementación Lite: sustitución acotada \(u=\sin x\), resolución del polinomio cuadrático, generación de ambas ramas reales, normalización a \([0,2\pi)\), deduplicación y sustitución en la ecuación original. Plus aplica el mismo contrato de intervalo para esta familia. Los cambios no amplían el alcance a funciones trigonométricas compuestas o argumentos transformados.
- Alcance: cálculo por canales de texto ASCII/forma normalizada y anclaje a la fila congelada. No se certifica ingesta literal LaTeX en Plus \`/api/v1/evaluate\` ni una UI específica para este ejercicio.
- Estado: **IN_PROGRESS**; no crear acta de aceptación ni mover el puntero a EC-D-05 hasta que Plus CI cierre SUCCESS. El E2E Scientific UI de Lite se registra como complementario si continúa activo. Baseline aceptado: EC-D-03 PASS_SCOPED. Certificación global **OPEN**.

**Siguiente:** verificar Plus CI 42730138619; si termina SUCCESS, emitir aceptación PASS_SCOPED bilateral con el alcance anterior y avanzar a EC-D-05. No repetir CI/Cumulative/H1d/Native ya verdes. No cambiar EV-D-01 BLOCKED, EV-HI PASS_SCOPED ni los pendientes S25, SG28, H2 y DIST.

---

# Actualización de certificación — 2026-11-09 UTC (r479; EC-D-03 PASS_SCOPED)

## Trigonometría EC-D-03 — PASS_SCOPED bilateral

- Contrato congelado: \(\tan x=\sqrt{3}\) → \(x=\frac{\pi}{3}+k\pi,\ k\in\mathbb{Z}\). La matriz exige la familia infinita completa.
- Lite SHA verificado d10a2cd2d6032fb7b2c87afaa290fe1b82773d45; test tests/trigonometryEcD03.audit.test.ts. La salida contiene una única familia paramétrica; se verifican k = -3, 0 y 2 y la sustitución en la ecuación.
- Lite CI 42712032373 SUCCESS (396 archivos, 2,402 passed, 8 XFAIL, 34 TODO); Cumulative 42712032384 SUCCESS (EC-D-03 2/2, guard skip=false, evidence_run_id vacío); H1d 42712032789 SUCCESS (22/22, skip=false); Scientific UI 42712032408 SUCCESS (456/456); Runner 42712032501 SUCCESS push-only.
- Plus SHA verificado d02a3076b57d9bb2cd02d7c89e1bce3e176a9055; test backend/tests/test_trigonometry_ec_d03.py. POST /api/v1/solve entrega una ImageSet sobre Integers y el solver verifica simbólicamente la familia.
- Plus Cumulative 42712350673 SUCCESS (tests EC-D-03 2/2 explícitos; 2,927 passed, 1 skipped, 11 xfailed; guard skip=false y evidence_run_id vacío); CI 42712350706 SUCCESS; H1d 42712350501 SUCCESS (38/38, skip=false); Native Syntax and Recovery 42712350400 SUCCESS (52/52); Runner 42712350393 SUCCESS push-only.
- Aceptación: qa/certification/TRIG_EC_D_03_ACCEPTANCE_2026-11-09.md.
- Alcance: familia completa \(x=\pi/3+k\pi,\ k\in\mathbb Z\), en radianes. Las pruebas usan ecuación ASCII; no certifican ingesta literal LaTeX ni UI específica de este caso.
- Plus Certification dependency and security gates 42712350624 sigue IN_PROGRESS en mutation/plus-backend-mutmut; es independiente de este cierre.
- Global **OPEN**; EV-D-01 Plus /api/v1/evaluate permanece BLOCKED; EV-HI PASS_SCOPED; S25, SG28, H2 y DIST abiertos.

**Siguiente:** TRIG-EC-D-04. Fila congelada: \(2\sin^{2}x-\sin x-1=0,\ x\in[0,2\pi)\) → \(x=\frac{\pi}{2},\ \frac{7\pi}{6},\ \frac{11\pi}{6}\). Fijar primero la prueba focal bilateral y demostrar el conjunto exacto de tres raíces en el intervalo; no inferir el contrato a partir de la factorización ni alterar los casos EC-D-01..03.

---

# Actualización de certificación — 2026-11-09 UTC (r478; EC-D-02 PASS_SCOPED)

## Trigonometría EC-D-02 — PASS_SCOPED bilateral

- Contrato congelado desde \`qa/certification/legacy_sources/ejercicios_trigonometria.md.gz\`: \`2\cos x-1=0,\quad x\in[0,2\pi)\` → \`x=\frac{\pi}{3},\ \frac{5\pi}{3}\`. La fila tiene tres columnas; no existe nota separada.
- Lite SHA técnico \`5e58fda3bb98c90520bfc5cf833f4222009fa1b1\`; test \`tests/trigonometryEcD02.audit.test.ts\`, 2/2 PASS en CI y Cumulative.
- [Lite CI 42708572030](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708572030) SUCCESS: 395 archivos, 2,400 passed, 8 XFAIL, 34 TODO; typecheck, auditoría y build SUCCESS.
- [Lite Cumulative 42708571839](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708571839) SUCCESS: focal 2/2; guard \`skip=false\`, \`evidence_run_id=""\`; 395 archivos, 2,400 passed, 8 XFAIL, 34 TODO.
- [Lite H1d 42708572192](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708572192) SUCCESS, 22/22; guard \`skip=false\`. [Runner 42708571827](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708571827) SUCCESS push-only, sin dispatch manual.
- [Scientific UI 42708571826](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708571826) seguía IN_PROGRESS en desktop/tablet/mobile al corte; complementario, no usado como oráculo matemático.
- Aceptación: \`qa/certification/TRIG_EC_D_02_ACCEPTANCE_2026-11-09.md\`.
- Alcance: dos raíces exactas, intervalo \`[0,2π)\` y sustitución. No afirmar la familia periódica infinita sobre \(\mathbb R\); EC-D-03 tiene ese contrato.
- Global **OPEN**; EV-D-01 Plus \`/api/v1/evaluate\` sigue BLOCKED; EV-HI PASS_SCOPED; S25, SG28, H2 y DIST abiertos.

**Siguiente:** TRIG-EC-D-03. Recuperar su fila exacta y certificar la familia infinita \`x=π/3+kπ,\ k∈ℤ\`; no sustituirla por dos raíces de un período. Evaluar la representación paramétrica en ambos motores antes de ampliar el solver.

---

# Actualización de certificación — 2026-11-09 UTC (r477; EC-D-02 IN_PROGRESS)

## Trigonometría TRIG-EC-D-02 — IN_PROGRESS; sin aceptación bilateral

- Contrato recuperado directamente de `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`: `2\cos x-1=0,\quad x\in[0,2\pi)` → `x=\frac{\pi}{3},\ \frac{5\pi}{3}`. La fila original tiene tres columnas (ID, ejercicio, resultado esperado); no existe una columna de nota separada y no se inventa.
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
