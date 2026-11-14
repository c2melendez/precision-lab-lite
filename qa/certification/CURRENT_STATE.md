# r526 — Reconciliación requerida por pérdida de continuidad

Global OPEN. El índice r525 de Lite omitió gates, evidencia, bloqueos, historial de runs y exclusiones; el de Plus omitió gates de evidencia y reemplazó la huella acumulativa por un marcador no calculado. Se recuperan las estructuras y antecedentes del índice r523 sin borrar r525; los datos anteriores son históricos, no prueba automática para el HEAD actual. Se conserva el SHA técnico Plus aa1f2821bb2d4df92dc94db0848a67141f4fb76a y el run Cumulative 43647668540 reportado en r525 para revisión. No se declara REUSE ni se despacha CI basándose en una huella textual.

Única acción siguiente: recuperar HEAD y runs completos push/PR de ambos productos, comparar árboles auténticos y acceptance_revision con `scripts/certification/continuity.py`, revisar gates del SHA técnico Plus aa1f2821 y reconciliar cierre IN-D-05 antes de ejecutar IN-D-06. Conservar S25, SG28/DIST y EV-D-01 BLOCKED hasta su evidencia propia; no repetir corridas equivalentes.

---

# r525 — IN-D-05: cierre bilateral PASS_SCOPED tras fix Plus de timeout

Global OPEN; IN-D-05 se cierra PASS_SCOPED. Plus Cumulative 43647668540 SUCCESS sobre SHA técnico aa1f2821bb2d4df92dc94db0848a67141f4fb76a (filtro estructural en arccot handler). Lite mantiene evidencia SUCCESS previa. No se relajó oráculo.

S25, SG28/DIST y EV-D-01 siguen BLOCKED.

Siguiente acción única: iniciar IN-D-06.

---

# r524 — sync with Plus Native SUCCESS and Cumulative WAIT on timeout fix

Global OPEN; IN-D-05 no se cierra. Sincronizado con Plus: Native SUCCESS, Cumulative en verificación del fix de timeout AS-PAR-05.

Siguiente acción única: esperar revisión del Cumulative Plus.
