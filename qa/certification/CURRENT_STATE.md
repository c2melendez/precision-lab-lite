# Estado vigente de certificación — Precision Lab Lite / Plus

Siguiente único: **SY-X-13-BILATERAL — WAIT_CI**. Leer continuity.json, verificar HEAD/Actions e inspeccionar los runs ya creados. Global OPEN; porcentaje reconciliado ND.

## 2026-10-17 UTC — SY-X-13 nativo bilateral publicado, WAIT_CI
SHA Lite 76edee1a40df93d3945acb1b426d0bc190a67e2c; Plus acd55e4b3cadf37b4c2e81dd044a5a95ad08d3c7. Fuente y oráculo originales intactos. Local: Worker handler real Lite verifica simplificación exacta de derivada y salida reintroducida frente al oráculo, además de recuperación5; HTTP Plus confirma derivada exacta, traducción explícita log interno→ln para texto y recuperación. El texto SymPy log(...) no es reentrada literal válida en el contrato log10 de la calculadora; UI usa LaTeX ln. No se acredita ese texto interno como reentrada pública. Nativos nuevos verificarán salida LaTeX real sin traducciones de prueba, MathLive/Worker/HTTP y tres perfiles. Scope x>0,no ramas complejas. Sin cambios del motor. 
- [IN625 Cumulative Certification Gate 39013568346](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568346) — inspeccionar existente.
- [IN625 H1d Reentry Diagnostic 39013568238](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568238) — inspeccionar existente.
- [Syntax309 SY-N-31 Scientific UI E2E 39013568233](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568233) — inspeccionar existente.
No volver a X09: X09..12 ya PASS_SCOPED en ledger. El snapshot anterior tenía encabezado X09 obsoleto; archivado, el índice es autoridad. GlobalOPEN; S25,S19,SY-P23,X04Plus,H2/SG28/DIST conservan sus límites.

## Bloqueos conservados

| Bloque | Estado y condición de salida |
|---|---|
| S25 dependencias | BLOCKED: últimas revisiones registraron 5 high en cada producto. [Remediación](SECURITY_REMEDIATION.md): parche compatible de braces o migración Tailwind validada; no repetir sin cambio de precondición. |
| S19 integral | OPEN: el initial run no mide mutaciones. La campaña histórica Lite sobre 6cbec764 obtuvo 10,32 %, sin acreditar HEAD actual; conservar sus resultados, no duplicarla. |
| SY-X-04 Plus | BLOCKED: fuente de 999 caracteres frente a máximo 500 en HTTP/parser y presupuesto AST 200. [Contrato](SY_X_04_LENGTH_CONTRACT.md), [propuesta](SY_X_04_LENGTH_DECISION.md). Oráculo 500x preservado en XFAIL estricto. |
| SY-P-23 | OPEN: convención a/bc pendiente, XFAIL estricto. |
| H2/SG28/DIST | OPEN/BLOCKED: contrato de vigencia/fencing, integración HTTP y luego topología autorizada. [Criterios](SG28_INTEGRATION_EXIT_CRITERIA.md). No repetir preflights equivalentes. |
| Otros canales/módulos | PARCIAL/ND: R12–14 y X01–03 nativos Plus ya acreditados; otros casos conservan sus gaps. |


