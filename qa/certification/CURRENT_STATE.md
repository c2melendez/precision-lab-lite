# r511 — TRIG-IN-D-01 PASS_SCOPED bilateral; siguiente IN-D-02

Global **OPEN**. Fuente congelada: gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 3.A. IN-D-01: sin(x)>1/2, x∈[0,2π) -> (π/6,5π/6), extremos abiertos. Se revisaron resultados, jobs, pasos y logs de los SHA técnicos publicados.

## Evidencia de cierre
| Motor | SHA de evidencia | Gate / run | Resultado ejecutado |
|---|---|---|---|
| Lite | 7cb558112afb6a78361fbedda64bc35ebf00ba14 | CI 43547932983 | SUCCESS, typecheck/tests/build |
| Lite | mismo | Cumulative 43547933065 / job 132303487898 | 437 suites; 2513 passed, 8 expected fail, 34 TODO; focal IN-D-01 10/10 |
| Lite | mismo | H1d 43547933019 / job 132303488076 | 22/22 |
| Lite | mismo | Scientific UI 43547932993 / job 132303487536 | 456/456 desktop/tablet/mobile |
| Plus | 8adf1fd7b82c8cc0413c2ddd1fc1707ee7f46f7e | CI 43547189950 | backend 3011 passed, cobertura 88.03%; frontend SUCCESS |
| Plus | mismo | Cumulative 43547189971 / backend 132301139865, frontend 132301139614 | backend 3011 passed, 1 skipped, 11 xfailed, cobertura 88.00%; IN-D-01 3/3 PASSED explícitos; frontend 1055 passed, 28 TODO |
| Plus | mismo | H1d 43547190003 / job 132301139765 | 38/38 |

Todos los jobs requeridos de esos gates terminaron SUCCESS y ninguno omitió sus pasos. Guards de acumulativo/H1d/Scientific: skip=false y evidence_run_id vacío. No se atribuyen pruebas nuevas a los Runner push (solo resumen). TODO/XFAIL/SKIP no se convierten en PASS.

## Cambios y límites
- Lite e40c719b incorporó la desigualdad periódica exacta; 7cb5581 corrigió el lector de argumentos LaTeX que absorbía el operador relacional. IN-D-01 ahora prueba núcleo LaTeX, variantes ASCII/Unicode y macros de comparación, además de controles negativos. La corrección de parser pasó 2513 pruebas locales, typecheck/build y los gates anteriores.
- Lite devuelve todos los intervalos periódicos con k entero; k=0 representa el dominio congelado [0,2π). Plus mantiene su respuesta de período principal por servicio y POST /api/v1/inequality. No se certifica su respuesta como solución periódica global.
- Alcance: canal de motor/parser Lite y API normalizada Plus. La anotación de dominio se conserva como contexto contractual de la fila; no se afirma ingesta literal de todo el sufijo ni un E2E dedicado IN-D-01. La suite visual general es evidencia de regresión.
- Huellas técnicas de HEAD documental Plus 09a2f6af y origen 8adf1fd7 idénticas; Lite HEAD 7cb5581 coincide con su evidencia. Las huellas de gates se registran en continuity.json. Los commits documentales d3ec34ef/09a2f6af no generaron CI; no se relanzaron gates verdes.
- La autorización explícita del usuario resolvió el bloqueo de publicación anterior. Código y documentación se publicaron con expected_sha; sin producción/releases ni activación de SG28.

## Continuación
IN-D-02: cos(x)≤0, x∈[0,2π) -> [π/2,3π/2]. Preparación local test-first: Plus 3/3 focal y 18/18 con phase2/IN-D-01; no requiere cambio de producto. Lite reprodujo roots no polinómico; corrección acotada de umbral cero y extremos cerrados, ASCII + núcleo LaTeX y controles negativos: 89 pruebas focales/parser/inecuaciones PASS, typecheck/build PASS; acumulativo local en curso. Publicar solo el cambio técnico consolidado tras esa validación y verificar su CI automática. IN-D-02 aún NO certificado.

## Bloqueos independientes
SECURITY-S25/mutación Plus 43538686314: fallo por shutdown signal del runner, sin score final; backend-security pasó, jobs omitidos no cuentan. No retry idéntico. EV-D-01 BLOCKED; H2/SG28 OPEN; DIST-01..08 BLOCKED hasta aceptación multinodo real. SG28_EVALUATE_ISOLATION sigue off por defecto. Los cierres matemáticos acotados no cierran la certificación global.

Siguiente acción única: completar/publicar IN-D-02 en ambos repositorios y revisar sus gates. No repetir CI de IN-D-01 por esta actualización documental.
