# r520 — IN-D-05 corregido y publicado; CI pendiente

Global **OPEN**. IN-D-04 conserva PASS_SCOPED bilateral. IN-D-05 permanece **VERIFYING_CI**, sin cierre ni avance a IN-D-06.

## Contrato, brecha reproducida y corrección
Fuente original: qa/certification/legacy_sources/ejercicios_trigonometria.md.gz, blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 3.A. Fila IN-D-05: |sin x|>=sqrt(2)/2, x∈[0,2π); solución [π/4,3π/4] ∪ [5π/4,7π/4]. Los cuatro extremos son cerrados. Las tres celdas originales quedan ancladas en ambas regresiones.

Test-first: Lite falló en tres variantes por el solver de raíces no polinómicas (3 fail/3 pass); Plus falló en servicio y HTTP por NotImplementedError de SymPy con Abs periódico (2 fail/2 pass). No se relajó el oráculo. El parser Lite ya interpretaba correctamente el núcleo LaTeX.

Lite src/engine/inequality.ts reconoce la comparación exacta y su inversión; usa |sin x|>=sqrt(2)/2 ⇔ sin²x>=1/2 y devuelve ambas componentes repetidas cada 2π, k entero. Plus backend/app/services/phase2_service.py usa reconocimiento acotado (≤12 operaciones y funciones/potencias exactas), devuelve ambos intervalos cerrados y aviso visible de alcance [0,2*pi). Conserva la ruta anterior para otros umbrales, funciones y comparadores; también las comparaciones constantes.

Regresiones permanentes: Lite tests/trigonometryInD05.audit.test.ts (6 casos) y Plus backend/tests/test_trigonometry_in_d05.py (6 casos). Cubren fila fuente, variantes, extremos, signos, periodicidad según motor y HTTP real Plus. El sentinel de controles negativos Plus verifica únicamente enrutamiento hacia el solver anterior; no acredita capacidad matemática de esos otros casos. Oráculos positivos y HTTP ejecutan código real sin mocks.

## Validación local
Lite: 107 focales/parser/inecuaciones PASS; acumulativo completo serial 441 suites, 2536 passed, 8 expected fail, 34 TODO; build/typecheck PASS. Plus: 40 focales IN-D/phase2/SY-Q PASS, una advertencia de deprecación Starlette; no se afirma acumulativo backend local. SKIP, XFAIL y TODO no son PASS.

## Publicación y observación remota
Cambios técnicos publicados con expected_sha y force=false en qa/syntax-audit-in625-a1, después de refrescar HEAD y runs.

| Producto | SHA técnico | CI | Cumulative | H1d | UI | Seguridad |
|---|---|---|---|---|---|---|
| Lite | e09f87202495b24c672d848a9434d71534a0c10a | 43637613602 | 43637613663 | 43637613567 | Scientific 43637613653 | revisión independiente |
| Plus | e410077f62914a7c16844aff7d7c0deaf2a315b1 | 43637618227 | 43637618246 | 43637618190 | Native 43637618217 | 43637618276 |

Corte 2026-11-14T20:29:34.886Z: gates funcionales y campaña de seguridad observados IN_PROGRESS; no atribuirles resultado antes de revisar todos los jobs/pasos/logs. Runner Lite 43637613657 y Plus 43637618267 SUCCESS son resúmenes, no prueba funcional. Cumulative Lite/job 132577786042; Plus/backend 132577800977 y frontend 132577801567. H1d Lite 132577785735 y Plus 132577801068. Scientific 132577786225; Native 132577801046. CI Lite 132577785949; Plus backend 132577801082 y frontend 132577801384. No hubo dispatch manual ni corridas duplicadas.

Planificador reproducido sobre árboles Git auténticos del SHA técnico: CURRENT, gates funcionales WAIT. Seguridad Lite se conserva REVIEW: la ventana reciente incompleta no autoriza una nueva corrida. Seguridad Plus WAIT en 43637618276; backend-security/job 132577896661 y mutación/backend 132577946517 en curso; frontend audit y mutaciones frontend omitidos no son PASS. La modificación real del backend produjo la nueva selección automática de seguridad; no es un reintento idéntico.

Corrección del estado histórico: campaña IN-D-04 43623011306/job 132532759316 terminó por shutdown a las 20:11:00Z del 2026-11-14, 5770/5834 mutantes, sin informe final subido. No sigue en curso ni acredita score. No relanzar esa campaña sin cambio/justificación. El informe anterior 43559502112/artefacto 14105803916 conserva revisión de aceptación independiente.

## Alcance, bloqueos y siguiente acción
Parser/motor Lite y servicio/HTTP normalizado Plus; no ingesta literal completa del sufijo de dominio ni E2E dedicado de fila. S25 BLOCKED; EV-D-01 BLOCKED; H2/SG28 OPEN y DIST-01..08 BLOCKED. SG28_EVALUATE_ISOLATION permanece off por defecto. Sin cambios de producción ni releases.

Única acción siguiente: inspeccionar estas corridas existentes y sus huellas; corregir fallos confirmados y cerrar IN-D-05 PASS_SCOPED solo con evidencia funcional bilateral completa. Después iniciar IN-D-06. Seguridad se evalúa por separado; no repetir verdes ni campañas idénticas.
