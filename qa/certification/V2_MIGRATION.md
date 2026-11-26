# Adopción v2.0 — checkpoint de implementación

Cambio técnico publicado: 5255d5e5eb67d33afec14fb06f3f08908c2b5c2e. Rama canónica: qa/syntax-audit-in625-a1. Producto: lite.

Se incorpora SYSTEM_V2.md, batch_v2.py, test_batch_v2.py y workflow certification-batch-v2. El piloto MV153 reutiliza las nueve suites existentes; verifica las nueve fuentes, 153 IDs y genera observaciones JUnit/JSON sin declarar PASS. No se han alterado motores, fixtures, oráculos ni gates históricos. No se ha reconciliado el inventario completo ni cerrado matrices. La certificación global permanece OPEN. No modificar los estados técnicos anteriores por este checkpoint documental.

Siguiente acción: verificar los runs push del SHA técnico y jobs/logs/artefactos; aceptar únicamente alcance demostrado, corregir mapeos faltantes. En paralelo continuar reparación de regresiones activas Lite y deuda compleja TR324. Ampliar el ejecutor a TR324 y demás matrices por familias. Mantener S25, SG28/DIST y EV-D-01 abiertos hasta condiciones de salida. No repetir gate en curso ni cambiar los filtros CI sin demostrar equivalencia.
