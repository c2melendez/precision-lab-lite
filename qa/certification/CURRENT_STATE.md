# r528 — IN-D-06 implementado; verificación CI en curso

Global OPEN; IN-D-05 conserva PASS_SCOPED. Fuente `sin x cos x>0`, x∈[0,2π): (0,π/2) ∪ (π,3π/2), extremos abiertos. Test-first: Lite tres variantes fallaron por raíces no polinómicas; Plus servicio y HTTP devolvieron solo (0,π/2). Se corrigió el reconocimiento exacto en `src/engine/inequality.ts` y `backend/app/services/phase2_service.py`: Lite conserva periodicidad explícita, Plus informa el período contractual. Controles negativos mantienen la ruta anterior; no se acredita la capacidad de esos controles cuando el solver anterior no la ofrece.

Pruebas permanentes: Lite `tests/trigonometryInD06.audit.test.ts` 6 casos; Plus `backend/tests/test_trigonometry_in_d06.py` 6 casos, con fila original, signos, extremos, variantes, HTTP y enrutamiento. Lite validación local completa serial: 442 suites, 2542 passed, 8 expected fail y 34 TODO; build/typecheck PASS. Plus 35 focales IN-D/phase2 PASS, 1 advertencia deprecación Starlette; no se ejecutó suite backend completa local. SKIP/XFAIL/TODO no son PASS.

SHA técnico Lite 922d9264d2fa2b5fbde492d1d5eaaef4a3e304be: CI 43659654685, Cumulative 43659654692, H1d 43659654684, Scientific 43659654642. SHA técnico Plus 8df73ce327b4effe0b325410f0d23c58e57bc146: CI 43659684444, Cumulative 43659684445, H1d 43659684432, Native 43659684476, seguridad 43659684440. Todos se activaron por push; no se hizo dispatch ni se atribuye PASS antes de revisar jobs/pasos/logs. Runner solo es resumen. Huellas calculadas por continuity.py sobre los commits técnicos exactos.

Siguiente acción única: inspeccionar corridas existentes por SHA, jobs y logs; corregir fallos confirmados y cerrar IN-D-06 solo con evidencia funcional bilateral suficiente, luego iniciar IN-D-07. S25, SG28/DIST y EV-D-01 permanecen BLOCKED. Seguridad se revisa por perfil; jobs omitidos no son PASS.

