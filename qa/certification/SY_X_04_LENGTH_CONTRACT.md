# SY-X-04 — conflicto de longitud y complejidad

Estado: **BLOCKED para el resultado matemático de Plus por HTTP**. El fixture original conserva la entrada descriptiva de 500 términos y el esperado 500x. Las pruebas expanden 500 sumandos reales, no sustituyen la entrada por 500*x.

La revisión focalizada encontró dos límites independientes del contrato actual:

| Entrada expandida | Longitud ASCII | Respuesta observada localmente |
|---|---:|---|
| 199 términos x | 397 | HTTP 200, success=true, 199*x |
| 200 términos x | 399 | HTTP 200, success=false, COMPLEXITY_LIMIT: más de 200 nodos |
| 250 términos x | 499 | HTTP 200, success=false, COMPLEXITY_LIMIT |
| 251 términos x | 501 | HTTP 422, VALIDATION_ERROR por longitud |
| 500 términos x | 999 | HTTP 422, VALIDATION_ERROR; después 2+3 recupera 5 |

Fuentes: backend/app/schemas/requests.py (EvaluateRequest, max_length=500), backend/app/services/ast_validator.py (máximo de nodos), backend/tests/test_syntax309_syx04_contract.py (evidencia de rechazo/recuperación). Las pruebas de rechazo aprobadas **no certifican** el oráculo 500x. No basta subir max_length: el límite AST seguiría impidiendo el cálculo.

Siguiente acción: reconciliar el contrato de entrada larga con ambos presupuestos y su objetivo de seguridad. Preparar una decisión versionada que determine si el producto debe aceptar los 500 términos reales con un presupuesto acotado y probado, o si el caso permanece incompatible con el contrato HTTP. No elevar límites globales ni simplificar previamente la entrada para simular PASS. Mantener el caso abierto mientras se avanza en los frentes independientes autorizados.

La evidencia local se ratifica mediante el acumulativo del SHA técnico publicado; consultar continuity.json y CURRENT_STATE para run/estado vigentes. No repetir este gate por cambio de sesión si no cambiaron fuente, límites o criterios de aceptación.

La ejecución concurrente Plus 38982210591 confirmó además un guard de longitud en backend/app/services/parsing.py, independiente de FastAPI: el servicio matemático también rechaza 999 caracteres con ParseSecurityError. Se conserva el esperado matemático 500x en un XFAIL estricto que solo admite esa excepción; una aceptación futura produce XPASS y exige reconciliar el estado. La prueba de recuperación sí captura el rechazo esperado y ejecuta 2+3. No basta modificar solo el schema HTTP.
