# Algebra114 AS-EXP-08 — aceptación acotada (r369)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus ni cierre de Algebra114 o de la certificación global.

## Identidad técnica

- Repositorio: `c2melendez/precision-lab-lite`.
- Rama canónica: `qa/syntax-audit-in625-a1`.
- SHA exacto probado: `a1a69ae9429afc9481d9febf34885b9242968917`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-EXP-08.
- Test: `tests/algebra114AsExp08.audit.test.ts`.
- Blob del test: `08c80b237acf7d5c5ce072ee32ad904b54a29c25`.

## Caso y oráculo

La fila original exige expandir:

`(x+2)(x-3)(x+1) = x^3 - 7x - 6`.

El test:
1. exige la fila exacta de la matriz en el fixture Markdown;
2. compara el multiconjunto simbólico normalizado `x^3`, `-7*x`, `-6`;
3. comprueba seis sustituciones `x = [-4, -2, -1, 0, 3, 5]` contra aritmética JavaScript independiente `x*x*x - 7*x - 6`.

Algebrite se usa para producir la expansión y evaluar la sustitución, pero no genera los valores esperados del oráculo.

## Evidencia exacta en el mismo SHA

- CI [41144965662](https://github.com/c2melendez/precision-lab-lite/actions/runs/41144965662): **SUCCESS**. 366 archivos de prueba aprobados; typecheck, regresión de unidad/paridad, audit de dependencias y build aprobados. El log identifica el test focalizado como aprobado.
- Acumulativo [41144965700](https://github.com/c2melendez/precision-lab-lite/actions/runs/41144965700): **SUCCESS**. `skip=false`, checkout exacto del SHA anterior y ejecución real de la suite: 366 archivos / 2,259 pruebas aprobadas, 8 fallos esperados y 34 TODO. El test AS-EXP-08 se ejecutó y aprobó.
- H1d [41144965719](https://github.com/c2melendez/precision-lab-lite/actions/runs/41144965719): **SUCCESS**, 22 E2E aprobados.
- Certification Runner push [41144965611](https://github.com/c2melendez/precision-lab-lite/actions/runs/41144965611): **SUCCESS** para resolución de rama, checkout, SHA base, huella y resumen push/no-dispatch. Los pasos de dispatch, recibo, persistencia y commit documental fueron omitidos en este evento; no se certifican aquí.

## Decisión y límites

AS-EXP-08 queda **PASS_SCOPED en Lite**. La evidencia cubre esta fila y los gates indicados sobre el SHA exacto; no se infiere que Plus haya ejecutado el caso ni que el motor completo esté certificado.

La reconciliación documental posterior a `a1a69ae9429afc9481d9febf34885b9242968917` no cambió entradas técnicas: compare confirma únicamente CURRENT_STATE, EXECUTION_LOG, continuity.json y dos registros numéricos del Runner. El baseline técnico queda anclado al SHA probado y las rutas documentales quedan excluidas por lista explícita.

**Certificación global: OPEN.** Próximo caso matemático: AS-EXP-09, test-first, con fixture original y oráculo aritmético independiente.
