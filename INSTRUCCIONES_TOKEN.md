# Cómo facilitar el token GitHub a esta sesión

## Opción recomendada: archivo .env (ya está en .gitignore)

1. Crea/edita el archivo `/workspace/.env` con UNA de estas líneas:

   ```
   GH_TOKEN=github_pat_XXXXXXXX...
   ```

2. Guarda el archivo. No escribas el token en el chat.

## Qué token usar

- **Fine-grained PAT** (recomendado): https://github.com/settings/personal-access-tokens/new
  - Resource owner: `c2melendez`
  - Repositories: `precision-lab-lite` + `precision-lab-plus` (Only select repositories)
  - Permissions: **Contents: Read and write** (necesario para push), **Pull requests: Read and write** (para PR #48/#31). Actions: Read and write solo si quieres que despache workflow_dispatch.
  - Expiración corta (ej. 7 días).

- Alternativa: classic PAT con scope `repo` (más permiso del necesario, menos recomendado).

## Cómo lo consumirá la sesión

La sesión ejecutará algo equivalente a:

```bash
set -a; source /workspace/.env; set +a
git -C /workspace/lite push "https://x-access-token:${GH_TOKEN}@github.com/c2melendez/precision-lab-lite.git" HEAD:qa/syntax-audit-in625-a1
curl -sf -H "Authorization: Bearer $GH_TOKEN" https://api.github.com/repos/c2melendez/precision-lab-lite/actions/runs/40243246431
```

El token NO se escribirá en ningún commit ni archivo versionado (`.env` está excluido por `.gitignore`).

## Higiene después de la sesión

1. Revoca el token en GitHub tras completar el trabajo (Settings → Developer settings → Tokens → Revoke).
2. Si el token apareciera accidentalmente en algún log público, revócalo de inmediato y rota.

## Nota sobre el entorno actual

Este workspace es un repositorio local (`/workspace`) sin remotos configurados; los clones de lite/plus se prepararán al autenticar. La rama canónica de certificación en ambos repos es `qa/syntax-audit-in625-a1` — no hace falta cambiar de rama.
