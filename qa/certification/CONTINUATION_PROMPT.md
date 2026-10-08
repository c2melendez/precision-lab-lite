# Prompt único permanente de continuidad — Precision Lab Certification

Continúa autónomamente el sistema de certificación de Precision Lab. GitHub es la fuente de verdad.

## Repositorios
- Lite: `c2melendez/precision-lab-lite`
- Plus: `c2melendez/precision-lab-plus`

## Resolución de la rama activa (sin nombres de rama fijos)
1. Consulta la rama predeterminada de cada repositorio mediante sus metadatos de GitHub.
2. Lee `qa/certification/README.md` en esa rama predeterminada, **indicando explícitamente esa rama o usando la lectura por defecto**. Ese archivo es el punto de entrada permanente que señala la rama canónica activa.
3. Confirma que los dos puntos de entrada indican la misma rama. Si difieren o falta alguno, examina las ramas/historial y reporta la discrepancia; no inventes una rama ni reconstruyas el estado desde el chat.
4. Verifica que la rama señalada existe en ambos repositorios y que contiene `qa/certification/README.md`.

## Continuación canónica
5. En la rama señalada, lee en ambos repositorios y en este orden:
   - `qa/certification/README.md`
   - `qa/certification/CURRENT_STATE.md`
   - `qa/certification/EXECUTION_PROTOCOL.md`
   - `qa/certification/MANUAL_CAPABILITY_GAPS.md`
   - `qa/certification/EXECUTION_LOG.md`
6. Comprueba los HEAD reales, últimos commits y GitHub Actions antes de asumir que SHA, runs o estados documentados siguen vigentes.
7. Ejecuta el “Siguiente paso exacto” de `CURRENT_STATE.md` y sigue el protocolo. Clasifica cada rojo como producto / harness / oráculo / capability antes de modificar código.
8. Mantén Lite y Plus coordinados, registra toda decisión basada en evidencia y evita divergencias no documentadas.
9. Después de cada avance sustantivo, actualiza `CURRENT_STATE.md` y `EXECUTION_LOG.md` en ambos repositorios; actualiza `MANUAL_CAPABILITY_GAPS.md` si corresponde. Verifica que la sincronización fue efectiva.
10. Si la rama canónica cambia, publica/valida primero toda la documentación en la nueva rama; después actualiza el puntero del README de la rama predeterminada en **ambos** repositorios. No cambies este prompt por un cambio de rama.
11. No utilices el chat, ZIPs ni handoffs históricos como fuente de verdad mientras la documentación canónica esté disponible.

**Objetivo:** que este mismo prompt funcione en todas las sesiones, sin tener que conocer ni editar manualmente la rama activa.
