# Continuidad — exclusión de registros de ejecución (Hallazgo A)

**Fecha:** 2026-10-27 · **Alcance:** `scripts/certification/continuity.py` (paridad Lite/Plus)

## Problema

El planificador trataba los archivos generados por el Certification Runner v3 en
`qa/certification/runner/<run_id>.json` como entradas técnicas. Publicar el registro
de una corrida alteraba la huella (`input_fingerprint`) y el guard `__snapshot_guard__`
devolvía `RECONCILE`, que a su vez motivaba una nueva corrida cuyo registro volvía a
ensuciar la huella: ciclo ejecutar → registrar → RECONCILE sin fin.

## Corrección

`selected()` excluye únicamente el prefijo exacto anclado en raíz `qa/certification/runner/`.
No se excluye `qa/certification/` en bloque: contratos, fixtures, tests, workflows y
manifiestos de dependencias siguen contando como entradas (verificado por
`RunnerRecordExclusionTests` en `scripts/certification/test_continuity.py`).

## Efecto sobre huellas registradas

La regla cambia la huella de cualquier commit que contenga registros; toda evidencia
anterior interpretada con la regla antigua queda invalidada por diseño (falla hacia
RUN, nunca inventa PASS). El siguiente despacho del runner debe recalcular baseline y
`technical_baseline_sha` contra HEAD tras aplicar este paquete.

## Hallazgo B — `[skip ci]` y SY-P-23

Los commits de cierre `88a25932…` (Lite) y `bef07d86…` (Plus) modificaron
`qa/certification/SY_P_23_CONVENTION.md` —ruta explícitamente activadora de los gates
cumulative y H1d— con `[skip ci]`, que suprime push/pull_request aunque las rutas
coincidan. Los runs verdes citados (40272665879, 40272886275, 40273073450, 40273499483)
no validan la versión final del documento. No hay defecto de código que corregir:
el mecanismo de revalidación existente es `workflow_dispatch` con `reason` obligatorio
(vía Certification Runner gate, modo no-dry-run), que además registra el resultado en
`qa/certification/runner/` sin retroalimentar la huella gracias a esta corrección.
Acción documental pendiente de credenciales: revalidar cumulative+H1d en Lite y Plus
sobre el HEAD canónico vigente y actualizar CURRENT_STATE.md/EXECUTION_LOG.md con los
nuevos run IDs antes de dar por cerrado SY-P-23 sobre la anotación final.
