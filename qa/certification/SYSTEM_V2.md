# Precision Lab — Sistema modular de certificación v2.0

## Autoridad
Esta política sustituye la cuota operativa de 80 y el cursor serial de versiones anteriores; mantiene las matrices, contratos matemáticos, condiciones de cierre, seguridad, paridad, permisos e historial. GitHub es la fuente de verdad. No crear repositorios ni alterar producción. El orden contractual de cierre no cambia; diagnóstico y reparación independiente por familias pueden avanzar sin esperar bloqueos ajenos.

## P0 — Reconciliación
Resolver README de main en ambos productos, rama canónica, HEAD, continuity.json, CURRENT_STATE, contratos, gaps y runs/jobs/logs vigentes. Consultar historia por alcance. Verificar nueve fuentes por hash; reconciliar 3454 filas históricas frente a 3451 IDs preliminares sin alterar denominador arbitrariamente. Registrar matriz/ID/producto/canal/capa/revisión y conservar historia. Evidencia no comprobada = REVIEW. No esperar inventario perfecto para trabajo independiente.

## P1 — Industrialización
CONSERVAR > VERIFICAR > REUTILIZAR > CORREGIR > COMPLEMENTAR > CREAR. Extender fixtures, harness y oráculos existentes. Extraer entrada literal, dominio, operación y respuesta fuente sin sustituirla; validar conteos, unicidad y hash. Oráculos por familia, independientes del motor, con dominio, tolerancias, controles negativos, límites y mutación. Coincidencia Lite/Plus no prueba corrección; muestreo numérico no prueba completitud simbólica. INCONCLUSIVE/REVIEW ante incertidumbre. Primer corte MV153: nueve suites existentes por producto, JUnit y JSON por ID. No confundir observación con aceptación ni retirar gates vigentes.

## P2 — Ejecución masiva y correctiva
- Priorizar regresiones críticas, después casos parciales cerrables y bloques nuevos. Mantener acción prioritaria y cola de familias elegibles con dependencias. Bloqueo detiene solo su alcance.
- Ejecutar el bloque elegible completo antes de reparar salvo riesgo que invalide la ejecución. Objetivos iniciales adaptativos: 150–300 casos matemáticos automatizables; 300–1000 sintácticos; 40–150 de reparación compleja; ampliar hasta matriz completa si viable. Sin cuota mínima ni fabricación. Medir PASS completos y capas por separado.
- Agrupar FAIL por capa, firma, dependencia y causa confirmada. Reparar origen común, no excepciones por fila. Ejecutar afectados, controles positivos/negativos, fronteras, dominios, paridad y metamórficos pertinentes.
- Reutilizar solo evidencia revisada con huellas de fuente, fixture, motor, oráculo, workflow, dependencias y aceptación equivalentes. Mantener RUN/WAIT/REUSE/DIAGNOSE/REVIEW. Impacto incierto exige regresión amplia. S25 requiere revisión fresca.
- Antes de publicar comprobar diff completo, truncamiento inesperado, exportaciones, typecheck y focales. CAS/expected_sha; nunca force-push ni sobrescribir escritor. No integrar defectos nuevos conocidos. Mientras CI corre, avanzar independiente sin invalidar candidato.
- CI-FAST focal, CI-BATCH por familia, CI-FULL acumulativo en integración/cierre, CI-STRESS por impacto y contrato. Consolidar únicamente baterías demostrablemente equivalentes, preservando checks, cobertura y seguridad. Hasta validar equivalencia mantener YAML y gates existentes. Medir cinco corridas antes de ajustar filtros o concurrencia.
- Generar observaciones estructuradas automáticamente. Aceptar solo evidencia realmente ejecutada y revisada con alcance, SHA/run/job, fuente, oráculo y aceptación. Estados PENDIENTE, EN_CURSO, PASS, PASS_SCOPED, FAIL, BLOCKED, MANUAL, REVIEW. JUnit verde no es certificación. SKIP/XFAIL/TODO/timeout no son PASS. No sobrescribir historia.
- Actualizar continuidad bilateral; generar resúmenes desde datos estructurados cuando se valide el generador. Reportar nuevos IDs examinados, PASS completos, parciales, FAIL/REVIEW/BLOCKED, causas reparadas, tiempos y SHA/run/job. No sumar categorías heterogéneas. Continuar hasta límite real.

## P3 — Cierre integral
Conservar cobertura de cada ID obligatorio, literal, UI, seguridad, mutación, dominio, ramas complejas, carga, cancelación, paridad y gates exigidos. S25, SG28/DIST y EV-D-01 permanecen abiertos hasta evidencia contractual. No activar aislamiento en producción. E1 ejecución verificable, E2 implementación sin ejecución, E3 diseño. PASS_SCOPED no cierra fila ni matriz. Global OPEN hasta cumplimiento.

## Adopción
Ejecutar MV153 bilateral, verificar JSON/JUnit, IDs faltantes, alcance y tiempos. Son candidatos de reconciliación, no PASS automático. Después ampliar al bloque activo TR324, resolver regresiones Lite y ramas complejas, y extender fixtures restantes por familia. No suspender reparaciones críticas. No contar infraestructura como casos certificados. No retirar gates antiguos antes de demostrar equivalencia.
