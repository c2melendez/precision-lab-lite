# Prompt de continuidad — Precision Lab S26/B7 (2026-10-02)

Continúa Precision Lab con la misma dinámica de trabajo de la sesión anterior: **revisar GitHub, ejecutar/leer gates reales, corregir causas generales, esperar la corrida cuando sea necesario, analizar resultados y continuar sin pedir confirmación para pasos obvios**.

## Primero
1. Lee `qa/s26/HANDOFF_2026-10-02.md`.
2. Lee `README.md`, `LOG.md`, `qa/s26/ROADMAP.md`, `qa/s26/MATHEMATICAL_INTEGRITY_POLICY.md` y `qa/s26/VISUAL_MATRIX.md`.
3. Verifica los HEAD reales de `main` en Lite y Plus y los últimos GitHub Actions. No asumas que los SHA del handoff siguen siendo los actuales.
4. Mantén ambos motores en alcance. No conviertas la sesión en Lite-only o Plus-only.
5. Si una corrida está pendiente, no acumules commits innecesarios que la cancelen/reinicien; primero recoge la evidencia.

## Estado funcional a preservar
- Resultado contextual: Original/interpretado + variantes solo si aplican.
- Simplificar/factorizar/expandir/resolver nunca elimina dominio/restricciones del original.
- Huecos removibles se representan como círculos abiertos; no confundir con asíntotas.
- Plus: pasos detallados opcionales y cerrados por defecto, también tras Reusar.
- Complejos: binomial/polar/trig/exponencial cuando aplica.
- DD/DMS: si el resultado es angular, solo mostrar formatos angulares pertinentes.
- Teclado autoritativo de 7 familias; Simplificar y Factorizar ya existen en ambos motores.

## Campaña QA
Orden recomendado para la campaña funcional de producto: Sintaxis → Álgebra simbólica → Trig → Log/Exp/Rad → Cálculo → EDO → Complejos → Matrices/Vectores → Graficación, con recertificación transversal tras correcciones. Si se ejecuta el sistema de certificación v0.3, su orden formal es `01_ACTIVE_SYSTEM/Precision_Lab_Certification_System_v0_3/governance/matrix_execution_order.yaml`; ese contrato prevalece para esa suite.

## Fuentes de matrices: rutas corregidas y trazabilidad
No busques las fuentes con el prefijo histórico `MATRICES/` dentro de este paquete activo: las nueve matrices de `Matrices.zip` están congeladas, byte por byte, bajo `01_ACTIVE_SYSTEM/Precision_Lab_Certification_System_v0_3/legacy_sources/`. Los JSONL canónicos para ejecución están bajo `cases/`; los JSONL importados en `migration/imported/` son evidencia raw inmutable. Consulta `SOURCE_INVENTORY.md`, `migration/legacy_source_manifest.json` y `migration/MATRIX_SOURCE_CROSSWALK.md` antes de declarar ausente una matriz.

| Fuente original de `Matrices.zip` | Fuente congelada en v0.3 | JSONL canónico de ejecución |
|---|---|---|
| `matriz_entrada_sintaxis_calculadora.md` (IN625, 625) | `legacy_sources/matriz_entrada_sintaxis_calculadora(2).md` | `cases/input_syntax/input_syntax_625_promoted_v1.jsonl` |
| `matriz_sintaxis_entrada.md` (IN309, 309) | `legacy_sources/matriz_sintaxis_entrada(2).md` | `cases/input_syntax/input_syntax_309_promoted_v1.jsonl` |
| `Matriz de estrés — Álgebra simbólica.md` (AS114, 114) | `legacy_sources/Matriz de estrés — Álgebra simbólica(1).md` | `cases/algebra/algebra_114_promoted_v1.jsonl` (111 casos propios; 3 alias absorbidos por AS229) |
| `matriz_algebra_simbolica.md` (AS229, 229) | `legacy_sources/matriz_algebra_simbolica.md` | `cases/algebra/algebra_229_promoted_v1.jsonl` |
| `ejercicios_trigonometria_calculadora.md` (TR324, 324) | `legacy_sources/ejercicios_trigonometria_calculadora(4).md` | `cases/trigonometry/trigonometry_promoted_v1.jsonl` |
| `matriz_log_exp_radicales_calculadora.md` (TE540, 540) | `legacy_sources/matriz_log_exp_radicales_calculadora(2).md` | `cases/transcendental/transcendental_promoted_v1.jsonl` |
| `matriz_matrices_vectores.md` (MV153, 153) | `legacy_sources/matriz_matrices_vectores.md` | `cases/matrices_vectors/matrices_vectors_promoted_v1.jsonl` |
| `matriz_edo_variable_compleja_calculadora.md` (EDCX638, 638) | `legacy_sources/matriz_edo_variable_compleja_calculadora(2).md` | `cases/ode_complex/ode_complex_promoted_v1.jsonl` |
| `matriz_graficacion_calculadora.md` (GR519, 519) | `legacy_sources/matriz_graficacion_calculadora(2).md` | `cases/graphing/graphing_promoted_v1.jsonl` |

Los nueve archivos fuente originales coinciden por SHA-256 con sus fuentes congeladas. Los conjuntos raw y promovidos representan los 3.451 IDs de origen; AS114 conserva 114 en raw y 111 casos canónicos propios, con tres alias trazados hacia AS229. No reconstruyas las matrices ni dupliques esos alias.

El PDF `identidades_trigonometricas_completo.pdf` no forma parte de los nueve Markdown de `Matrices.zip`. Se recuperó byte por byte del ZIP histórico anidado `99_HISTORICAL_ARCHIVE/Precision_Lab_HANDOFF_COMPLETO_2026-10-02(2).zip` (ruta interna `Precision_Lab_HANDOFF_COMPLETO_2026-10-02/matrices/identidades_trigonometricas_completo.pdf`) y se restauró en el handoff corregido como `REFERENCE/identidades_trigonometricas_completo.pdf`, SHA-256 `a14bf8dff13eeae993947a57e47257413f96073393030afd7acdd24910caaba2`. Esa ruta es relativa al ZIP corregido, no a la raíz del repositorio Lite/Plus.

No hardcodees soluciones por ID de prueba. Cada hallazgo debe convertirse en regla general + regression test.

## Próximo paso
Empieza verificando el estado real de los workflows del HEAD actual. Después continúa el bloque de resultado contextual/restricciones o, si ya está verde y cerrado, construye el runner de Sintaxis en ambos motores para establecer el nuevo baseline antes de seguir corrigiendo familias matemáticas.
