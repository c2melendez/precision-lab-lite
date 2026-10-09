# IN625 H2 — Seguridad y límites (matriz de procedencia)

Fuente primaria: archivo de proyecto `matriz_entrada_sintaxis_calculadora.md`, sección "H.2 Seguridad y límites", filas EN-SG-01..32, líneas 864–900 de la copia recuperada de la biblioteca del proyecto (2026-10-02). La enumeración y expectativas se conservan por referencia, sin sustituir la matriz de origen.

## Alcance y casos

| ID | Nivel | Categoría y criterio abreviado |
|---|---|---|
| EN-SG-01 | N1 | HTML script: entrada inválida, escape, sin ejecución |
| EN-SG-02 | N1 | HTML image event: igual que anterior |
| EN-SG-03 | N2 | Texto matemático que contiene HTML: render literal |
| EN-SG-04 | N2 | Hipervínculo LaTeX inseguro: sin enlace ejecutable |
| EN-SG-05 | N2 | Macros de URL, imagen y HTML: bloqueo con error |
| EN-SG-06 | N2 | Definición recursiva de macro: error y respuesta UI |
| EN-SG-07 | N2 | Nuevos macros, alias y catcode: error |
| EN-SG-08 | N2 | Macros de archivos y shell: nunca abrir archivos; error |
| EN-SG-09 | N3 | Introspección y ejecución Python: rechazo sin evaluación |
| EN-SG-10 | N3 | Lectura de archivo Python: rechazo sin evaluación |
| EN-SG-11 | N3 | Introspección de clases Python: rechazo sin evaluación |
| EN-SG-12 | N3 | Lambda Python: rechazo sin evaluación |
| EN-SG-13 | N3 | exec/eval Python: rechazo sin evaluación |
| EN-SG-14 | N3 | import os/os.system: rechazo sin evaluación |
| EN-SG-15 | N3 | Atributos Python con doble subrayado: rechazo |
| EN-SG-16 | N3 | Constructores del motor: rechazo o literal |
| EN-SG-17 | N2 | Aislamiento de estado de asignación entre llamadas |
| EN-SG-18 | N3 | Palabras reservadas motor: no ejecutar órdenes |
| EN-SG-19 | N2 | 50 paréntesis: resultado 1 |
| EN-SG-20 | N3 | 1000 paréntesis: error controlado de profundidad |
| EN-SG-21 | N3 | Suma de 10 000 términos: 10000 en menos de 2 s |
| EN-SG-22 | N3 | Entrada ~100 000 caracteres: no bloqueo o rechazo |
| EN-SG-23 | N3 | Torre exponencial 10^(10^10): simbólico o error |
| EN-SG-24 | N3 | Potencia 9^(9^9): simbólico o error |
| EN-SG-25 | N3 | Factorial 1 000 000: límite/cancelación clara |
| EN-SG-26 | N3 | Expansión (x+1)^10000: límite/cancelación |
| EN-SG-27 | N3 | Potencias anidadas de 2: exactitud o límite claro |
| EN-SG-28 | N3 | Detener durante cálculo largo, recuperación |
| EN-SG-29 | N3 | Concurrencia de 20 cálculos y última entrada |
| EN-SG-30 | N3 | JSON API Plus con caracteres especiales |
| EN-SG-31 | N3 | Solicitud 5 MB: respuesta 413, sin caída |
| EN-SG-32 | N3 | Ráfaga de solicitudes con rate limit condicional |

## Puerta de seguridad de ejecución

- **No ejecutar directamente cargas extremas, ráfagas o pruebas de ejecución dinámica en servicios de producción.** Usar entorno aislado local/CI, límites estrictos de memoria, tiempo y proceso, y pruebas de rechazo sin evaluar las cargas.
- N1/N2 ligeros: parser y renderización; N3 seguridad: comprobaciones negativas seguras y aislamiento.
- EN-SG-28/29: Playwright/worker en entorno controlado.
- EN-SG-30/31/32: solo Plus API con entorno de test, sin asumir paridad artificial con Lite.
- Esta matriz es un inventario, **no resultados PASS**. Registrar por caso PASS, FAIL, GAP, SKIP justificado y evidencia.

## Fuente canónica

La tabla original de la Parte H.2 en la biblioteca del proyecto conserva entradas literales y expectativas completas. La transcripción abreviada aquí es una referencia operativa: antes de escribir un test de cada caso consultar siempre la fila original. Bloque H2 no ejecutado.
