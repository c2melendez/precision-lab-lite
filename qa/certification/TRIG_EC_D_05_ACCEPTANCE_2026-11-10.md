# Aceptación: Trigonometría EC-D-05

- Estado: **PASS_SCOPED bilateral**.
- Fuente congelada: \`qa/certification/legacy_sources/ejercicios_trigonometria.md.gz\`; blob \`3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb\`.
- Fila original: EC-D-05; ecuación \(\sin x+\cos x=1\), intervalo \(x\in[0,2\pi)\); resultado esperado \(\{0,\pi/2\}\).
- Oráculo focal: exactamente dos raíces reales distintas, ambas dentro del intervalo semiabierto y ambas verificadas por sustitución en la ecuación original. No se acepta una raíz adicional ni una representación fuera del intervalo.

## Lite

- SHA técnico verificado: \`28964186aa61be64924d49e83e929ea724fc7383\`.
- Test: \`tests/trigonometryEcD05.audit.test.ts\`; ambos tests PASSED explícitamente en CI y Cumulative: anclaje a la fila congelada y solución exacta \(\{0,\pi/2\}\), intervalo y sustitución.
- CI [42732509176](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509176) SUCCESS: 398 archivos, 2,406 passed, 8 XFAIL esperados, 34 TODO; typecheck, auditoría, unit/parity y build SUCCESS.
- Cumulative [42732509088](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509088) SUCCESS: focal 2/2; 398 archivos, 2,406 passed, 8 XFAIL y 34 TODO. Guard \`skip=false\`, \`evidence_run_id=""\`; ejecución real sobre este SHA.
- H1d [42732509506](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509506) SUCCESS: 22/22; guard \`skip=false\`, \`evidence_run_id=""\`.
- Runner [42732509098](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509098) SUCCESS, push-only; sin dispatch manual.
- Scientific UI [42732509163](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509163) seguía IN_PROGRESS al corte en \`Native desktop/tablet/mobile scientific result verification\`; se registra como verificación complementaria no utilizada como oráculo matemático de EC-D-05.
- Implementación acotada: sustitución \(t=\tan(x/2)\), con \(\sin x=2t/(1+t^2)\), \(\cos x=(1-t^2)/(1+t^2)\). El numerador transformado es \(2t(1-t)\), con \(t=0,1\), que devuelve \(x=0,\pi/2\). Se normalizan candidatos al intervalo y se verifican en la ecuación original.
- Prefiltro estructural previo a CAS: solo invoca la simplificación costosa cuando la ecuación contiene simultáneamente \(\sin(x)\) y \(\cos(x)\). Con ello el test de timeout preexistente AS-AVS-10 dejó de fallar en el SHA aceptado.

## Plus

- SHA técnico verificado: \`971774693b5e3bd35cebe188be2fa8d9d96a55dd\`.
- Test: \`backend/tests/test_trigonometry_ec_d05.py\`. Los dos tests PASSED explícitamente en Cumulative: anclaje a la fila congelada y POST \`/api/v1/solve\` con las dos raíces exactas.
- Cumulative [42731929122](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929122) SUCCESS: backend 2,931 passed, 1 skipped, 11 xfailed; guard \`skip=false\`, \`evidence_run_id=""\`. Frontend: 150 archivos, 1,055 passed, 28 TODO.
- CI [42731929126](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929126) SUCCESS: backend 2,931 passed, 1 skipped, 11 xfailed; frontend 150 archivos, 1,055 passed; typecheck y build SUCCESS.
- H1d [42731929115](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929115) SUCCESS: 38/38; guard \`skip=false\`, \`evidence_run_id=""\`.
- Runner [42731929156](https://github.com/c2melendez/precision-lab-plus/actions/runs/42731929156) SUCCESS, push-only; sin dispatch manual.
- El motor Plus no requirió cambios de producto: SymPy resolvió la ecuación por su camino general a las dos raíces exactas. Se prueba el endpoint \`POST /api/v1/solve\) con entrada ASCII.

## Alcance y límites

- Resultado certificado: conjunto exacto \(\{0,\pi/2\}\) dentro de \([0,2\pi)\). No se certifica una generalización a cualquier combinación lineal de seno y coseno ni una familia periódica sobre toda \(\mathbb R\).
- Las entradas de cálculo se envían como texto ASCII/forma normalizada. La fila fuente se ancla como fixture, pero EC-D-05 no certifica ingesta literal LaTeX en Plus \`/api/v1/evaluate\), ni una interfaz dedicada a este ejercicio.
- Scientific UI Lite [42732509163](https://github.com/c2melendez/precision-lab-lite/actions/runs/42732509163) permanecía IN_PROGRESS al redactar el acta. No se afirma resultado para ese E2E complementario; no sustituye ni invalida las pruebas focales y gates matemáticos cerrados.
- Resultado: **PASS_SCOPED bilateral**; no cierra la matriz trigonométrica ni la certificación global.
- Certificación global: **OPEN**. EV-D-01 en Plus \`/api/v1/evaluate\` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos. Plus security/mutation [42730139009](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730139009) sigue IN_PROGRESS en \`plus-backend-mutmut\`, independiente y no bloqueante para EC-D-05.
