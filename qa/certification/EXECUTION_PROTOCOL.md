# Execution Protocol — Precision Lab Certification

## Objetivo
Certificar Lite y Plus con evidencia reproducible, acumulativa y comparable, separando fallos reales de producto de fallos de harness/oráculo.

## Reglas obligatorias
- Ejecutar y cerrar los bloques en orden.
- Diagnosticar raíz antes de modificar producto.
- Un fallo de serialización equivalente de MathLive no es un fallo matemático.
- Un fallo de harness/oráculo no autoriza cambios al motor.
- Toda corrección debe quedar cubierta por regresión permanente.
- Comparar Lite y Plus; evitar divergir contratos salvo diferencia intencional documentada.
- GitHub Actions es la evidencia principal de ejecución.
- No bloquear IN625 por deuda independiente de S25/security/npm/mutation/CI salvo regresión causada por el cambio actual.
- No declarar certificación global por pruebas estructurales.
- Casos dependientes de SO/hardware se registran como manual/capability; no se simula soporte que Playwright no puede demostrar.
- Si una matriz posterior descubre una fuga de sintaxis anterior, agregar caso permanente al contrato y recertificar el subbloque afectado.
- No usar chat, ZIP o handoff histórico como autoridad cuando `qa/certification/` contiene el estado aplicable.

## IN625 — orden
A1 → A2 → A3 → A4 → B1 → B2 → B3 → B4 → C1 → C2 → C3 → C4 → D1 → D2 → D3 → E1a → E1b → E1c → E1d → E2a → E2b → E2c → E3a → E3b → E3c → E3d1 → E3d2 → E3d3 → F1 → F2a → F2b → F3a → F3b → F3c → G1a/G1b → G2 → G3 → H1 → H2.

## Después de IN625
Syntax 309 → Algebra 114 → Algebra 229 → Trigonometría → Log/Exp/Radicales → Matrices/Vectores → EDO/Complejos → Gráficas → reconciliación/paridad final.

## Política de cambios
1. Reproducir.
2. Clasificar: producto / harness / oráculo / capability.
3. Corregir la capa correcta.
4. Ejecutar el bloque.
5. Ejecutar gate acumulativo relevante.
6. Registrar commit, run, evidencia y decisión en `CURRENT_STATE.md`.
7. Añadir una entrada acumulativa a `EXECUTION_LOG.md`.
8. Sincronizar esos cambios en Lite y Plus antes de considerar cerrado el paso.

## Regla de estado vivo
- `CURRENT_STATE.md` = fotografía autoritativa actual.
- `EXECUTION_LOG.md` = historial acumulativo de ejecución/decisiones.
- `MANUAL_CAPABILITY_GAPS.md` = excepciones y límites reproducibles.
- `CONTINUATION_PROMPT.md` = bootstrap estable; nunca debe contener el estado variable.
- Si GitHub Actions o HEAD contradicen CURRENT_STATE, prevalece la evidencia real; después se corrige CURRENT_STATE inmediatamente.

## Interpretación de G2
G2 comprueba invariancia de canal: LaTeX, texto y teclado deben converger a la misma interpretación matemática. No exigir igualdad textual cuando existen representaciones equivalentes válidas.
