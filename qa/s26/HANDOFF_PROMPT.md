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
Orden recomendado: Sintaxis → Álgebra simbólica → Trig → Log/Exp/Rad → Cálculo → EDO → Complejos → Matrices/Vectores → Graficación, con recertificación transversal tras correcciones.

Archivos de matriz incluidos en el paquete portátil:
- `MATRICES/ejercicios_trigonometria_calculadora(2).md`
- `MATRICES/matriz_log_exp_radicales_calculadora.md`
- `MATRICES/matriz_edo_variable_compleja_calculadora.md`
- `MATRICES/matriz_graficacion_calculadora.md`
- `MATRICES/matriz_entrada_sintaxis_calculadora.md`
- `MATRICES/matriz_sintaxis_entrada.md`
- `MATRICES/matriz_algebra_simbolica(1).md`
- `MATRICES/matriz_matrices_vectores.md`
- `REFERENCE/identidades_trigonometricas_completo.pdf`

No hardcodees soluciones por ID de prueba. Cada hallazgo debe convertirse en regla general + regression test.

## Próximo paso
Empieza verificando el estado real de los workflows del HEAD actual. Después continúa el bloque de resultado contextual/restricciones o, si ya está verde y cerrado, construye el runner de Sintaxis en ambos motores para establecer el nuevo baseline antes de seguir corrigiendo familias matemáticas.
