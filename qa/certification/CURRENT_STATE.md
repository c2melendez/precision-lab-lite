# r527 — IN-D-05 PASS_SCOPED reconciliado; siguiente IN-D-06

Global OPEN. Se recuperaron árboles recursivos Git completos (truncated=false) para ambos HEAD y SHA técnicos; tras exclusiones exactas del planificador, los insumos coinciden bilateralmente. Huellas SHA-256 calculadas con planner_version 2, gates y acceptance_revision reales; se registran en continuity.json. Se consultaron runs push por rama/SHA y jobs/pasos/logs, sin confundir PR vacío con ausencia de CI.

Lite SHA e09f87202495b24c672d848a9434d71534a0c10a: CI 43637613602, Cumulative 43637613663 (2536 passed, 8 expected fail, 34 TODO, focal 6/6), H1d 43637613567 (22/22) y Scientific 43637613653 (456/456) ejecutados y revisados. Plus SHA aa1f2821bb2d4df92dc94db0848a67141f4fb76a: CI 43647668655 (3031 passed, 1 skipped, 11 xfailed); Cumulative 43647668540 backend/job 132608950017 (3031 passed, 1 skipped, 11 xfailed; IN-D-05 6/6 y AS-PAR-05 39.24 s), frontend/job 132608950218 (1055 passed, 28 TODO); H1d 43647668555/job 132608950102 (38/38) y Native 43647668581/job 132608950399 (26 desktop, 52 tablet/móvil). Guards revisados skip=false y SHA correcto; CI y Runner no sustituyen gates. SKIP/XFAIL/TODO no son PASS.

Alcance de la fila: parser/motor Lite periódico y servicio/HTTP Plus normalizado con advertencia del dominio [0,2π); no ingreso literal completo del sufijo de dominio ni E2E dedicado de fila. IN-D-05 se cierra PASS_SCOPED, no certificación global. Seguridad Plus 43647668563/job 132609068047 está en curso; auditoría/mutación frontend omitidas no son PASS. S25, SG28/DIST y EV-D-01 permanecen BLOCKED.

## Siguiente acción única
IN-D-06: `sin x cos x>0`, x∈[0,2π), solución (0,π/2) ∪ (π,3π/2). Congelar las tres celdas de la fuente, prueba test-first bilateral de parser/motor y servicio/HTTP, signos y exclusión de extremos; corregir solo brechas demostradas, publicar con expected_sha y verificar gates automáticos. No avanzar a IN-D-07.

