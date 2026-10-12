# Syntax 309 — Matriz de ejecución y trazabilidad (inicio)

Estado: **PREPARACIÓN / NO CERTIFICADO**. Fecha: 2026-10-11. Repositorios: Lite + Plus. Rama canónica: `qa/syntax-audit-in625-a1`.

## Fuente y fidelidad
Matriz de estrés **`matriz_sintaxis_entrada.md`**, 309 ejercicios oficiales: N1 104; N2 183; N3 22. El contenido completo existe en biblioteca del proyecto; aún no hay un fixture JSONL canónico versionado y verificado en ambos repositorios. **No inferir ni inventar entradas/esperados** a partir de este índice. El `matrices_ejecutables.jsonl` mencionado en la matriz no se ha verificado en GitHub.

## Inventario de bloques (309 filas)
| Orden | Sección | Casos |
| --- | --- | ---: |
| 1 | SY-P · Multiplicación implícita y precedencia | 33 |
| 2 | SY-F · Funciones, argumentos y potencias | 48 |
| 3 | SY-E · Exponentes, fracciones y radicales | 31 |
| 4 | SY-N · Números, constantes, precisión y formato | 31 |
| 5 | SY-D · Delimitadores y paréntesis | 14 |
| 6 | SY-U · Operadores, espacios y Unicode | 25 |
| 7 | SY-V · Variables, símbolos y cálculo | 28 |
| 8 | SY-Q · Ecuaciones, sistemas y desigualdades | 23 |
| 9 | SY-M · Matrices y vectores | 20 |
| 10 | SY-S · Alias y notación en español | 20 |
| 11 | SY-R · Reingreso/ida y vuelta | 14 |
| 12 | SY-X · Entradas hostiles y estrés | 22 |
| **Total** | | **309** |

## Oráculos oficiales
- `numerica_o_exacta`: exactitud racional/entera, o tolerancia relativa 1e-9 para valores no exactos.
- `equivalencia_simbolica`: diferencia que simplifica a cero o muestreo matemático válido.
- `forma_factorizada`: equivalencia y estructura factorizada.
- `conjunto_solucion`: misma solución independientemente de orden o parámetro.
- `conjunto_salvo_escalares`: multiplicidad y vectores propios hasta escala.
- `estructura`: interpretación/eco correcto, no solo número.
- `convencion_declarada`: lectura válida solo si está visible/declarada.
- `aviso_de_error`: mensaje claro, sin valor inventado ni ejecución de código.

## Protocolo de incorporación verificable
1. Recuperar fuente completa, preservar cada ID `SY-*`, entrada, nivel, comparación, esperado y comentario; versionar fixture de solo datos para Lite y Plus con conteo **309**, ID único y distribución 104/183/22. Validar conteo antes de cualquier ejecución.
2. Primero SY-P (33 filas): agrupar deterministas, eco/estructura, convención/error y canales, con expectativa oficial por ID; comparación por capa (parser/MathLive/UI o API), sin equivalencias textuales espurias.
3. Instrumentar reportes por motor con `PASS/FAIL/BLOCKED/MANUAL`, ID, versión SHA, canal, oráculo, archivos de regresión y enlace de job/run. Clasificar diferencias de paridad.
4. Ejecutar gates focalizados y acumulativos en el **mismo SHA técnico**. Repetir el ciclo de corrección por sección hasta 309/309 clasificados; no contar TODO como PASS.
5. Seguridad SY-X exclusivamente en CI/local aislado, con límites estrictos, nunca producción. No ejecutar payloads directamente fuera del parser controlado.

## Dependencia de orden
IN625 H2/SG28 permanece OPEN por DIST-01..08 BLOCKED en topología multinodo autorizada; trabajo independiente de preparación Syntax 309 permitido, pero **no declarar cierre de IN625 ni certificación integral de Syntax 309** antes de resolver dependencias contractuales. No activar Render ni `SG28_EVALUATE_ISOLATION`.

## Próximo paso ejecutable
Materializar el JSONL original completo y publicar su hash/conteo; construir gate de integridad y lote SY-P sobre los 33 casos originales en ambos repositorios; ejecutar CI y registrar por ID y SHA. Si no está disponible el JSONL, extraer fielmente de la matriz Markdown sin completar expectativas con suposiciones.


## SY-P-23 — Decisión de convención propuesta para revisión bilateral (2026-10-12)

**Fuente canónica:** fixture `syntax309_sy_p_cases.jsonl`, entrada `a/bc`, clase `convencion`; contempla `ac/b` o `a/(bc)` y exige declarar la interpretación. Esta entrada NO autoriza inferir una multiplicación implícita única sin un contrato visible.

**Comportamiento comprobado en Plus (no confundir con convenio bilateral aprobado):**
- Si `bc` está declarado como identificador compuesto, `a/bc` significa `a/(bc)`; las sustituciones `b` y `c` no cambian el valor de `bc`.
- `(a/b)*c` y `a/(b*c)` son expresiones explícitas, semánticamente distinguibles, incluso dentro de expresiones compuestas.
- La UI de Plus advierte sobre `a/bc` y bloquea el POST si `bc` no está declarada; Lite presenta una advertencia informativa. La divergencia NO constituye paridad de evaluación.
- La alternativa `(a/b)*c` sin `bc` definida conserva su XFAIL estricto en `backend/tests/test_syntax309_syp_interpretation.py`: no convertirlo en PASS por el éxito de la lectura de identificador nombrado.

**Regla de cierre pendiente:** documentar una convención general y visible para identificadores concatenados y división en línea, decidir expresamente si se admite la lectura `ac/b` y armonizar advertencia/bloqueo entre los canales autorizados de Lite y Plus. Exigir pruebas de canal UI/API, símbolos declarados/no declarados, lectura agrupada y oráculo numérico. No cambiar silenciosamente el parser ni borrar XFAIL. Estado: **OPEN — decisión de contrato bilateral pendiente**, no certificación integral.
