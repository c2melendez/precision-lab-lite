# Estado vigente — SY-X-17 WAIT_CI tras corrección

## 2026-10-17 UTC — SY-X-17 diagnóstico y corrección Plus; WAIT_CI
Run nativo Plus39017066935/job117351282488 falló20PASS/1FAILdesktop; tablet/mobile no ejecutados. Artefacto12094727679 y reproducción directa: convertLatexToAsciiMath borra write y produce18l s, evaluado como producto. Fallo de conversión del producto, no ejecución de shell demostrada. Regresión frontend primero falla; corrección rechaza el comando antes de convertir.10pruebas locales pertinentes ytypecheckPASS. Nuevo SHA Plus 02a8f689aac5d4583a35edaa722851d344b27419; Lite mantiene 82a83c430a779eaa344be5be7644c9a38bfedc26. Fuente/oráculo intactos, sin relajar prueba. Nueva corrida justificada por cambio técnico. Gate adicional de preflight/campaña selecciona solo componentes afectados; no atribuir PASS a SKIP o initial run. Runs actuales: plus:39017316970,39017316999,39017316988,39017316967,39017317053; lite:39017068701,39017068699,39017068708. Esperar/inspeccionar; no duplicar. GlobalOPEN, bloqueos conservados.

## Bloqueos conservados

| Bloque | Estado y condición de salida |
|---|---|
| S25 dependencias | BLOCKED: últimas revisiones registraron 5 high en cada producto. [Remediación](SECURITY_REMEDIATION.md): parche compatible de braces o migración Tailwind validada; no repetir sin cambio de precondición. |
| S19 integral | OPEN: el initial run no mide mutaciones. La campaña histórica Lite sobre 6cbec764 obtuvo 10,32 %, sin acreditar HEAD actual; conservar sus resultados, no duplicarla. |
| SY-X-04 Plus | BLOCKED: fuente de 999 caracteres frente a máximo 500 en HTTP/parser y presupuesto AST 200. [Contrato](SY_X_04_LENGTH_CONTRACT.md), [propuesta](SY_X_04_LENGTH_DECISION.md). Oráculo 500x preservado en XFAIL estricto. |
| SY-P-23 | OPEN: convención a/bc pendiente, XFAIL estricto. |
| H2/SG28/DIST | OPEN/BLOCKED: contrato de vigencia/fencing, integración HTTP y luego topología autorizada. [Criterios](SG28_INTEGRATION_EXIT_CRITERIA.md). No repetir preflights equivalentes. |
| Otros canales/módulos | PARCIAL/ND: R12–14 y X01–03 nativos Plus ya acreditados; otros casos conservan sus gaps. |
| SY-X-14 Plus | BLOCKED: AST201nodos/profundidad101 frente a200/30. Rechazo y recuperación PASS; matemática no acreditada. [Contrato](SY_X_14_DEPTH_CONTRACT.md). No repetir sin cambiar precondición. |
| Puntero en main | OPEN con guía alternativa: resolver rama mediante Actions e índices bilaterales. El README raíz aún no tiene puntero. |

El log conserva la historia. El índice es autoridad del siguiente paso. Sin producción,deploy,merge,release ni flags remotos.
