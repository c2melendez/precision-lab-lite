# BLOCKER — Restaurar `src/engine/algebriteClient.ts`

**Estado:** el archivo quedó sobrescrito por un marcador de emergencia (commits `b5e40f1` / `6e5bdd3`). CI Lite en rojo hasta restaurar.

## Recuperación (con credenciales de push)

```bash
git fetch origin
git checkout qa/syntax-audit-in625-a1
# Contenido bueno (pre-corrupción + regla AS-C-18):
git show d867368cba39ac2ac79421133e6ab5e0dfbb84ee:src/engine/algebriteClient.ts > /tmp/good.ts
# Aplicar regla AS-C-18 (scoped lcm) si no está: ver artifacts/algebriteClient_RESTORE.ts
cp /tmp/good.ts src/engine/algebriteClient.ts
# O usar la copia local del ejecutor:
#   artifacts/algebriteClient_RESTORE.ts  (SHA256 6193c6d9…, 43642 chars, incluye AS-C-18)
git add src/engine/algebriteClient.ts
git commit -m "fix(engine): restore algebriteClient.ts + AS-C-18 scoped polynomial lcm"
git push origin qa/syntax-audit-in625-a1
```

## Hash de la copia válida (ejecutor)

- Ruta: `artifacts/algebriteClient_RESTORE.ts`
- SHA256: `6193c6d93055fc460410eec70b1081ff605e1dcf1967d8a5f5216239583ca3cb`
- Incluye regla acotada AS-C-18: `lcm(x^2-1,x^2-2*x+1) → (x-1)^2*(x+1)`

## Impacto

- AS-C-18 Lite: tests publicados; producto necesita regla AS-C-18 + motor restaurado
- AS-C-19: test-first publicado bilateral; Lite no puede verificar hasta el restore
- Plus AS-C-18: PASS en gates; AS-C-19 test-first en curso
