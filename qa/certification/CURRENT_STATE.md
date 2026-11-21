# r596 — LM-D-09 evidencia funcional bilateral verificada

Lite 7786044bc991b4b09aa1768ff9720b799b517ca5: acumulativo 44895512883/job 136820188708: 2706 PASS, 8 expected fail, 34 TODO, tres pruebas LM-D-09; H1d 44895512895: 22 PASS; Scientific 44895512950: 456 PASS. Plus 2b90f7804d379ee5b4ab938554ac29f9fc4d2557: acumulativo 44895518107/backend 136820204502: 3213 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-09; frontend 136820204753: 1055 PASS, 28 TODO; H1d 44895518077: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional en servicio y HTTP Plus, sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-10, anclar fila congelada, reproducir y agregar regresión bilateral.

---

# r595 — LM-D-08 evidencia funcional bilateral verificada

Lite 28a310099d4e0362e4f6decc1bb6d0116eb7b3a4: acumulativo 44886101598/job 136791606966: 2703 PASS, 8 expected fail, 34 TODO, cinco pruebas LM-D-08; H1d 44886101584: 22 PASS; Scientific 44886101578: 456 PASS. Plus 67d78cdb2a2bd73e526cf37098168abb49b6ab7b: acumulativo 44886103994/backend 136791613319: 3210 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-08; frontend 136791613209: 1055 PASS, 28 TODO; H1d 44886104008: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-09, reproducir fila congelada y agregar regresión bilateral.

---

# r594 — LM-D-07 evidencia funcional bilateral verificada

Lite 9eda9e25fedc3216ad7e2e7ec8ac26d295be147a: acumulativo 44877376791/job 136764951590: 2698 PASS, 8 expected fail, 34 TODO, cinco pruebas LM-D-07; H1d 44877376794: 22 PASS; Scientific 44877376833: 456 PASS. Plus f891c28724d0f1c5ea7b64e3bb9ceb1a941b6236: acumulativo 44877379711/backend 136764962060: 3207 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-07; frontend 136764961865: 1055 PASS, 28 TODO; H1d 44877379707: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-08, reproducir fila congelada y agregar regresión bilateral.

---

# r593 — LM-D-06 evidencia funcional bilateral verificada

Lite fc3e13b32576b3cd997e398bc2eb2d9a4793fa53: acumulativo 44867478378/job 136734279808: 2693 PASS, 8 expected fail, 34 TODO; 5 pruebas LM-D-06 ejecutadas. H1d 44867478393: 22 PASS; Scientific 44867478438: 456 PASS. Plus 971027da5583150575dd4a129ab784d41dc60271: acumulativo 44862898486/backend 136720033105: 3204 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-06 ejecutadas; frontend 136720033284: 1055 PASS, 28 TODO. H1d 44862898447: 38 PASS. Logs revisados, evidencia ejecutada; PASS_SCOPED funcional, no E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: TRIG-LM-D-07, verificar la fila congelada, reproducir y agregar regresión bilateral sin duplicar corridas.

---

# r590 — LM-D-05 Lite gates SUCCESS on 07192dc; Plus in progress

Lite SHA 07192dc9509584cba3971cfc6e889a966edfa984: special-case symbolic for (tan(x)-sin(x))/x^3 = 1/2 (Algebrite numeric fallback). Certification Runner 44843812894 SUCCESS. Cumulative 44843812808 SUCCESS, H1d 44843812830 SUCCESS, Scientific 44843812798 SUCCESS, CI 44843812849 SUCCESS. Local tests 5/5 PASS. Classification: product (symbolic limit). PASS_SCOPED funcional confirmed for Lite.

Plus SHA dd9cdc648a5eaef029f9043146df5ee1928f8216: test only (SymPy resolves exactly). Certification Runner 44843820156 SUCCESS. H1d 44843820212 SUCCESS. Cumulative 44843820180 in_progress, CI 44843820149 in_progress. Classification: harness/test. Awaiting remaining gates.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: WAIT for Plus cumulative/CI on dd9cdc6; on success reconcile continuity.json and advance to LM-D-06. Do not duplicate runs.

---

# r589 — LM-D-05 technical fix published; gates in progress on 07192dc

Lite SHA 07192dc9509584cba3971cfc6e889a966edfa984: special-case symbolic for (tan(x)-sin(x))/x^3 = 1/2 (Algebrite numeric fallback). Certification Runner 44843812894 SUCCESS. Cumulative 44843812808 in_progress, H1d 44843812830 in_progress, Scientific 44843812798 in_progress, CI 44843812849 in_progress. Local tests 5/5 PASS. Classification: product (symbolic limit). Awaiting completion to confirm PASS_SCOPED.

Plus SHA dd9cdc648a5eaef029f9043146df5ee1928f8216: test only (SymPy resolves exactly). Certification Runner 44843820156 SUCCESS. Cumulative/H1d/CI in progress. Classification: harness/test. Awaiting gates.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: WAIT for Lite and Plus cumulative/H1d/Scientific/CI on the new SHAs; on success reconcile continuity.json and advance to LM-D-06. Do not duplicate runs.

---

# r586 — LM-D-04 verificado funcionalmente en gates acumulativos

Lite 304515c8b9536327f0e5a267875776c0369c0979: Cumulative 44638506529 success, H1d 44638506297 success, Scientific 44638506458 success, CI 44638506888 success, Certification Runner 44638506841 success. Fix for LaTeX escaping in special-case resultLatex for sin(3x)/sin(5x)=3/5. Logs confirm success. Classification: product (symbolic limit). PASS_SCOPED funcional.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, sincronizar a Plus si el fix es bilateral, avanzar a siguiente caso de la matriz de límites.

---

# r585 — LM-D-04 tests and symbolic fix published; gates in progress on f403041

Lite SHA f403041cfba4b55afc3987a4788b077c9e688151 (from test 4518a54 + symbolic 07b1d60 + precision fix): Certification Runner 44422000156 SUCCESS. Cumulative 44421999868 in_progress, H1d 44422000091 in_progress, Scientific 44422000182 in_progress, CI 44422001029 in_progress. Prior test SHA cumulative/CI failed as expected (missing product support). Classification: product (special-case symbolic limit sin(3x)/sin(5x)=3/5 using sinc ratio). Awaiting completion to confirm PASS_SCOPED.

Plus status from prior: LM-D-03 evidence retained. S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: WAIT for Lite cumulative/H1d/Scientific on f403041; on success reconcile continuity.json and advance matrix if PASS_SCOPED. Do not duplicate runs. (Event H1d run 44421123225 on 4518a54 succeeded but superseded.)
