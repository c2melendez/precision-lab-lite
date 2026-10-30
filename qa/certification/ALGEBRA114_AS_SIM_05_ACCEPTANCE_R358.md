# Algebra 114 — aceptación acotada AS-SIM-05 (r358)

**Estado:** PASS_SCOPED — Lite únicamente. No certifica la sección completa ni implica paridad con Plus.

## Caso y condición de dominio

Fuente normativa: `qa/certification/algebra114_source.md`, fila AS-SIM-05:

`(x^2 - 1)/(x - 1) = x + 1`, con `x != 1`.

Test: `tests/algebra114AsSim05.audit.test.ts`, blob SHA `d3ad970124d9f8362ae5ea0c4381dd334bfe43ea`.

- Verifica que la fila original permanezca en la fuente.
- Extrae del denominador original la condición `x - 1 != 0`.
- Comprueba cinco sustituciones permitidas (-4, -1, 0, 2, 5) contra el oráculo aritmético independiente `x + 1`.
- Comprueba que `x = 1` siga rechazado por la expresión original; la cancelación no se usa para reintroducir el punto excluido.

## Evidencia exacta

SHA técnico: `4abfe22293d5088e40d27a72568d5f4e93197f10`.

- CI [41136809596](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809596): SUCCESS.
- Cumulative [41136809590](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809590): SUCCESS; Vitest 366 archivos, 2,259 passed, 8 expected fail, 34 todo. El log confirma `algebra114AsSim05.audit.test.ts`.
- H1d [41136809678](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809678): SUCCESS.
- Scientific UI [41136809673](https://github.com/c2melendez/precision-lab-lite/actions/runs/41136809673): ejecución separada aún en curso al corte; no se usa como evidencia de este caso algebraico.

## Decisión y continuidad

PASS_SCOPED solo para esta simplificación y la preservación estructural de su restricción de dominio. No certifica todas las filas AS-SIM ni Algebra114 completa.

Siguiente: auditar los oráculos de expansión existentes, empezando por AS-EXP-01. Las pruebas actuales comparan en varios casos una salida de Algebrite contra un esperado también evaluado por Algebrite; no asumir independencia del oráculo por la mera existencia de los archivos.

Global certification: OPEN.
