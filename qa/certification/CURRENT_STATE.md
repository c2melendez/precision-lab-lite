# Estado vigente de certificación — Precision Lab Lite / Plus

Corte:2026-10-17 UTC/Honduras. Global **OPEN**; porcentaje reconciliado **ND**.

**Siguiente tarea única: SY-X-15-BILATERAL — READY.** X14 queda parcial: Lite PASS acotado; matemática Plus BLOCKED. No repetir el rechazo de50niveles mientras no cambie la precondición contractual. Verificar HEAD/Actions e índice antes de actuar.

## 2026-10-17 UTC — SY-X-14: Lite validado, matemática Plus bloqueada
El fixture descriptivo se conserva intacto. Su expansión operativa usa 50 fracciones recíprocas reales: 501 caracteres LaTeX. El testigo HTTP de 50 divisiones mide 201 caracteres; el árbol SymPy sin evaluar tiene 201 nodos y profundidad 101. No se sustituyó la fuente por x antes de validar.
**Lite:** paridad 49/50/51 comprobada con Algebrite y el handler Worker real; 50 devuelve x y los vecinos impares1/x. La restricción original x≠0 se verifica en los metadatos. El navegador prueba MathLive con 50 niveles y control49, salida exacta visible, restricción x≠0 visible, rechazo de cero anidado, recuperación5 y reentrada; cinco IDs exitosos distintos y cero pageerrors. Pegar solo el LaTeX x inicia una expresión nueva: no se acredita persistencia automática de restricciones sin sus metadatos ni el botónReusar.
**Plus:** el original traducido conserva las50divisiones y cabe en la longitud HTTP500. El AST excede profundidad30 y también nodos200. HTTP y MathLive muestran COMPLEXITY_LIMIT por profundidad, sin resultado ficticio, y se recuperan con5 y reentrada en tres perfiles. **Esto no resuelve el caso matemático:** el oráculo x con x≠0 queda BLOCKED y XFAIL estricto. Elevar solo profundidad tampoco solventaría nodos. [Contrato](SY_X_14_DEPTH_CONTRACT.md). No se cambian motor ni límites.
- Lite SHA `7decaedce18874cb8d81c7137761f69b860cca22`: [acumulativo39014331621](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331621)1612PASS/30TODO,189archivos,typecheck/build,34pruebas del mecanismo; [nativo39014331682](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331682)426/426PASS,incluidos X14 y49niveles en3perfiles,sin reintentos observados; [H1d39014331642](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331642)21PASS.
- Plus SHA `a66dac769c3212cb8e3dfe9951030eec0bd4711d`: [acumulativo39014327670](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327670)frontend1005PASS/28TODO,146archivos,typecheck/build; backend1479PASS/3XFAIL,cobertura88.07%;56pruebas del mecanismo. [Nativo39014327763](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327763)48/48PASS (16desktop+32tablet/mobile),incluye rechazo/recuperación deX14,no resolución. [H1d39014327685](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327685)38PASS.
Pruebas locales nuevas: Lite5PASS; Plus HTTP1PASS+1XFAILestricto. No campañas nuevas de mutación/dependencias, no dispatch manual ni repetición de gates equivalentes. Los commits documentales no acreditan nueva ejecución.
Continuidad: default_branch=main en ambos; sus README no contienen el puntero canónico. La rama qa/syntax-audit-in625-a1 se verificó mediante head_branch de las corridas reales y canonical_branch de los índices bilaterales. Se documenta recuperación genérica por esos metadatos y, si hace falta, búsqueda de ramas con índice, sin regresar al S26 histórico ni cambiar default_branch. El puntero raíz sigue ausente; la guía alternativa no lo convierte en existente.
Chromium desktop/tablet/mobile y asignación/input MathLive no certifican todas las teclas/SO/motores ni persistencia universal del dominio. TODO/XFAIL/SKIP no son PASS. Global OPEN, porcentaje ND. S25,S19,SY-P23,SY-X04Plus y H2/SG28/DIST permanecen abiertos. X14Plus es un bloqueo adicional explícito; no volver a ejecutar el mismo rechazo hasta cambiar la precondición contractual. **Siguiente único: SY-X-15-BILATERAL**, texto con script tratado como texto o error, nunca HTML ejecutable, con recuperación y evidencia por canal.

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
