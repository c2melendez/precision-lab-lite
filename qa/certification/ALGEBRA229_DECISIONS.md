# Decisiones de Álgebra229 (registro para continuidad)

Este archivo recoge las decisiones tomadas durante la certificación ALGEBRA229 para que otro agente pueda continuar sin reinterpretarlas. Los detalles por caso están en `EXECUTION_LOG.md`; el estado vigente, en `CURRENT_STATE.md`; el puntero de continuidad, en `continuity.json`.

## Fuente de verdad y orden

- **D1.** La matriz congelada es `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`, en la rama `qa/syntax-audit-in625-a1`. Las filas AS-B se ejecutan en orden estricto por ID. No se reordenan ni se saltan.
- **D2.** Un caso por ciclo. Primero se añade la prueba test-first en ambos repos, después se verifican los gates sobre el SHA exacto. Solo se cambia el producto si la prueba falla, y ese cambio queda documentado en el cierre.
- **D3.** Nombres de pruebas: Lite `tests/algebra229AsB{NN}.audit.test.ts`; Plus `backend/tests/test_algebra229_as_b{nn}.py`.
- **D4.** Gates por caso: Lite cumulative, H1d y SY-N-31 scientific-ui; Plus cumulative y H1d. Un caso está cerrado solo con los gates en success sobre el SHA técnico.

## Cierre documental (obligatorio)

- **D5.** Cada caso se cierra con tres archivos en ambos repos: bloque nuevo al inicio de `CURRENT_STATE.md`, entrada antes de `## Histórico AS-PAR / Syntax` en `EXECUTION_LOG.md`, y `continuity.json` (`revision`, `next_action`, `ledger_note`).
- **D6.** Si una escritura falla (por ejemplo, 502 de GitHub), antes de reintentar se verifica qué quedó escrito. No se duplican entradas.

## Decisiones de producto

- **D7. Lite, pipeline de factor:** `Algebrite.run` → `denestConstantRadicals` → `verifyFactorResult` (`src/engine/polynomialFactorZ.ts`). El resultado alternativo solo reemplaza al de Algebrite si la identidad se verifica como equivalente al original. Commits relevantes: AS-B-07 (Kronecker univariado entero, `89b7055`) y AS-B-16 (regla de cubos, `4c82294`).
- **D8. Alcance de la regla de cubos (Lite):** solo binomios `a^3 ± b^3` con variables de una sola letra, y solo si el resultado de Algebrite no contiene `(`, `)` ni `*`. No es un factorizador multivariable general. Esto no está generalizado a `a^n ± b^n`; esa generalización no está decidida.
- **D9. Plus:** usa SymPy (`/api/v1/factor`) y no tiene Kronecker ni regla de cubos. Los casos se verifican contra la matriz, no contra el comportamiento de Lite. AS-B-16 y AS-B-17 pasaron sin cambios de producto en Plus.
- **D10. Filas que deben quedar sin factorizar:** AS-B-22 (`x²+1`) y AS-B-23 (`x²-2`) sobre ℚ. Sirven como regresión: ninguna regla nueva puede factorizarlas falsamente.
- **D11. Cuerpo explícito (AS-B-24, AS-B-25):** decidido en r183. Se incluyen las filas con sufijo explícito «sobre ℝ» o «sobre ℂ» en la entrada. Pendiente: la sintaxis exacta del sufijo y del resultado, que no está implementada. Se implementan en orden de matriz, después de B-23.

- **D15. Regla acotada AS-B-20 (Lite):** `quarticBiquadraticCandidate` reconoce solo `a^4 + a^2 b^2 + b^4` (tres términos, dos variables distintas de una letra, coeficientes 1). Se acepta solo si el CAS confirma equivalencia y Algebrite devolvió el resultado sin factorizar. **No es un factorizador multivariable general** y no se generaliza a otras formas sin nueva decisión. Plus no tiene regla propia (SymPy).

- **D16. Alcance AS-B-21 (decidido por el usuario):** primero prueba test-first sin cambio de producto (opción A). Si falla en Lite, se amplía el respaldo Kronecker a resultados equivalentes sin factorizar (opción B), solo para polinomios univariados enteros, con al menos dos factores y sin tocar AS-B-22 ni AS-B-23. La opción C (regla acotada de diferencia de cuadrados) queda descartada salvo nueva decisión. Plus no cambia (SymPy).

- **D17. Salvaguarda de diferencia de cuadrados (Lite, decidida por el usuario):** regla acotada `differenceOfSquaresCandidate` para `(P)^2 - K·v^2` con K cuadrado perfecto. Solo reemplaza un resultado de Algebrite sin paréntesis y solo si el CAS confirma equivalencia. Regresiones: `x^2+1` y `x^2-2` no coinciden con la regla. No es un factorizador general. Plus no cambia (SymPy). Commits Lite `bda4c99` (regla) y `d7cf042` (pruebas).

- **D18. Forma canónica de la salvaguarda de diferencia de cuadrados (Lite, decidida por el usuario):** la salida de `(P)² − K·v²` se factoriza con Kronecker sobre P−Q y P+Q, agrupa potencias y se verifica con CAS. Para AS-B-21 la salida es `(x-1)^2*(x+1)^2`. Si algún factor no es decidible, o si el CAS no confirma, se conserva la salida de dos cuadráticos. Multivariable no entra en la factorización. Plus no cambia. Commits Lite `e2c0e58` (código y pruebas) y `620cd49` (regresiones).

- **D19. Excepciones y resultados no concluyentes del CAS en la diferencia de cuadrados (Lite, decidida por el usuario):** un fallo del CAS en el paso factorizado (excepción o respuesta no concluyente, incluido el muestreo de factores) no omite la verificación del candidato de dos cuadráticos. El candidato se devuelve solo si el CAS confirma `(candidato)-(entrada)` igual a `0`. Si esa verificación no concluye o lanza una excepción, se devuelve el resultado original; nunca un candidato sin verificar. Commit Lite `3a6c8ac53bbfea656ff74e248a52e828d93c8b88` (código y pruebas). Plus no cambia.

- **D20. Gates en cada commit documental (decidida por el usuario, 2026-10-20).** Cada commit que cambie solo documentación se valida con los tres gates (cumulative, h1d y scientific-ui) mediante `workflow_dispatch` sobre la rama, con un `reason` que cite el SHA. Los workflows excluyen `.md` y `qa/certification/continuity.json`, así que no se disparan solos. Un commit documental no reclama gates hasta tener runs con `head_sha` igual a su SHA. El registro de resultados de un commit gated se escribe en el commit documental siguiente, que también se gatea. Los gates de código siguen disparándose por push. Supera la observación de process de r193.

## Decisiones pendientes (no implementar sin nueva decisión)

- **P1.** Enfoque para AS-B-19 a AS-B-21 (factor común, agrupación y diferencia de cuadrados multivariables). Primero se escriben las pruebas y se observa qué falla. No se añade un factorizador multivariable general. AS-B-19 pasó sin cambios; AS-B-20 se resolvió con la regla acotada D15. AS-B-21 se resolvió con D16–D18.
- **P2.** Familia de factorización de enteros (AS-B-26 a AS-B-29). Propuesta: familia propia, sin decidir todavía.
- **P3.** Generalización de `a^n ± b^n` más allá de cubos. Sin decidir.

## Alcance AS-B-21 (histórico; resuelto por D16–D18)

**Estado (2026-10-20, revisión 191).** Cerrado. D16 eligió «A y luego B». AS-B-21 pasó test-first sin cambio de producto (Lite `4636c99`). El respaldo B no se activó. La salvaguarda de diferencia de cuadrados se añadió como D17 (`bda4c99`), y la forma canónica `(x-1)^2*(x+1)^2` como D18 (`e2c0e58`, `620cd49`). Lo que sigue es el registro de la decisión, no pendientes.

**Caso.** AS-B-21 `(x²+1)² − 4x²` → `(x−1)²(x+1)²` (fila N3). Es una diferencia de cuadrados, A² − B² con A = x²+1 y B = 2x, y (x²+1−2x)(x²+1+2x) = (x−1)²(x+1)². Expandido es el polinomio univariado entero `x⁴ − 2x² + 1`.

**Hallazgo en Lite (`verifyFactorResult`, `src/engine/polynomialFactorZ.ts`).** El respaldo Kronecker de AS-B-07 reemplaza el resultado de Algebrite solo cuando ese resultado NO es equivalente al original (`if (equivalent(result)) return result;`). Si Algebrite devuelve una forma equivalente pero sin factorizar, el respaldo no se ejecuta. Es el mismo patrón que bloqueó AS-B-20. No hay evidencia de que Algebrite factorice AS-B-21; eso lo decide la prueba test-first.

**Opciones.**

| Opción | Qué cambia | Alcance | Riesgo | Lectura |
|---|---|---|---|---|
| A. Test-first sin cambio de producto | Solo `tests/algebra229AsB21.audit.test.ts` y `backend/tests/test_algebra229_as_b21.py` | Ninguno | Probablemente falle en Lite, como AS-B-20 | Paso previo en cualquier caso; cuesta poco y decide entre B y C |
| B. Respaldo Kronecker también para resultados equivalentes sin factorizar | `verifyFactorResult` usa `factorUnivariateIntegerText` cuando el resultado de Algebrite es equivalente pero sin producto de factores | Todo polinomio univariado entero de grado ≤ 10 | Cambia salidas de otras filas; exige regresión completa de gates | Ataca la causa y reutiliza código ya verificado. Requiere guardas: al menos dos factores de grado ≥ 1, y no tocar irreducibles (AS-B-22, AS-B-23) |
| C. Regla acotada de diferencia de cuadrados | Nuevo reconocedor para la forma sintáctica `(A)^2 − K·x^2` (K cuadrado perfecto) que se acepta solo si el CAS verifica equivalencia | Solo esa forma | Otra regla de forma, como D15 | Es el cambio más pequeño si el objetivo es solo AS-B-21 |

**Guardas comunes para B o C.** AS-B-22 (`x²+1`) y AS-B-23 (`x²−2`) deben quedar idénticas (D10). Las filas AS-B-18 a AS-B-20 no deben cambiar. Si la prueba exige la forma literal `(x−1)²(x+1)²` y no solo equivalencia verificada, hay que decidir la normalización de potencias repetidas antes de implementar.

**Lectura de Plus.** Plus usa SymPy (D9). Se espera que AS-B-21 pase sin cambios de producto, como AS-B-20, y se confirmará con la prueba test-first.

**Recomendación.** Ejecutar A primero. Si falla, elegir B: corrige la causa general del respaldo y no añade otra regla de forma. Elegir C solo si se quiere el cambio más estrecho posible. Ninguna opción se implementa hasta registrar la decisión del usuario en este archivo (D16).

## Bloqueos abiertos (no reclasificar sin registro)

SG28 (`test_cpu_budget_exhaustion_reaps_child_and_recovers`, carrera de temporización), S25, SY-P-23, SY-X-04-PLUS-HTTP, y los timeouts bajo carga de AS-FAC-08/09. Global de la certificación: OPEN.

## Protocolo con el usuario

- **D12.** Un objetivo por respuesta, salvo que el usuario pida continuar con varios.
- **D13.** Si el usuario indica «ya corrió», se verifican los gates en GitHub antes de avanzar.
- **D14.** Las respuestas al usuario van en español.
