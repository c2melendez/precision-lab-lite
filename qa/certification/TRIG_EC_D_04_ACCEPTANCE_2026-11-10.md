# Aceptación: Trigonometría EC-D-04

- Estado: **PASS_SCOPED bilateral**.
- Fuente congelada: qa/certification/legacy_sources/ejercicios_trigonometria.md.gz; blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb.
- Fila original: EC-D-04; ecuación \(2\sin^{2}x-\sin x-1=0\), intervalo \(x\in[0,2\pi)\); resultado esperado \(\{\,\pi/2,\ 7\pi/6,\ 11\pi/6\,\}\).
- Oráculo focal: las tres raíces exactas, distintas, pertenecen al intervalo semiabierto y satisfacen la ecuación original por sustitución. No se acepta una raíz adicional ni una representación fuera del intervalo.

## Lite

- SHA técnico verificado: 9663f1625fcca7cc668c61d55f844453eb90dfd0.
- Test: tests/trigonometryEcD04.audit.test.ts. Los dos tests PASSED explícitamente: anclaje a la matriz congelada y resolución del conjunto exacto de tres raíces con intervalo y sustitución.
- CI [42730206344](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206344) SUCCESS: typecheck, auditoría de dependencias, unit/parity y build; 397 archivos, 2,404 passed, 8 XFAIL esperados y 34 TODO.
- Cumulative [42730206373](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206373) SUCCESS: EC-D-04 2/2; 397 archivos, 2,404 passed, 8 XFAIL y 34 TODO. Guard skip=false, evidence_run_id vacío; se ejecutó la suite en este SHA.
- H1d [42730206364](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206364) SUCCESS: 22/22; guard skip=false y sin reutilización.
- Scientific UI [42730206324](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206324) SUCCESS: 456 passed en desktop, tablet y mobile; guard skip=false y evidence_run_id vacío.
- Runner [42730206411](https://github.com/c2melendez/precision-lab-lite/actions/runs/42730206411) SUCCESS, push-only; sin dispatch manual.
- Implementación acotada: sustitución \(u=\sin x\), resolución del polinomio cuadrático, generación de ambas ramas reales, normalización al intervalo, deduplicación y comprobación por sustitución en la ecuación original.

## Plus

- SHA técnico verificado: 633ec35dc8de728c657cd00907328a2ff6f5c2eb.
- Test: backend/tests/test_trigonometry_ec_d04.py. Los dos tests PASSED explícitamente en Cumulative: anclaje a la fila congelada y POST /api/v1/solve con las tres raíces exactas del intervalo.
- Cumulative [42730138929](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138929) SUCCESS: backend 2,929 passed, 1 skipped, 11 xfailed; guard skip=false y evidence_run_id vacío. Frontend: 150 archivos, 1,055 passed y 28 TODO; typecheck y build SUCCESS.
- CI [42730138619](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138619) SUCCESS: backend 2,929 passed, 1 skipped, 11 xfailed; frontend 150 archivos y 1,055 passed; typecheck, auditoría y build SUCCESS.
- H1d [42730138616](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138616) SUCCESS: 38/38; guard skip=false y sin reutilización.
- Native Syntax and Recovery [42730138595](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138595) SUCCESS: 52/52 en desktop, tablet y mobile; guard skip=false y evidence_run_id vacío.
- Runner [42730138951](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730138951) SUCCESS, push-only; sin dispatch manual.
- Implementación acotada: sustitución \(u=\sin x\), resolución del polinomio cuadrático, construcción de ambas ramas del seno en el intervalo y verificación de cada raíz en la ecuación original.

## Alcance y límites

- Resultado certificado: conjunto exacto de tres raíces reales de la ecuación original dentro de \([0,2\pi)\). No se afirma que este conjunto finito represente todas las soluciones sobre \(\mathbb R\); el intervalo es parte del contrato.
- Las entradas de cálculo usan texto ASCII/forma normalizada. La fila LaTeX de la matriz se ancla como fixture, pero EC-D-04 no certifica ingesta literal LaTeX en todos los endpoints, en particular Plus /api/v1/evaluate, ni un flujo UI dedicado a este ejercicio.
- Resultado: **PASS_SCOPED bilateral**; no cierra la matriz trigonométrica ni la certificación global.
- Certificación global: **OPEN**. EV-D-01 en Plus /api/v1/evaluate permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
- Plus Certification dependency and security gates [42730139009](https://github.com/c2melendez/precision-lab-plus/actions/runs/42730139009) sigue IN_PROGRESS en plus-backend-mutmut; es una revisión global separada y no se usa como oráculo ni como gate de aceptación de EC-D-04.
