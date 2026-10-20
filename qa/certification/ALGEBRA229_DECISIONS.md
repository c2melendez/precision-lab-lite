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

## Decisiones pendientes (no implementar sin nueva decisión)

- **P1.** Enfoque para AS-B-19 a AS-B-21 (factor común, agrupación y diferencia de cuadrados multivariables). Primero se escriben las pruebas y se observa qué falla. No se añade un factorizador multivariable general. AS-B-19 pasó sin cambios; AS-B-20 se resolvió con la regla acotada D15.
- **P2.** Familia de factorización de enteros (AS-B-26 a AS-B-29). Propuesta: familia propia, sin decidir todavía.
- **P3.** Generalización de `a^n ± b^n` más allá de cubos. Sin decidir.

## Bloqueos abiertos (no reclasificar sin registro)

SG28 (`test_cpu_budget_exhaustion_reaps_child_and_recovers`, carrera de temporización), S25, SY-P-23, SY-X-04-PLUS-HTTP, y los timeouts bajo carga de AS-FAC-08/09. Global de la certificación: OPEN.

## Protocolo con el usuario

- **D12.** Un objetivo por respuesta, salvo que el usuario pida continuar con varios.
- **D13.** Si el usuario indica «ya corrió», se verifican los gates en GitHub antes de avanzar.
- **D14.** Las respuestas al usuario van en español.
