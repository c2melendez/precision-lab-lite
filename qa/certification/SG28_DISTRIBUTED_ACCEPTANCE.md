# SG28 — Contrato de aceptación distribuida (pendiente)

Estado: **BLOCKED / NO CERTIFICADO**. Documento operativo; no equivale a implementación del coordinador ni a PASS.

## Evidencia que ya existe

Plus IN625 cumulative run `38116009014` (SHA `5e1ec807ad3beb8317f6d615383e691569720003`) SUCCESS: 676 backend PASS, 751 frontend PASS / 28 TODO; H1d `38116009037` SUCCESS 5/5. Las pruebas TCP usan procesos distintos pero un mismo host CI y SQLite local. Lite gate `38114956929` SUCCESS. Ninguna de estas corridas es una validación multinodo.

## Bloqueo de arquitectura confirmado

`backend/app/services/request_cancellation.py` mantiene `_ADMISSION = threading.BoundedSemaphore(...)` por proceso. En la implementación existente, el límite `SG28_MAX_ISOLATED_REQUESTS` es local, no global. El coordinador TCP/SQLite en `backend/tests/test_sg28_tcp_admission_characterization.py` es una *fixture de pruebas*, no un servicio de coordinación conectado al endpoint público.

Por tanto, desplegar dos réplicas del backend no demostraría K=1 global, y usar el test TCP en loopback como justificación de despliegue estaría prohibido.

## Requisitos antes de ejecutar

1. Confirmar un workspace y entorno **desechable**, con al menos dos hosts/instancias distintos y un coordinador compartido verdaderamente accesible por red. No ejecutar en producción.
2. Diseñar o integrar explícitamente un coordinador real en la ruta opt-in; mantener `SG28_EVALUATE_ISOLATION=0` en producción mientras no se certifique.
3. Registrar host IDs verificables, revisión SHA, configuración y límites de recursos por host. El CI de un solo runner no satisface este requisito.
4. Exponer un mecanismo de prueba para *fault injection* de red solamente en la infraestructura desechable; nunca en producción.

## Gates obligatorios

| ID | Caso | Evidencia mínima |
| --- | --- | --- |
| DIST-01 | Dos hosts solicitan capacidad global K=1 al mismo tiempo | Una concesión confirmada, un rechazo; IDs de host distintos |
| DIST-02 | Desconexión/pérdida de ACK tras persistir concesión | Solicitante incierto no ejecuta trabajo; no hay segunda concesión anticipada |
| DIST-03 | Partición de cliente contra coordinador | Falla cerrado, sin computación autorizada |
| DIST-04 | Pérdida/reinicio del coordinador con lease vigente | Lease retenido; no duplicación de concesión antes del vencimiento |
| DIST-05 | Reintento de release de generación obsoleta | No revoca la generación sucesora |
| DIST-06 | Expiración y recuperación | Nueva generación autorizada después del deadline; retorno a servicio |
| DIST-07 | Saturación y múltiples solicitudes | Respuesta de rechazo acotada, sin huérfanos, fuga de workers ni bypass |
| DIST-08 | Ruta pública opt-in, respuesta y cancelación HTTP | Paridad de MathResponse, semántica de error y terminación servidor comprobadas |

Cada gate debe registrar: timestamp, SHA, run/job, host origen, host coordinador, acción, resultado, lease/generation y captura de logs con datos sensibles retirados.

## Regla de cierre

No declarar DIST-01..08 PASS por tests locales ni cerrar SG28/H2 sin evidencia ejecutada en el entorno independiente autorizado. Si no hay workspace/infraestructura autorizada, mantener BLOCKED y continuar otros bloques independientes; no crear servicios ni cambiar Render de producción automáticamente.

## Preparación del gate de transporte y autenticación — 2026-10-11

Antes de conectar hosts independientes al coordinador, se añaden prerequisitos de seguridad (NO equivalen a DIST PASS):
- Canales autenticados y cifrados, identidad del servidor comprobada y credenciales temporales fuera de logs; no exponer la fixture TCP/SQLite en loopback como servicio de red sin estos controles.
- Evidencia negativa obligatoria: credencial inválida/ausente, servidor con identidad incorrecta, transporte inseguro y repetición de solicitud no pueden otorgar un lease ni alterar el estado.
- El permiso de admisión cubre solicitud lógica completa (cálculo, presentación, cancelación y limpieza); confirmar liberación solamente después de finalizar todos los coordinadores hijos.
- Topología separada comprobable (al menos dos clientes en hosts/espacios de aislamiento independientes y coordinador compartido) antes de marcar DIST-01..08 como ejecutados.
- Último gate verificado Plus para corrección de fixture de ocho clientes: SHA `18ff893399bb0192d994a6e1ff141615d483a832`, acumulativo `38140121960`: backend 760 PASS / 1 warning / cobertura 86.06%, frontend 751 PASS / 28 TODO; H1d `38140121981` 5 PASS. Solo un runner CI; no certifica multinodo.

Siguiente ejecución técnica independiente permitida: desarrollar pruebas de transporte autenticado en un fixture estrictamente aislado y fail-closed, sin desplegar ni activar `SG28_EVALUATE_ISOLATION`; después ejecutar gates de regresión en SHA correspondiente.

## 2026-10-11 — Requisito de reloj autoritativo (seguridad distribuida)
- Auditoría de `backend/tests/test_sg28_tcp_admission_characterization.py`: `AdmissionHandler` entrega `data["now"]` y `data["ttl"]` suministrados por cliente a `_grant`. Esto es deliberado en el fixture para simular fronteras de tiempo, pero **NO puede trasladarse sin restricciones a un coordinador real**.
- El coordinador de producción debe obtener el tiempo de la autoridad elegida del lado servidor; validar/acotar TTL conforme a política central, no aceptar un instante arbitrario provisto por clientes. Expiración y fencing deben conservarse tras reinicio, con tratamiento documentado de saltos de reloj y persistencia.
- Pruebas adicionales de aceptación: un cliente no puede adelantar `now` para invalidar otro lease ni solicitar TTL fuera de límites; un release con dueño/generación inválidos debe rechazarse; la caída/reanudación del coordinador no debe conceder solapamientos.
- También debe requerirse identidad autenticada vinculada a cada lease; el campo `owner` del JSON del fixture no prueba autorización.
- **Clasificación: diseño de seguridad pendiente, NO fallo certificado del producto** (el servidor TCP es test-only, loopback, no desplegado). DIST-01..08 siguen BLOCKED y SG28/H2 OPEN; no habilitar red/producción.
