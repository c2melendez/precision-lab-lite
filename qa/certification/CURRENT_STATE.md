# r512 — IN-D-02 publicado y en verificación; IN-D-01 cerrado

Global **OPEN**. Último caso cerrado: **TRIG-IN-D-01 PASS_SCOPED bilateral**, con evidencia y límites en la entrada r511 del log. No se reejecutaron sus gates por los commits documentales.

## IN-D-02: contrato y cambio técnico
Fuente gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 3.A: cos(x)≤0 en [0,2π) -> [π/2,3π/2], incluidos ambos extremos.
- Lite SHA técnico 37227c30e638d1f46b24a8f874915ce958aa02cf: el test-first reprodujo roots no polinómico en ASCII y núcleo LaTeX. La corrección reconoce exactamente cos(variable)≤0 y devuelve todos los períodos con k entero; k=0 reproduce la fila. Cinco pruebas permanentes: fila completa, dos canales, signos/extremos y controles negativos. No solver trigonométrico general ficticio.
- Plus SHA técnico 0575e1dce1af03ac5e46348ad5c47ac36a266ab7: solo tests; servicio y POST /api/v1/inequality ya devolvían Interval(pi/2,3*pi/2). Tres pruebas de fuente/servicio, HTTP y oráculo de signos. Alcance de período contractual, sin afirmar respuesta periódica global.
- Validación local Lite: 438 suites / 2518 passed, 8 expected fail y 34 TODO, con un worker (228.90s); 89 focales/parser/inecuaciones PASS; typecheck/build PASS. Plus IN-D-01/02 y phase2: 18/18 PASS, una advertencia Starlette. No ejecución backend local completa.
- Cambios publicados con expected_sha sobre los cierres documentales 9d1a149e/2c0e0063. Autorización explícita de publicación vigente; sin producción ni releases.

## Corridas automáticas del SHA exacto (push)
| Motor | Workflow | Run |
|---|---|---|
| Lite | CI | 43549505429 |
| Lite | Cumulative | 43549505495 |
| Lite | H1d | 43549505444 |
| Lite | Scientific UI | 43549505417 |
| Plus | CI | 43549522361 |
| Plus | Cumulative | 43549522414 |
| Plus | H1d | 43549522371 |

Al observarlas estaban IN_PROGRESS. Decisión **WAIT**: no dispatch manual ni repetición equivalente. Runner push 43549505418/43549522350 SUCCESS solo genera resumen; no cuenta como test. IN-D-02 **NO certificado** hasta conclusión y revisión de jobs/pasos/logs, incluyendo source/oráculos y omisiones. La CI local no sustituye esos gates.

## Cierre anterior conservado
IN-D-01: Lite 7cb5581 con CI 43547932983, Cumulative 43547933065 (2513 passed; focal 10/10), H1d 43547933019 (22/22), Scientific 43547932993 (456/456), todos SUCCESS. Plus 8adf1fd7 con CI 43547189950 (3011 passed), Cumulative 43547189971 (3011 passed, 88.00%, focal 3/3), H1d 43547190003 (38/38), todos SUCCESS. Jobs/pasos/logs revisados; guard skip=false y sin REUSE interno; TODO/XFAIL/SKIP fuera del PASS. Ver r511 para alcance y huellas; el cambio actual requiere evidencia propia.

## Bloqueos y siguiente acción única
EV-D-01 BLOCKED; S25/mutación independiente sin score aceptado por shutdown del runner 43538686314/job 132273991849, sin retry idéntico; H2/SG28 OPEN; DIST-01..08 BLOCKED. SG28_EVALUATE_ISOLATION sigue off por defecto. No se certifica pegado literal del sufijo de dominio completo ni UI específica de las filas.

Consultar las siete corridas anteriores y sus jobs/logs, clasificar/corregir fallos confirmados y cerrar IN-D-02 solo con evidencia pertinente. No repetir gate verde/equivalente ni usar el Runner como prueba. Tras cierre bilateral, iniciar IN-D-03. Este corte no promete ejecución fuera de la sesión activa.
