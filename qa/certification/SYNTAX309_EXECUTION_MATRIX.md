# Syntax 309 — Matriz de ejecución y trazabilidad (inicio)

Estado: **PREPARACIÓN / NO CERTIFICADO**. Fecha: 2026-10-11. Repositorios: Lite + Plus. Rama canónica: `qa/syntax-audit-in625-a1`.

## Fuente y fidelidad
Matriz de estrés **`matriz_sintaxis_entrada.md`**, 309 ejercicios oficiales. Fixture canónico `qa/certification/syntax309_cases.jsonl` leído y comparado en ambos repositorios el 2026-10-16: contenido idéntico, 309 filas, N1=104/N2=183/N3=22. El fixture versionado es la fuente de entradas/esperados; no inferirlos desde este índice.

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
Consultar CURRENT_STATE.md y los últimos runs del SHA técnico para el caso activo. La incorporación inicial del fixture ya está superada; el historial de alcances, fallos y evidencia vive en EXECUTION_LOG.md. Mantener abiertos los gaps por canal y la reconciliación global.


## SY-P-23 — Decisión de convención propuesta para revisión bilateral (2026-10-12)

**Fuente canónica:** fixture `syntax309_sy_p_cases.jsonl`, entrada `a/bc`, clase `convencion`; contempla `ac/b` o `a/(bc)` y exige declarar la interpretación. Esta entrada NO autoriza inferir una multiplicación implícita única sin un contrato visible.

**Comportamiento comprobado en Plus (no confundir con convenio bilateral aprobado):**
- Si `bc` está declarado como identificador compuesto, `a/bc` significa `a/(bc)`; las sustituciones `b` y `c` no cambian el valor de `bc`.
- `(a/b)*c` y `a/(b*c)` son expresiones explícitas, semánticamente distinguibles, incluso dentro de expresiones compuestas.
- La UI de Plus advierte sobre `a/bc` y bloquea el POST si `bc` no está declarada; Lite presenta una advertencia informativa. La divergencia NO constituye paridad de evaluación.
- La alternativa `(a/b)*c` sin `bc` definida conserva su XFAIL estricto en `backend/tests/test_syntax309_syp_interpretation.py`: no convertirlo en PASS por el éxito de la lectura de identificador nombrado.

**Regla de cierre pendiente:** documentar una convención general y visible para identificadores concatenados y división en línea, decidir expresamente si se admite la lectura `ac/b` y armonizar advertencia/bloqueo entre los canales autorizados de Lite y Plus. Exigir pruebas de canal UI/API, símbolos declarados/no declarados, lectura agrupada y oráculo numérico. No cambiar silenciosamente el parser ni borrar XFAIL. Estado: **OPEN — decisión de contrato bilateral pendiente**, no certificación integral.

## SY-P — Política de frontera de identificadores y división (2026-10-12)

Esta política **no reemplaza el fixture original** ni declara completado SY-P-23. Distingue expectativas que tienen evidencia de las que siguen sin contrato general:

1. **SY-P-24 y SY-P-25 son obligatorios e independientes:** `xy` se interpreta como `x*y` y `xyz` como `x*y*z` en sus casos originales. No generalizar desde `bc` para transformar estos productos prescritos en símbolos atómicos. La cobertura HTTP Plus de estos ID usa sustituciones numéricas; falta contrastar todos los canales.
2. **SY-P-23 con `bc` declarada:** el endpoint Plus interpreta `a/bc` como `a/(bc)`, donde `bc` es símbolo nombrado e independiente de `b*c`. Evidencias actuales en `backend/tests/test_syntax309_syp_interpretation.py`. Esto no demuestra una regla global para toda cadena de letras ni paridad con Lite.
3. **SY-P-23 sin `bc` declarada:** la ruta UI actual evita evaluación silenciosa, exige agrupación explícita e informa de `(a/b)*c` y `a/(b*c)`; preservar el valor de MathLive. **No atribuir el valor 8 o 2 a la entrada ambigua.** El XFAIL estricto del backend Plus para lectura separada de `b,c` continúa pendiente.
4. **Alternativa fuente `ac/b`:** permanece literalmente en el fixture como alternativa de convención. No se asume equivalente a `(a/b)*c` en general (sería `(a*c)/b`, y solo coincide en álgebra conmutativa cuando hay condiciones adecuadas). Hasta declarar la semántica de tokens y dominios por canal, no se certifica esa alternativa.
5. **SY-P-21 `1/2x` y SY-P-18/19:** deben evaluarse como casos separados de convención de precedencia; SY-P-23 no decide sus lecturas. Para un resultado no ambiguo el usuario dispone de paréntesis explícitos.

**Criterio para levantar el bloqueo:** probar la misma convención ante variables declaradas y no declaradas en Lite/Plus, distinguir el parser de la política UI, acreditar oráculo numérico y eco/advertencia por canal, y conservar el fixture original inalterado. No borrar un XFAIL hasta que una implementación probada satisfaga expresamente su esperado. SG28 multihost sigue BLOCKED.
