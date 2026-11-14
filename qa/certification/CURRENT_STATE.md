# r510 — IN-D-01 publicado; verificación automática en curso

Global **OPEN**. Autorización explícita del responsable recibida en esta conversación para publicar cambios y documentación y continuar el proyecto. El bloqueo anterior de aprobación automática queda resuelto. No se desplegó ni se activó SG28_EVALUATE_ISOLATION.

## Reconciliación y alcance
- HI-02..08: PASS_SCOPED bilateral de motor/API dedicada, revisado sobre Lite f8a584d9919c44b4d2648c1a1cad46d45a248210 y Plus 8fec1da908449f0013216c1e5005ccc0c70c4ccb. Fuente gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 2.D. Focales 27/27 Lite y 26/26 Plus.
- Evidencia HI: Lite Cumulative 43538668575 (2503 passed), H1d 43538668661 (22/22), Scientific 43538668517 (456/456); Plus Cumulative 43538686299 (3008 passed, cobertura 88.03%, frontend 1055 passed), H1d 43538686281 (38/38), Native 43538686293 (26+52). Guard skip=false; jobs/pasos/logs revisados. No son corridas nuevas de esta sesión.
- IN-D-01: fuente sección 3.A, sin(x)>1/2 en [0,2*pi) -> (pi/6,5*pi/6), con extremos abiertos. Tests anclan las tres celdas originales. Lite devuelve todas las ramas periódicas con k entero; la fila acotada corresponde a k=0. Plus certifica solo el período contractual mediante servicio y POST /api/v1/inequality; no se atribuye a esa respuesta una solución global periódica.
- Lite corrigió el intento de resolver raíces trigonométricas como polinomio. Plus solo añadió tests. Árboles publicados iguales a los árboles técnicos probados localmente; los SHA locales a8b6d3f/1021d77 son antecedentes locales, no los SHA remotos.

## Publicación y CI (push, sin dispatch manual)
| Motor | SHA técnico remoto | Gate / run | Estado al corte |
|---|---|---|---|
| Lite | e40c719b583a49808430850133fbff66fc6b376a | CI 43547279888 | SUCCESS |
| Lite | mismo | Cumulative 43547279964 / job 132301421356 | SUCCESS; 437 suites, 2507 passed, 8 expected fail, 34 TODO; focal 4/4 |
| Lite | mismo | H1d 43547279902 / job 132301421084 | SUCCESS; 22/22 |
| Lite | mismo | Scientific UI 43547279889 | IN_PROGRESS |
| Plus | 8adf1fd7b82c8cc0413c2ddd1fc1707ee7f46f7e | CI 43547189950 | backend IN_PROGRESS; frontend SUCCESS |
| Plus | mismo | Cumulative 43547189971 | backend IN_PROGRESS; frontend job 132301139614 SUCCESS, 1055 passed, 28 TODO |
| Plus | mismo | H1d 43547190003 / job 132301139765 | SUCCESS; 38/38 |

Logs revisados de Lite Cumulative/H1d y Plus H1d/frontend Cumulative: skip=false, evidence_run_id vacío; ejecución real. Runner push SUCCESS 43547279978/43547189955 es resumen, no prueba/dispatch adicional. No contar TODO/XFAIL/SKIP como PASS. IN-D-01 permanece VERIFYING, no cerrado bilateralmente.

## Validación local y trabajo independiente
- Lite árbol inicial: suite completa con un worker 437 suites / 2507 passed; typecheck/build PASS. La corrida local concurrente tuvo un timeout de AS-B-18, luego aprobado aislado y en el acumulativo serial sin ampliar timeouts.
- Plus: IN-D-01 + EC-HI 32/32; phase2 + SY-Q-06..09 17/17, con aviso de deprecación Starlette.
- Defecto de canal confirmado y en corrección local Lite: el lector de argumentos sin paréntesis absorbía > dentro de sin al pegar el núcleo LaTeX de IN-D-01. Nueva regresión reproduce el fallo; corrección de delimitadores relacionales aprobó 84 pruebas focales/parser/inecuaciones. Suite completa en curso; aún no publicada ni atribuida al SHA remoto anterior. No se certifica todavía pegado literal completo con sufijo de dominio ni E2E específico de este caso.

## Bloqueos separados
- Plus security 43538686314 terminó FAILURE: backend-security 132273956495 SUCCESS (pip-audit, Bandit y 24 tests); mutmut 132273991849 recibió shutdown signal a 2026-11-14T02:34:26Z y cancelación. Progreso parcial 5811/5834; sin informe final/score aceptado. Clasificación infraestructura; no retry idéntico. Jobs frontend omitidos no son PASS.
- EV-D-01 BLOCKED; S25/S19 requieren aceptación propia; H2/SG28 OPEN y DIST-01..08 BLOCKED hasta evidencia multinodo contractual. No se relajan oráculos, umbrales ni condiciones de salida.

## Siguiente acción única
Completar la corrección de canal Lite y su validación local; publicar el cambio técnico consolidado con expected_sha, verificar su nueva CI y la evidencia ya activa de Plus. Esperar/inspeccionar runs existentes, sin repetir equivalentes. Cerrar IN-D-01 solo con gates pertinentes realmente ejecutados y revisados; entonces iniciar IN-D-02. Actualizar índice, estado y log mediante commit documental que no active CI.
