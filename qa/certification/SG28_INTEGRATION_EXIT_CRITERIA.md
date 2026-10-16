# SG28 — bloqueo de integración y condición de salida

Fecha: 2026-10-16. Estado: **BLOCKED técnico; H2 OPEN; DIST-01..08 sin certificar**.

Esta revisión compara el contrato de aceptación con el código de la rama canónica al cierre de SY-X-03. No activa flags, publica servicios, provisiona certificados reales ni acredita topología distribuida.

## Lo que ya existe

- `/api/v1/evaluate` tiene aislamiento experimental opt-in. La ruta mantiene una cuota **local al proceso** durante cálculo y presentación (`backend/app/routers/evaluate.py`, función `evaluate`; `backend/app/services/request_cancellation.py`, `request_admission_lease`).
- El supervisor aísla trabajo en un proceso hijo, observa cancelación y ejecuta terminación/limpieza antes de devolver el control (`backend/app/services/interruptible.py`, `run_bounded`). Las pruebas anteriores de HTTP, cancelación y recuperación cubren este mecanismo local.
- `distributed_admission.py` valida respuestas estrictas de concesión y liberación con generación. `distributed_tls_transport.py` aporta transporte mTLS autenticado, sin fallback a texto plano.
- `SQLiteLeaseStore` serializa concesiones y conserva generaciones. `DisposableMTLSLeaseServer` las expone exclusivamente en loopback para pruebas. Las pruebas existentes de mTLS, ACK perdido, reinicio y generación obsoleta acreditan propiedades de esos componentes de ensayo.

Estas piezas no constituyen todavía admisión distribuida integrada de la ruta HTTP. El servidor disponible se declara desechable y rechaza direcciones externas a loopback.

## Bloqueo técnico que impide conectar las piezas de forma segura

| Hallazgo verificado en código | Consecuencia para la integración |
| --- | --- |
| `AdmissionGrant` solo contiene `generation`; `validate_grant` exige exactamente `granted` y `generation`. | El cliente no recibe un presupuesto de vigencia utilizable, deadline ni mecanismo de renovación. |
| `SQLiteLeaseStore` utiliza TTL predeterminado de 10 segundos y permite una concesión sucesora cuando `now >= deadline`. | La expiración del registro no demuestra que el trabajo de la concesión anterior haya terminado. |
| La ruta permite hasta 6 segundos para cálculo y 4 para presentación. La creación de procesos, los intercambios de red y la limpieza añaden tiempo. | El TTL predeterminado no cubre con margen la solicitud lógica completa. No debe asumirse que dos fases acotadas a 6+4 segundos constituyen un límite total de 10 segundos. |
| El fencing del almacén comprueba dueño/generación al liberar. Los hijos de `run_bounded` no reciben ni observan una generación o vencimiento del lease. | Una generación nueva impide que un release viejo modifique su registro, pero no impide que el cálculo viejo continúe ejecutándose. |
| El coordinador desechable usa `time.time`; la política de saltos de reloj no está definida para una autoridad desplegable. | Persistir un deadline numérico no completa por sí solo la garantía de exclusión frente a cambios de reloj. |

**Escenario de riesgo inferido del código:** un lease puede vencer mientras todavía existe trabajo admitido bajo su generación; el almacén puede conceder la siguiente generación sin observar ese hijo. Envolver la ruta actual con `distributed_admission_lease` no elimina ese solapamiento. Esta es una conclusión de revisión de código, no un fallo observado en un despliegue.

## Siguiente paso único y accionable

Responsable lógico: mantenedor de backend/coordinación, con revisión del contrato por el responsable de infraestructura.

Definir y aprobar un contrato de **vigencia de la solicitud lógica** antes de modificar el wiring HTTP. El contrato debe especificar:

1. Presupuesto total de cálculo, presentación, transporte y limpieza, incluida la relación entre el límite del supervisor y la vigencia autorizada por el coordinador.
2. Modelo de vigencia: lease con plazo acotado o renovación explícita. No aumentar simplemente el TTL para ocultar la ausencia de garantía.
3. Conducta ante concesión incierta, renovación perdida, partición o suspensión del cliente: impedir trabajo nuevo y cancelar/recoger los hijos existentes antes de reutilizar capacidad, con una garantía explícita frente a concesiones sucesoras.
4. Autoridad de reloj, tolerancia a saltos, persistencia y reinicio; política segura de recuperación de propietarios desaparecidos.
5. Lugar donde se aplica el fencing a la ejecución efectiva, además de las operaciones del almacén. Indicar qué supuesto de suspensión/reanudación o partición permite probar K=1 y qué garantía queda fuera de alcance.
6. Mapeo de rechazo y fallo de coordinación a HTTP/`MathResponse`, sin ejecución por fallback local; la ruta experimental debe permanecer deshabilitada por defecto.

El resultado revisable de este paso es un contrato versionado que resuelva las seis decisiones y describa la topología del coordinador experimental. Puede prepararse y revisarse sin producción ni infraestructura externa. Una vez aprobado, procede una sola implementación integrada y su prueba de aceptación local focalizada.

## Condiciones para pasar a ejecución integrada

- Contrato anterior aprobado y enlazado desde el estado canónico.
- Adaptador autenticado configurado explícitamente; ausencia o error de configuración falla cerrado antes de crear hijos.
- Una concesión cubre la solicitud completa; ninguna fase adquiere capacidad nueva de manera independiente.
- Una prueba HTTP integrada con coordinador mTLS de ensayo acredita: rechazo simultáneo K=1, ninguna ejecución sin concesión confirmada, cancelación ante incertidumbre y cleanup antes de reutilizar cuota, recuperación y paridad de `MathResponse`.
- Instrumentación correlaciona request ID, generación y comienzo/fin de hijos, sin credenciales en logs.
- La validación local se registra como **integración de un host**, nunca como DIST multinodo PASS.

## Condiciones posteriores para cerrar DIST

Después de la integración segura, siguen siendo necesarios hosts/instancias independientes autorizados, identidad verificable, coordinador accesible por red con persistencia, material mTLS temporal, inyección de fallos acotada y evidencia por SHA de los ocho gates de `SG28_DISTRIBUTED_ACCEPTANCE.md`. No corresponde solicitar ni provisionar esta infraestructura para repetir el preflight de identidades ya probado.

## Regla para el siguiente LLM

Mientras no cambie el contrato, el supervisor, el wiring o la disponibilidad de la topología, conservar este bloqueo y continuar frentes independientes. No añadir otro micropreflight, no volver a ejecutar suites completas por actualizar esta nota y no declarar que el único pendiente son dos máquinas. El bloqueo incluye garantía de vigencia/fencing de ejecución e integración HTTP, además de infraestructura.

## Validación de esta revisión

Lectura de los módulos y contratos citados, con contraste de los límites explícitos y del protocolo de mensajes. No se añadieron pruebas que repitan las caracterizaciones existentes. No se ejecutaron Actions ni se alteró el producto.
