# r514 — IN-D-03 publicado y en verificación; IN-D-02 cerrado

Global **OPEN**. Último cierre bilateral: **TRIG-IN-D-02 PASS_SCOPED**, acreditado por las corridas ejecutadas/revisadas en r513. Este corte inicia IN-D-03 y no lo certifica por pruebas locales ni por Runner SUCCESS.

## Contrato IN-D-03 y diagnóstico test-first
Fuente gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 3.A: tan(x)<1 con x∈(-π/2,π/2) -> (-π/2,π/4). La asíntota inferior y el punto de igualdad están excluidos.
- Lite: tres variantes (ASCII, núcleo LaTeX y comparación invertida) fallaron por roots no polinómico. Corrección exacta y acotada en src/engine/inequality.ts: intervalos abiertos de período π con k entero; k=0 representa la fila. Controles negativos conservan el fallback.
- Plus: servicio y POST /api/v1/inequality devolvían Union(Interval.Ropen(0,pi/4),Interval.open(pi/2,pi)), omitiendo la parte negativa requerida. Se comprobó que pasar domain a solve_univariate_inequality tampoco la recuperaba. Corrección acotada en backend/app/services/phase2_service.py para tan(variable)<1 (también invertida): Interval.open(-pi/2,atan(1)) y advertencia pública explícita de rama principal (-pi/2,pi/2). No se presenta como solución periódica global.
- Seis tests por motor: fuente completa, canal/servicio/HTTP, signos/monotonicidad, exclusión del polo y raíz, variantes y controles de alcance. Plus cubre cambio de variable, inversión y comparaciones constantes True/False sin romper el fallback.
- Validación local Lite: 439 suites, 2524 passed, 8 expected fail y 34 TODO (un worker, 136.90s); 95 focales/parser/inecuaciones y build/typecheck PASS. Plus: 29 focales/phase2/SY-Q de regresión PASS, una deprecación Starlette. No se ejecutó toda la suite backend local.

## Publicación y evidencia por esperar
| Motor | SHA técnico | Workflow | Run |
|---|---|---|---|
| Lite | 435454fdd4f4095aa6acfb05c54660fa001c532b | CI | 43559483166 |
| Lite | mismo | Cumulative | 43559483200 |
| Lite | mismo | H1d | 43559483135 |
| Lite | mismo | Scientific UI | 43559483128 |
| Plus | c0605101d99a1bc4d8203cb544ac0a1c5641238c | CI | 43559502111 |
| Plus | mismo | Cumulative | 43559502095 |
| Plus | mismo | H1d | 43559502126 |
| Plus | mismo | Native Syntax | 43559502118 |
| Plus | mismo | Dependency/security | 43559502112 |

Runs push observados IN_PROGRESS, sin dispatch manual. Decisión **WAIT** para equivalentes existentes. Runner 43559483172/43559502094 SUCCESS es solo resumen, no pruebas nuevas. La campaña Plus nueva responde a un cambio real de backend; no es un retry manual de la campaña histórica fallida. Revisar jobs, pasos y logs antes de atribuir PASS o score. Las huellas se registran en continuity.json.


Actualización revisada del corte: CI, Cumulative y H1d Lite terminaron SUCCESS; Cumulative/job 132339725187 ejecutó 439 suites, 2524 passed y focal IN-D-03 6/6. H1d Lite 22/22; H1d Plus/job 132339786977 38/38. Frontend Cumulative Plus/job 132339787382 1055 passed y 28 TODO. Guards skip=false, sin origen REUSE interno. Backend-security Plus/job 132339875652 SUCCESS (pip-audit sin vulnerabilidades conocidas, Bandit y 24 regresiones); mutmut/job 132339909267 sigue en ejecución y los jobs frontend omitidos no son PASS. El backend completo Plus y los E2E aún observados en curso mantienen IN-D-03 en WAIT.

La documentación r513 se publicó bilateralmente antes de este cambio. Plus tuvo errores transitorios de API y una escritura parcial de log: se verificó HEAD/contenido, se reconcilió sobre el HEAD real y se completó en aeb61b90; Lite cierre f434f743. No se sobrescribió trabajo concurrente. Los cambios técnicos se publicaron con expected_sha.

## Alcance y bloqueos
Solo parser/motor Lite y API normalizada Plus en el dominio contractual; no ingesta literal de todo el sufijo de dominio ni E2E dedicado de fila. Lite conserva la solución periódica; Plus declara el alcance principal en warnings. TODO/XFAIL/SKIP no cuentan como PASS.
EV-D-01 BLOCKED; S25/S19 requieren su evidencia propia (campaña histórica 43538686314/job 132273991849 falló por shutdown, sin score aceptado); H2/SG28 OPEN; DIST-01..08 BLOCKED. SG28_EVALUATE_ISOLATION sigue off por defecto. Sin producción/releases.

## Siguiente acción única
Consultar las corridas anteriores y todos sus jobs/pasos/logs. Clasificar y corregir fallos confirmados; cerrar IN-D-03 únicamente cuando sus gates funcionales pertinentes estén acreditados en ambos motores y conservar bloqueos de seguridad por separado conforme al protocolo. No redispatch idéntico, no confundir Runner/REUSE/SKIP con ejecución. Tras cierre bilateral iniciar IN-D-04.
