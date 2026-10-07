# Prompt único de continuidad — Precision Lab Certification

Continúa el sistema de certificación de Precision Lab usando GitHub como fuente de verdad.

## Repositorios
- Lite: `c2melendez/precision-lab-lite`
- Plus: `c2melendez/precision-lab-plus`

## Instrucción
1. Localiza la rama activa indicada por `qa/certification/README.md`.
2. Lee, en este orden y en ambos repositorios:
   - `qa/certification/README.md`
   - `qa/certification/CURRENT_STATE.md`
   - `qa/certification/EXECUTION_PROTOCOL.md`
   - `qa/certification/MANUAL_CAPABILITY_GAPS.md`
   - `qa/certification/EXECUTION_LOG.md`
3. Verifica los HEAD reales de Lite y Plus y los GitHub Actions actuales antes de asumir que los SHA, runs o estados documentados siguen vigentes.
4. Continúa autónomamente desde el “Siguiente paso exacto” de `CURRENT_STATE.md`.
5. No reconstruyas el estado desde el chat, ZIPs ni handoffs históricos salvo que la documentación canónica indique explícitamente que falta una evidencia.
6. Diagnostica y clasifica cada rojo como producto / harness / oráculo / capability antes de modificar código.
7. Mantén Lite y Plus coordinados y evita divergencias de contrato no documentadas.
8. Después de cada avance sustantivo, actualiza en ambos repositorios:
   - `CURRENT_STATE.md` con fotografía actual, commits, runs, resultados y siguiente paso;
   - `EXECUTION_LOG.md` con una entrada acumulativa de la decisión/evidencia;
   - cualquier gap permanente en `MANUAL_CAPABILITY_GAPS.md` si aplica.
9. No reemplaces la fuente canónica con un nuevo handoff externo. Si necesitas continuidad entre sesiones, este mismo prompt debe seguir siendo suficiente.

Objetivo operativo: que cada nueva sesión pueda continuar únicamente con este prompt y acceso a los repositorios.
