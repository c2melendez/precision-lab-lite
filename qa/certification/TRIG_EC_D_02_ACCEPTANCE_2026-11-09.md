# Aceptación: Trigonometría EC-D-02

- Estado: **PASS_SCOPED bilateral**.
- Fuente congelada: \`qa/certification/legacy_sources/ejercicios_trigonometria.md.gz\`, blob \`3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb\`.
- Fila original: \`EC-D-02\`; ecuación \`2\cos x-1=0,\quad x\in[0,2\pi)\`; resultado esperado \`x=\frac{\pi}{3},\ \frac{5\pi}{3}\`. La fila tiene tres columnas (ID, ejercicio y resultado esperado); no hay una nota separada.
- SHA técnico Lite: \`5e58fda3bb98c90520bfc5cf833f4222009fa1b1\`.
- Test focal: \`tests/trigonometryEcD02.audit.test.ts\`; ambas pruebas pasan en CI y Cumulative. El caso entra por \`parseExpression\` con el literal normalizado \`2\cos\left(x\right)-1=0\`, verifica las dos raíces exactas, el intervalo y la sustitución en la ecuación original.
- CI [42708572030](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708572030) SUCCESS: typecheck, auditoría de dependencias, 395 archivos de test / 2,400 pruebas PASS, 8 XFAIL esperados, 34 TODO; build de producción correcto.
- Cumulative [42708571839](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708571839) SUCCESS: test focal EC-D-02 2/2 PASS; 395 archivos / 2,400 pruebas PASS, 8 XFAIL esperados, 34 TODO. Guard: \`skip=false\`, \`evidence_run_id=""\`; la evidencia se ejecutó realmente en este SHA.
- H1d [42708572192](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708572192) SUCCESS, 22/22; guard \`skip=false\`, sin \`evidence_run_id\`.
- Runner [42708571827](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708571827) SUCCESS, evento push; sin dispatch manual.
- Scientific UI [42708571826](https://github.com/c2melendez/precision-lab-lite/actions/runs/42708571826) seguía IN_PROGRESS en la verificación nativa desktop/tablet/mobile al corte. Es complementario y no se usó como oráculo matemático del caso, en línea con el alcance aplicado a EC-D-01.

## Alcance y límites

- Verificado: conjunto exacto \`{\pi/3,5\pi/3}\` en \`[0,2\pi)\`, pertenencia al intervalo y sustitución en la ecuación original.
- No se certifica aquí la familia periódica infinita de todas las soluciones en \(\mathbb R\); ese contrato es distinto y corresponde, entre otros, a EC-D-03.
- No se afirma certificación de UI de entrada para este caso; Lite prueba el motor/parser de forma directa.
- Resultado: **PASS_SCOPED**, no cierre de la matriz trigonométrica ni de IN625.
- Certificación global: **OPEN**. EV-D-01 de Plus en \`/api/v1/evaluate\` permanece BLOCKED; EV-HI mantiene PASS_SCOPED; S25, SG28, H2 y DIST continúan abiertos.
