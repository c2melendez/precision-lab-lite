# Estado vigente de certificación — Precision Lab Lite / Plus

**SY-X-14-BILATERAL — WAIT_CI.** Inspeccionar los IDs del índice. Global OPEN; porcentaje reconciliado ND.

## SY-X-14 — implementación de evidencia, WAIT_CI (2026-10-17 UTC)
Lite SHA 7decaedce18874cb8d81c7137761f69b860cca22; Plus a66dac769c3212cb8e3dfe9951030eec0bd4711d. Expansión50literalfrac:501caracteres, sin presimplificar. TestigoHTTP50divisiones:201caracteres, AST201nodos/profundidad101. Pluslímites200nodos/30profundidad:COMPLEXITY_LIMIT por profundidad; también nodos impiden resolver si solo se aumenta profundidad. Oráculox,x≠0 preservado enXFAILestricto; rechazo/recuperación no equivalen a resolución. Contrato SY_X_14_DEPTH_CONTRACT.md versionado en ambos.
Lite5tests localesPASS:paridad49/50/51,dominiooriginal,cerorechazado,Workerrecuperación/reentrada. PlusHTTP1PASS+1XFAILestricto;conversión completa conserva50divisiones. Nuevos nativos pendientes:Liteparidad/dominiovisible yrechazocero,PlusavisoHTTPprofundidad yrecuperación en3perfiles. PegarsoloLaTeXxcreanuevaexpresión;no atribuirle automáticamente dominiooriginal sinmetadatos. Sin cambios al motor/límites. No campaña de mutación/npm nueva.
- [IN625 Cumulative Certification Gate 39014331621](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331621) — inspeccionar existente, no redispatch.
- [Syntax309 SY-N-31 Scientific UI E2E 39014331682](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331682) — inspeccionar existente, no redispatch.
- [IN625 H1d Reentry Diagnostic 39014331642](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331642) — inspeccionar existente, no redispatch.
GlobalOPEN; siguiente aúnX14hasta revisarCI, después caso independienteX15 siPluscontinúabloqueado.

## Evidencia previa de origen (X13)

# Estado vigente de certificación — Precision Lab Lite / Plus

Corte:2026-10-17 UTC (2026-10-17 Honduras). Global **OPEN**; porcentaje reconciliado **ND**.

**Siguiente tarea única: SY-X-14-BILATERAL — READY.** Verificar HEAD/Actions y continuity.json. Leer presupuestos antes de expandir50recíprocos; mantener x≠0 y no presimplificar el original para evitar límites.

## 2026-10-17 UTC — SY-X-13 bilateral verificado
Fuente original `\frac{d}{dx}x^{x^{x}}` y oráculo `x^{x^{x}}\left(x^{x}(\ln x+1)\ln x+x^{x-1}\right)` intactos.
Alcance matemático **x>0**: derivada de la potencia anidada, no (x^x)^x ni ramas complejas. Sin cambios al motor en este lote.
MathLive ingiere la fuente original; las normalizaciones de espacios/llaves se admiten solo tras verificar contenido matemático. Lite usa Worker real, compara el LaTeX visible y su salida reintroducida por simplificación exacta frente al oráculo y controles numéricos en1.25,1.5,2. Plus usa POST/derivative real y POST/evaluate con el LaTeX real devuelto; verifica cada resultado con equivalencia SymPy exacta y la precedencia del payload original. Ambos recuperan2+3=5 y reintroducen5; cuatro IDs distintos y cero pageerrors por perfil.
- Lite SHA `76edee1a40df93d3945acb1b426d0bc190a67e2c`: [acumulativo39013568346](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568346)1607PASS/30TODO,188archivos,typecheck/build,34pruebas del mecanismo; [H1d39013568238](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568238)21PASS; [nativo39013568233](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568233)423/423PASS, incluidos X13 desktop/tablet/mobile,sin reintentos observados.
- Plus SHA `acd55e4b3cadf37b4c2e81dd044a5a95ad08d3c7`: [acumulativo39013565024](https://github.com/c2melendez/precision-lab-plus/actions/runs/39013565024)frontend1005PASS/28TODO,146archivos,typecheck/build;backend1478PASS/2XFAIL,cobertura88.11%;56pruebas del mecanismo. [Nativo39013565049](https://github.com/c2melendez/precision-lab-plus/actions/runs/39013565049)45/45PASS (15desktop+30tablet/mobile),sin reintentos. [H1d39013564974](https://github.com/c2melendez/precision-lab-plus/actions/runs/39013564974)38PASS.
La prueba HTTP separada traduce explícitamente el texto interno SymPy log→ln: **no** acredita reentrada literal de result_text(log), pues la gramática pública reserva log para base10. La reentrada nativa sí usa el result_latex(ln) real, sin traducciones del test. El Worker handler real Lite, con transporte simulado, se acredita aparte del navegador real.
No se repitieron X09–12 ni campañas de dependencias/mutación. Los encabezados obsoletos de CURRENT_STATE(X09) fueron archivados; el ledger y la nueva fotografía acuerdan X13 y el siguiente paso.
Campaña38995800990 reconciliada: frontend117288029860CANCELLED, initialrun693testsSUCCESS y cancelación posterior, sin informe final. No se infiere score ni causa no verificada. Backendmutmut117288029927SUCCESS ya revisado. Campaña39001980867: backendmutmut yseguridadSUCCESS según jobs; componentes ajenosSKIPPED. S19integral sigueOPEN; misma huella cancelada requiere diagnóstico y ninguna omisión equivale aPASS.
Limitaciones: asignación/input MathLive en desktop/tablet/mobile Chromium, no cada tecla/SO/otro motor/botónReusar; no identidad global en ramas complejas. TODO/XFAIL/SKIP no son PASS. GlobalOPEN; porcentaje reconciliadoND. S25, S19, SY-P23, SY-X04Plus y H2/SG28/DIST abiertos. Siguiente único: **SY-X-14-BILATERAL**,50recíprocos anidados, paridad y dominiox≠0 sin presimplificar; revisar presupuestos de longitud/AST antes de ejecutar.

## Bloqueos conservados

| Bloque | Estado y condición de salida |
|---|---|
| S25 dependencias | BLOCKED: últimas revisiones registraron 5 high en cada producto. [Remediación](SECURITY_REMEDIATION.md): parche compatible de braces o migración Tailwind validada; no repetir sin cambio de precondición. |
| S19 integral | OPEN: el initial run no mide mutaciones. La campaña histórica Lite sobre 6cbec764 obtuvo 10,32 %, sin acreditar HEAD actual; conservar sus resultados, no duplicarla. |
| SY-X-04 Plus | BLOCKED: fuente de 999 caracteres frente a máximo 500 en HTTP/parser y presupuesto AST 200. [Contrato](SY_X_04_LENGTH_CONTRACT.md), [propuesta](SY_X_04_LENGTH_DECISION.md). Oráculo 500x preservado en XFAIL estricto. |
| SY-P-23 | OPEN: convención a/bc pendiente, XFAIL estricto. |
| H2/SG28/DIST | OPEN/BLOCKED: contrato de vigencia/fencing, integración HTTP y luego topología autorizada. [Criterios](SG28_INTEGRATION_EXIT_CRITERIA.md). No repetir preflights equivalentes. |
| Otros canales/módulos | PARCIAL/ND: R12–14 y X01–03 nativos Plus ya acreditados; otros casos conservan sus gaps. |



El log y history/2026-10-17_pre_X13_CURRENT_STATE.md conservan la historia. La siguiente tarea proviene solo del índice reconciliado. Sin producción,deploy,merge,release ni flags remotos.
