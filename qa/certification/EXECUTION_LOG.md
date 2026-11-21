# r586 — LM-D-04 verificado funcionalmente en gates acumulativos

Lite 304515c8b9536327f0e5a267875776c0369c0979: Cumulative 44638506529 success, H1d 44638506297 success, Scientific 44638506458 success, CI 44638506888 success, Certification Runner 44638506841 success. Fix for LaTeX escaping in special-case resultLatex for sin(3x)/sin(5x)=3/5. Logs confirm success. Classification: product (symbolic limit). PASS_SCOPED funcional.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, sincronizar a Plus si el fix es bilateral, avanzar a siguiente caso de la matriz de límites.

---

# r584 — LM-D-03 verificado funcionalmente

Lite 567c2459dab6e3b568063d84547e33a51474b657 acumulativo 44202237843/job 134459002131 ejecutó 2678 pruebas aprobadas, incluidas cinco LM-D-03; H1d 44202237915/job 134459001668 ejecutó 22 y Scientific 44202240173/job 134459007569 ejecutó 456. Plus 2fb197e317f3a84cf405ec7027e60f1a11b623b6 acumulativo 44202243228/backend 134459017665 ejecutó 3195 aprobadas, 1 skipped y 11 xfailed; fuente, servicio bilateral y HTTP LM-D-03 pasaron; frontend 134459017183 aprobó 1055. H1d 44202243381/job 134459017335 aprobó 38. Logs revisados; PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, revisar mutación sin duplicar y avanzar a LM-D-04.

---

# r583 — LM-D-03 fix applied; gates in progress on 17d48908

Lite fix SHA 17d4890854ce81132a24eeb8f293c54cb5fb7c0d: Certification Runner 44200198238 SUCCESS. CI 44200198222 failure on npm audit (independent S25, not blocking). Cumulative 44200198258, H1d 44200198209, Scientific 44200198232 all in_progress. Prior classification harness/oracle. Next: WAIT and confirm on completion before advancing.

Plus prior LM-D-02 retained. S19 REVIEW; S25, SG28/DIST and EV-D-01 BLOCKED; global OPEN.

---

# r582 — LM-D-03 cumulative failed on regex; H1d success; fix applied

Lite 58a4e56029c881629c8be2dd42ae42253a9bf912: H1d 44199284871/job 134448862692 success (22 tests). Cumulative 44199284597/job 134448860902 failed in Unit and parity regression: tests/trigonometryLmD03.audit.test.ts threw Invalid regular expression /^limit\(/ Unterminated group. Classification: harness/oracle (test regex). Fix committed 17d4890854ce81132a24eeb8f293c54cb5fb7c0d changing toContain('limit('). Awaiting new CI runs on the fix SHA.

Plus status from prior: LM-D-02 evidence retained. S19 REVIEW; S25, SG28/DIST and EV-D-01 BLOCKED; global OPEN. Next action: confirm new cumulative/H1d/Scientific on the fix SHA, then reconcile continuity.json and advance matrix if PASS_SCOPED.

---

# r581 — LM-D-02 verificado en parser y motor

Lite fc078ef17dd0b0f33c889162227fcb588aa3fa8f acumulativo 44182693887/job 134390920241 ejecutó 2673 pruebas aprobadas, incluidas cinco LM-D-02; la nueva prueba conecta la expresión parseada al resultado exacto del motor. H1d 44182693960/job 134390921037 ejecutó 22 y Scientific 44182693935/job 134390921924 ejecutó 456. Logs revisados.

Plus conserva evidencia en abcba4291f0550144185eb5277c94802872d411f, acumulativo 44172880652/backend 134356367273 3192 aprobadas, 1 skipped y 11 xfailed, incluyendo fuente, servicio bilateral y HTTP LM-D-02. Resultado funcional PASS_SCOPED, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, revisar mutación sin duplicar y avanzar a LM-D-03.

# r594 — LM-D-07 evidencia funcional bilateral verificada

Lite 9eda9e25fedc3216ad7e2e7ec8ac26d295be147a: acumulativo 44877376791/job 136764951590: 2698 PASS, 8 expected fail, 34 TODO, cinco pruebas LM-D-07; H1d 44877376794: 22 PASS; Scientific 44877376833: 456 PASS. Plus f891c28724d0f1c5ea7b64e3bb9ceb1a941b6236: acumulativo 44877379711/backend 136764962060: 3207 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-07; frontend 136764961865: 1055 PASS, 28 TODO; H1d 44877379707: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-08, reproducir fila congelada y agregar regresión bilateral.

---


# r595 — LM-D-08 evidencia funcional bilateral verificada

Lite 28a310099d4e0362e4f6decc1bb6d0116eb7b3a4: acumulativo 44886101598/job 136791606966: 2703 PASS, 8 expected fail, 34 TODO, cinco pruebas LM-D-08; H1d 44886101584: 22 PASS; Scientific 44886101578: 456 PASS. Plus 67d78cdb2a2bd73e526cf37098168abb49b6ab7b: acumulativo 44886103994/backend 136791613319: 3210 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-08; frontend 136791613209: 1055 PASS, 28 TODO; H1d 44886104008: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-09, reproducir fila congelada y agregar regresión bilateral.

---


# r596 — LM-D-09 evidencia funcional bilateral verificada

Lite 7786044bc991b4b09aa1768ff9720b799b517ca5: acumulativo 44895512883/job 136820188708: 2706 PASS, 8 expected fail, 34 TODO, tres pruebas LM-D-09; H1d 44895512895: 22 PASS; Scientific 44895512950: 456 PASS. Plus 2b90f7804d379ee5b4ab938554ac29f9fc4d2557: acumulativo 44895518107/backend 136820204502: 3213 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-09; frontend 136820204753: 1055 PASS, 28 TODO; H1d 44895518077: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional en servicio y HTTP Plus, sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-10, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r597 — LM-D-10 evidencia funcional bilateral verificada

Lite 203ad96c06f0c4d8a9b470b65e0b4c22da5f0d40: acumulativo 44905544709/job 136850206737: 2710 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-D-10; H1d 44905544663: 22 PASS; Scientific 44905544661: 456 PASS. Plus 60df05ce753a8240c3dcf5fafbd3ceaf6c57cb1f: acumulativo 44905548435/backend 136850218348: 3216 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-10; frontend 136850218582: 1055 PASS, 28 TODO; H1d 44905548422: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; análisis literal Lite y HTTP Plus cubiertos separadamente, sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-11, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r598 — LM-D-11 evidencia funcional bilateral verificada

Lite fcd4d6b1c871b10c7176064b2a41a2a823bb6512: acumulativo 44915926473/job 136881406162: 2714 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-D-11; H1d 44915926547: 22 PASS; Scientific 44915926527: 456 PASS. Plus 9b560a82a1e7337c47afef6702b8da9beba8eeee: acumulativo 44915931400/backend 136881419643: 3219 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-11; frontend 136881419291: 1055 PASS, 28 TODO; H1d 44915931380: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-12, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r599 — LM-D-12 evidencia funcional bilateral verificada

Lite efeb824f4c5b10b0b98f383043fefcec947d69d7: acumulativo 44926001095/job 136912108473: 2718 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-D-12; H1d 44926001120: 22 PASS; Scientific 44926001051: 456 PASS. Plus 606de33e6a50407f7f462fa794d72af74a77dec3: acumulativo 44926004559/backend 136912118112: 3222 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-12; frontend 136912117937: 1055 PASS, 28 TODO; H1d 44926004655: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-13, anclar fila congelada, verificar inexistencia bilateral y agregar regresión.

---

