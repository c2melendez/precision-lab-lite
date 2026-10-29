# Compass — revisión de acceso y plan de remediación

Corte: 2026-10-29 UTC. **Solo propuesta; no aplicada.**

La inspección de catálogo encontró acceso amplio de los roles de cliente sobre tres tablas internas del Bridge. El rol de servicio usado por los handlers de servidor tiene sus permisos. La protección por fila está activada, pero no se observaron políticas, y esa protección no sustituye una lista de permisos de tabla mínima.

Plan sujeto a revisión:
1. Confirmar que ningún cliente de navegador necesita consultar directamente las tablas internas; los handlers revisados usan el cliente de servicio en servidor.
2. En una migración revisada, retirar permisos de cliente innecesarios de las cuatro tablas internas, conservar el acceso requerido del rol de servicio y mantener la protección por fila habilitada.
3. Examinar por separado los permisos que se aplican automáticamente a objetos nuevos; su alcance incluye el esquema público completo y no debe cambiarse sin inventariar otros consumidores.
4. Confirmar con el propietario de la plataforma la finalidad del rol de ejecución interno adicional, que aparece con inicio de sesión y bypass de la protección por fila. No cambiarlo hasta conocer su función.
5. Después de la aprobación, validar permisos de lectura y escritura para roles de cliente y servicio, las rutas del Bridge y el estado de las políticas. No generar ejecuciones de Actions durante estas pruebas.

Bloqueo de lookup: las tres solicitudes antiguas citadas en CURRENT_STATE pertenecen a una clave ya revocada. La clave activa actual pertenece a otro propietario y no debe usarse para eludir el aislamiento. No se modificará la propiedad de las solicitudes ni se restablecerá la clave sin autorización explícita. Hace falta una vía de recuperación de estado autenticada y auditable.

Procedencia: el proveedor marca el proyecto como publicado y la última revisión fuente como `b0442cca4f1c47f2f4d71d02ded75b63fc539428`. La sesión anterior informa un SHA local distinto y una lectura en vivo, pero el proveedor no ofrece un SHA independiente del artefacto desplegado. La conexión entre el último origen y el artefacto publicado sigue pendiente de verificación independiente.

No se han cambiado datos, permisos, políticas ni despliegue. Compass sigue OPEN / NO CERTIFICADO.
