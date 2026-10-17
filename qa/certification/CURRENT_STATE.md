# Estado vigente — SY-X-17 WAIT_CI

## 2026-10-17 UTC — SY-X-17 bilateral WAIT_CI
Comando original write18{ls}, sin ejecución. SHA Plus 67b9ca8eb32edf282608e73fcf225ebdd06fda4b; Lite 82a83c430a779eaa344be5be7644c9a38bfedc26. Nuevos tests locales: Lite2PASS; Plus8PASS, incluidos7controles sys.audit sintéticos sin procesos reales. Parser Lite rechaza carácter no reconocido, Worker real rechaza y recupera; HTTP Plus rechaza bajo guarda de eventos de lanzamiento y recupera. Nativo pendiente en3perfiles. Solo tests/workflow, sin motor ni dependencias. Runs existentes: plus:39017066925,39017066935,39017066929; lite:39017068701,39017068699,39017068708. Esperar esos runs; no duplicar. Global OPEN y bloqueos conservados.

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
