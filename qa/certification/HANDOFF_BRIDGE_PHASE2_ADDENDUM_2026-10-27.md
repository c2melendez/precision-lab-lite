# Addendum Handoff — estado actualizado de Cert Runner Compass v1.1 (2026-10-28 UTC)

**Estado:** EN PROGRESO / NO CERTIFICADO. Este addendum sustituye el corte previo que dejaba D1 como BLOCKED y D4 como pendiente.

- **Estado vigente consolidado:** [BRIDGE_CERT_COMPASS_V1_1_STATUS_2026-10-28.md](BRIDGE_CERT_COMPASS_V1_1_STATUS_2026-10-28.md)
- **Historial de sesión:** [BRIDGE_CERT_COMPASS_V1_1_SESSION_2026-10-27.md](BRIDGE_CERT_COMPASS_V1_1_SESSION_2026-10-27.md); es histórico, no una fuente de estado actual.
- **Verificados anteriormente según el registro:** V1–V6 (V1 solo confirmado por el responsable), D1 con alcance limitado, B3–B6, C1–C3 y D4.
- **Pendientes principales:** E2/E3 necesitan evidencia de conversación del GPT real; D2 necesita prueba con clave deliberadamente revocada; D5 requiere evidencia específica del contrato 204→run; anomalía de estado RUNNING para dry-run; inconsistencia HTTP de replay; D-07/correlación formal; rotación de claves y reconciliación de versión desplegada.
- **Runs históricos:** 5 de Runner y 1 de gate observados frente al plan original de 3 Runner y 1 gate. Dos runs del Runner excedieron el plan; 40463536599 sigue sin atribución confirmada. No ejecutar nuevos dispatches para compensar.
- **Seguridad:** las claves expuestas no se reproducen en documentos. La rotación de la clave compartida del Bridge y la clave de Render debe quedar confirmada sin incluir sus valores.
- **Separación de decisiones:** D-01/D-04 del frente P0.1/Supabase no son los casos de prueba D1/D4 de esta suite.

**Regla al reanudar:** empezar por el estado consolidado vigente y la evidencia de solo lectura. No enviar POST nuevos ni disparar Actions sin autorización explícita, presupuesto actualizado y necesidad documentada.
