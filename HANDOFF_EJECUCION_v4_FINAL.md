# HANDOFF DE EJECUCIÓN — Runner v4 + API /v1/ops (sesión con credenciales)

**Fecha:** 27 de octubre de 2026. **Certificación global: OPEN.** Esta sesión NO tiene `gh` ni credenciales GitHub; todo lo siguiente está verificado localmente y pendiente de push/PR/runs.

## A. Artefactos listos (en este repo /workspace, commit `14f2759`)

| Archivo | SHA-256 | Contenido |
|---|---|---|
| `work/runner-v4-lite.yml` | `cc028f1be18fa42e6af268ecf24a1375b648f91907276618bfd7bf3f5b82181c` | Runner v4 completo (934 líneas; el conteo parcial de 640 reportado en pasos intermedios era tras la operación docs, antes de anexar la sección code). YAML válido, bash -n OK, todos los heredoc PY compilan |
| `tests/certification/test_runner_v4.py` | `f001e7db406d8be9699a2292d098e8a4ee506a3db90de42150bcc9aae03c3fd1` | 14 regresiones locales — **14/14 PASS** ejecutadas aquí |

Nota honesta: las sesiones previas reportaron un runner-v4 "completado"; esos archivos **no existían** en ningún workspace persistente. Este es el trabajo real regenerado sobre la base verificada de runner-v3 (`work/runner-v3-main-check.yml`, 536 líneas). Verificar contra el remoto antes de asumir cualquier otro estado.

## B. Qué contiene v4 (mapeado a los requisitos del usuario)

1. **`operation=code`** (gate | docs | code): rama `feat/<change_key>` + PR único identificado por título `[cert-runner:<change_key>]`. Reenvío con mismo contenido = no-op; contenido nuevo = force-with-lease a la MISMA rama → el PR existente se actualiza (nunca duplica PRs). Validación por checks `pull_request`; el runner NO despacha gates manuales para validar su propio PR.
   - Allowlist estricta: rechaza SIEMPRE `.github/workflows/**`, `tests/**`, `e2e/**`, `qa/certification/runner/**`, `package.json|package-lock.json|requirements.txt|pyproject.toml`; rutas técnicas (`scripts/ src/ app/ lib/`) solo con `code_allow_technical=true`; documental `.md` + `continuity.json` siempre permitido. Rechaza subjects con `[skip ci]`/`[ci skip]`, commits vacíos, modos no 100644, >50 commits, binarios. HTTPS-only con allowlist de hosts y validación anti-SSRF (igual que docs). Base SHA exacto exigido.
   - **Merge opt-in** (`code_merge_after_green=true`): squash-mergea SOLO si todos los checks del HEAD final son pass/skipped y el headRefOid sigue siendo `FINAL_HEAD`; aborta ante cambio de HEAD o checks fallidos/pendientes.
2. **Anti-duplicación de gates** (`Gate anti-duplication check`): antes de despachar consulta runs del workflow del gate sobre el SHA exacto de la rama canónica → `REUSED` (run verde existe, no se despacha), `WAIT` (run in-progress, se espera), `DISPATCH` (no hay evidencia). El paso Dispatch solo corre si `EVIDENCE_DECISION == 'DISPATCH'`. Esto iguala la eficiencia de un LLM con acceso directo sin lanzar Actions redundantes.
3. **Cero `[skip ci]`** (Hallazgo B): eliminado de ambos mensajes de registro (gate y docs); los triggers quedan gobernados solo por `paths-ignore`. El registro ahora consigna la decisión (`DISPATCH`/`REUSED`/`WAIT`).
4. **Herencia preservada**: contrato docs de v3 intacto (parche HTTPS + SHA-256 + base exacto + CAS + sequía documental), bloqueo PLUS-S19-EQUIVALENCE-REVIEW-R304, dry-run por defecto explícito, rechazo `target_repo=both` en docs/code.

## C. Ejecución en la sesión con credenciales (orden exacto)

### P1 — Lite (rama destino `main`, tras merge PR #55 `0a31376…`)
```bash
git ls-remote https://github.com/c2melendez/precision-lab-lite  # verificar HEAD real de main
gh pr create ... --head feat/runner-v4-code-ops  # desde main actual
# Colocar: .github/workflows/certification-runner.yml <- work/runner-v4-lite.yml (reemplazo v3->v4)
#          tests/certification/test_runner_v4.py     <- ajustar RUNNER_V4/CONTINUITY al layout real del repo
# scripts/certification/continuity.py: NO tocar (P0 fingerprint ya validado 405c377/676f36e)
```
Los checks del PR validan. No despachar gates manualmente mientras el PR esté abierto. Merge solo con checks verdes en el HEAD final (o vía `code_merge_after_green` una vez integrado v4).

### P2 — Plus (port; precondición de orden)
Rama destino: `feat/runner-v4-port-plus` **después** de reconciliar #34/#36 (chocan en `qa/certification/continuity.json`): integrar primero #36 (verificar runs 40381076250/40381076420 verdes en su HEAD final), luego rebase/cierre de #34 hacia v4. Adaptar: gates S19/S21/S28/SG28 en la lista de elección, inputs técnicos Plus (`app/math/**`, sanitizers KaTeX/MathLive) ya cubiertos por continuity.json. Mismo archivo, mismas pruebas (≥14).

### P3 — readonly-api `/v1/ops/*`
Rama `feat/ops-endpoints`: `app/ops.py` con POST idempotentes `{gate,docs,code,pr-status,merge}` + GET `/v1/ops/{operation_id}`, protegidos por `X-Ops-Key`, que **solo** hacen `workflow_dispatch` al runner v4 (la API jamás escribe directo en GitHub). Antes de dispatch, consultar el planificador: si `plan=REUSE` no despachar. Los endpoints de lectura `/v1/*` permanecen GET-only/advisory (invariante). Pendientes operativos de Render confirmados por sesión previa: healthCheck vacío vs `/healthz` declarado, presencia de `GITHUB_READ_TOKEN`/`SERVICE_API_KEY`, smoke E2E post-despliegue, CI PR #2 (falló provisioning `runner_id=0`, no pytest).

### P4 — Smoke controlado (único siguiente paso tras merges)
1. `operation=docs` trivial en Lite (dry_run=true → false): cero runs por paths-ignore, registro visible.
2. `operation=gate cumulative` dry-run: debe reportar `REUSED` si el HEAD canónico ya tiene run verde (p. ej. evidencia 40381076250 en su SHA) — demuestra anti-duplicación sin gastar Actions.
3. `operation=code` con change_key de prueba y parche mínimo técnico: verificar un solo PR, reenvío no-op, checks del PR, y merge condicional.

## D. Invariantes que la sesión con credenciales NO debe romper
- Ningún input contractual fuera del fingerprint; excluir solo `qa/certification/runner/**`.
- Cero `[skip ci]` en commits de registros/publicaciones (v4 lo impone y lo teste).
- API read-only en `/v1/*`; escritura únicamente vía `/v1/ops/*` → runner, con X-Ops-Key.
- No repetir runs verdes; no declarar un SHA validado sin ver el run que lo cubre.
- Certificación global OPEN hasta que la evidencia oficial diga lo contrario.
