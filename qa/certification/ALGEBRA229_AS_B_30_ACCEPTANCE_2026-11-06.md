# Algebra229 AS-B-30 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-B-30, N3, `valor`: `\text{¿es primo }1000000007?` → `sí, es primo`.
- Lite: `tests/algebra229AsB30.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; respuesta exacta de la pregunta congelada; oráculo independiente por división de prueba que confirma 1000000007 primo y rechaza el control compuesto 1000000008; casos límite `primo(2)` y `primo(1)`.
- Plus (par bilateral): `backend/tests/test_algebra229_as_b30.py`, 3/3 tests: fila congelada; `POST /api/v1/evaluate` real con `result_text` exacto y `result_type=boolean`; oráculo independiente y control compuesto.

## Implementación
- Lite: `src/engine/primality.ts` reconoce solo la forma LaTeX congelada y la forma funcional `primo(n)`/`esprimo(n)`; responde con Miller-Rabin determinista de 64 bits en `BigInt` (testigos 2..37, exacto para todo `n <= 2^64-1`). `evaluate()` invoca la capacidad antes del motor simbólico únicamente para esas dos formas.
- Plus: `backend/app/services/primality.py` implementa la misma capacidad y el router serializa `ResultType.BOOLEAN` sin `simplify()`.
- Alcance declarado: capacidad acotada de primalidad, no un intérprete general de lenguaje natural. El resto de entradas sigue el parser normal.

## Evidencia Lite — SHA `99bbc9bc17b79d00c45299415b5f9d63a9d09c36`
- Cumulative [42329909267](https://github.com/c2melendez/precision-lab-lite/actions/runs/42329909267) SUCCESS; focal B30 4/4; 367 archivos, 2,271 passed, 8 expected fail, 34 TODO; guard `skip=false`.
- H1d [42329909190](https://github.com/c2melendez/precision-lab-lite/actions/runs/42329909190) SUCCESS; 22/22 Playwright.
- Scientific UI [42329909206](https://github.com/c2melendez/precision-lab-lite/actions/runs/42329909206) SUCCESS; 456/456 desktop/tablet/mobile.
- CI [42329909188](https://github.com/c2melendez/precision-lab-lite/actions/runs/42329909188) SUCCESS.
- Runner [42329909192](https://github.com/c2melendez/precision-lab-lite/actions/runs/42329909192) SUCCESS.

## Evidencia Plus (par bilateral) — SHA `a831d31d5bc13193e470949eb8efb06cc4527533`
- Cumulative [42329897688](https://github.com/c2melendez/precision-lab-plus/actions/runs/42329897688) SUCCESS; backend y frontend SUCCESS; focal B30 3/3; guard `skip=false`.
- CI [42329897714](https://github.com/c2melendez/precision-lab-plus/actions/runs/42329897714) SUCCESS; 2,811 passed, 1 skipped, 10 xfailed; cobertura 88.89%.
- H1d [42329897684](https://github.com/c2melendez/precision-lab-plus/actions/runs/42329897684) SUCCESS; 38/38 Playwright.
- Runner [42329897649](https://github.com/c2melendez/precision-lab-plus/actions/runs/42329897649) SUCCESS.

## Diagnóstico y clasificación
- Antes del cambio, `POST /api/v1/evaluate` en Plus devolvía `PARSE_ERROR` para la entrada congelada: gap real de **capability**, no fallo de harness ni de oráculo.
- Se corrigió la capa de producto (parser acotado + primalidad determinista) y se añadieron regresiones permanentes en ambos repositorios. No se relajó ningún oráculo matemático.
- El gate de seguridad de Plus sigue siendo un frente independiente (S25) y no se usa como evidencia de este bloque. SG28/H2/DIST permanece abierto. Global **OPEN**.

Siguiente: AS-C-01, N1, `simplificar` — `\frac{x^{2}-1}{x-1}` → `x + 1`, válido para `x \neq 1`. Test-first bilateral con fila congelada, simplificación exacta, equivalencia simbólica fuera del punto excluido y control de dominio en `x=1`.
