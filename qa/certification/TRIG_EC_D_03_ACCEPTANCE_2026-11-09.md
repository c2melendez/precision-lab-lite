# Aceptación: Trigonometría EC-D-03

- Estado: **PASS_SCOPED bilateral**.
- Fuente congelada: qa/certification/legacy_sources/ejercicios_trigonometria.md.gz; blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb.
- Fila original: EC-D-03; ecuación \(\tan x=\sqrt{3}\); resultado esperado \(x=\frac{\pi}{3}+k\pi,\ k\in\mathbb{Z}\). La matriz exige la familia infinita completa, no una lista finita dentro de un período.
- SHA verificado Lite: d10a2cd2d6032fb7b2c87afaa290fe1b82773d45. El cambio de motor está en eaac526b0740c19af914fc14c472a1e9d56e4e88; el SHA verificado incluye el test definitivo y ejecutó los gates.
- Test Lite: tests/trigonometryEcD03.audit.test.ts. Ancla la fila congelada y exige una única expresión paramétrica con k y π. Comprueba la forma \(\pi/3+k\pi\) y la ecuación original para k = -3, 0 y 2; el paso explica que k pertenece a los enteros.
- Lite CI [42712032373](https://github.com/c2melendez/precision-lab-lite/actions/runs/42712032373) SUCCESS: typecheck, auditoría de dependencias y build correctos; 396 archivos, 2,402 pruebas aprobadas, 8 XFAIL esperados y 34 TODO.
- Lite Cumulative [42712032384](https://github.com/c2melendez/precision-lab-lite/actions/runs/42712032384) SUCCESS: los dos tests EC-D-03 PASSED explícitamente; 396 archivos, 2,402 pruebas aprobadas, 8 XFAIL esperados y 34 TODO. Guard: skip=false, evidence_run_id vacío; ejecución real en este SHA.
- Lite H1d [42712032789](https://github.com/c2melendez/precision-lab-lite/actions/runs/42712032789) SUCCESS: 22/22; guard skip=false y sin reutilización.
- Lite Scientific UI [42712032408](https://github.com/c2melendez/precision-lab-lite/actions/runs/42712032408) SUCCESS: 456/456 en desktop, tablet y mobile.
- Lite Runner [42712032501](https://github.com/c2melendez/precision-lab-lite/actions/runs/42712032501) SUCCESS, push-only; no hubo dispatch manual.

## Plus (evidencia bilateral)

- SHA verificado Plus: d02a3076b57d9bb2cd02d7c89e1bce3e176a9055.
- Test Plus: backend/tests/test_trigonometry_ec_d03.py; ancla la fila original y verifica POST /api/v1/solve con tan(x)=sqrt(3). La respuesta contiene una sola ImageSet sobre Integers, serializada como texto y LaTeX. El backend obtiene la familia con solveset y verifica simbólicamente que el residuo de la ecuación es cero al sustituir la expresión de la ImageSet.
- Plus Cumulative [42712350673](https://github.com/c2melendez/precision-lab-plus/actions/runs/42712350673) SUCCESS: ambos tests EC-D-03 PASSED explícitamente; backend 2,927 passed, 1 skipped, 11 xfailed. Guard: skip=false, evidence_run_id vacío.
- Plus CI [42712350706](https://github.com/c2melendez/precision-lab-plus/actions/runs/42712350706) SUCCESS: backend y frontend; backend 2,927 passed, 1 skipped, 11 xfailed.
- Plus H1d [42712350501](https://github.com/c2melendez/precision-lab-plus/actions/runs/42712350501) SUCCESS: 38 passed; guard skip=false, sin reutilización.
- Plus Native Syntax and Recovery [42712350400](https://github.com/c2melendez/precision-lab-plus/actions/runs/42712350400) SUCCESS: 52 passed, desktop/tablet/mobile.
- Plus Runner [42712350393](https://github.com/c2melendez/precision-lab-plus/actions/runs/42712350393) SUCCESS, evento push; sin dispatch manual.

## Alcance y límites

- Verificado bilateralmente: la solución general es la familia \(x=\frac{\pi}{3}+k\pi,\ k\in\mathbb{Z}\). No se reduce a dos raíces de un período.
- Las pruebas de los endpoints usan texto ASCII para la ecuación. La fila LaTeX original se ancla a la matriz, pero este caso no certifica la ingesta literal LaTeX en todos los endpoints ni un flujo UI específico de EC-D-03.
- Resultado: **PASS_SCOPED**, no cierre de la matriz trigonométrica ni de IN625.
- Certificación global: **OPEN**. EV-D-01 en Plus /api/v1/evaluate permanece BLOCKED; EV-HI mantiene PASS_SCOPED; S25, SG28, H2 y DIST continúan abiertos.
- El workflow Plus Certification dependency and security gates 42712350624 sigue IN_PROGRESS en plus-backend-mutmut; es una revisión global separada y no se utiliza como oráculo ni como gate de aceptación de EC-D-03.
