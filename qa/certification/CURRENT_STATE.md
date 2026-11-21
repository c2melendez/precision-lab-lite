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
