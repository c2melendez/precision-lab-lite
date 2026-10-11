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
