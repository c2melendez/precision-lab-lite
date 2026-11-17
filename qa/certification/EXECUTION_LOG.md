# r582 — LM-D-03 cumulative failed on regex; H1d success; fix applied

Lite 58a4e56029c881629c8be2dd42ae42253a9bf912: H1d 44199284871/job 134448862692 success (22 tests). Cumulative 44199284597/job 134448860902 failed in Unit and parity regression: tests/trigonometryLmD03.audit.test.ts threw Invalid regular expression /^limit\(/ Unterminated group. Classification: harness/oracle (test regex). Fix committed 17d4890854ce81132a24eeb8f293c54cb5fb7c0d changing toContain('limit('). Awaiting new CI runs on the fix SHA.

Plus status from prior: LM-D-02 evidence retained. S19 REVIEW; S25, SG28/DIST and EV-D-01 BLOCKED; global OPEN. Next action: confirm new cumulative/H1d/Scientific on the fix SHA, then reconcile continuity.json and advance matrix if PASS_SCOPED.

---

# r581 — LM-D-02 verificado en parser y motor

Lite fc078ef17dd0b0f33c889162227fcb588aa3fa8f acumulativo 44182693887/job 134390920241 ejecutó 2673 pruebas aprobadas, incluidas cinco LM-D-02; la nueva prueba conecta la expresión parseada al resultado exacto del motor. H1d 44182693960/job 134390921037 ejecutó 22 y Scientific 44182693935/job 134390921924 ejecutó 456. Logs revisados.

Plus conserva evidencia en abcba4291f0550144185eb5277c94802872d411f, acumulativo 44172880652/backend 134356367273 3192 aprobadas, 1 skipped y 11 xfailed, incluyendo fuente, servicio bilateral y HTTP LM-D-02. Resultado funcional PASS_SCOPED, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, revisar mutación sin duplicar y avanzar a LM-D-03.
