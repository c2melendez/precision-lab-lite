# Algebra 229 — Sección A (expandir) — evidencia 2026-10-20

**Alcance:** unit/HTTP expand + fila en `matriz_algebra_simbolica.md.gz`. **No** matriz completa ni E2E MathLive AS-A.

| Caso | Lite technical SHA | Lite cumulative | Plus technical SHA | Plus cumulative |
|------|--------------------|-----------------|--------------------|-----------------|
| AS-A-01 | `6493c4b2aefe71ef608309dfb60e45e0a027c178` | [39392408916](https://github.com/c2melendez/precision-lab-lite/actions/runs/39392408916) SUCCESS | `b6cc70fc1e2f65c97e199261b73b968b879a32ca` | [39392421243](https://github.com/c2melendez/precision-lab-plus/actions/runs/39392421243) SUCCESS |
| AS-A-02 | `bfdbd38274063188fc8d7655a8e8deb8fbe1fa0e` | [39392889929](https://github.com/c2melendez/precision-lab-lite/actions/runs/39392889929) SUCCESS | `5551328b4e934076b5af7cd2148a494897c936ef` | [39392902252](https://github.com/c2melendez/precision-lab-plus/actions/runs/39392902252) SUCCESS |
| AS-A-03 | `fe6c8deace10c5a6159797432de5d545c51852b7` | [39395561487](https://github.com/c2melendez/precision-lab-lite/actions/runs/39395561487) SUCCESS | `022b6e498670ba0822e495a0f0ceda18370bbdd0` | [39395572574](https://github.com/c2melendez/precision-lab-plus/actions/runs/39395572574) SUCCESS |
| AS-A-04 | `8fcaa80aac8e1bb88bb9b58a3f0f9ce3150fa82b` | [39396680764](https://github.com/c2melendez/precision-lab-lite/actions/runs/39396680764) SUCCESS | `0f1927e2a985d47490db9b257cf5b598fd456183` | [39396699584](https://github.com/c2melendez/precision-lab-plus/actions/runs/39396699584) SUCCESS |
| AS-A-05 | `f41649e1213dc9a22fb1e79520e8c436b832b96f` | [39397703380](https://github.com/c2melendez/precision-lab-lite/actions/runs/39397703380) SUCCESS | `496ed16ecbe71c35ac16ad5dc49e7c56e744c382` | [39397716265](https://github.com/c2melendez/precision-lab-plus/actions/runs/39397716265) SUCCESS |
| AS-A-06 | `0c4f8830400a99dfbb7fd6ee4d89bd2da4d421a9` | [39405658373](https://github.com/c2melendez/precision-lab-lite/actions/runs/39405658373) SUCCESS | `fe1cb3e7510f1ade1e2c2091dd0043ce7e7808f2` | [39405670267](https://github.com/c2melendez/precision-lab-plus/actions/runs/39405670267) SUCCESS |

Global **OPEN**. **Siguiente:** AS-A-07 expand `(2x-3)^4`.

## Extensión AS-A-06..10 (2026-10-20)

| Caso | Lite technical SHA | Lite cumulative | Plus technical SHA | Plus cumulative |
|------|--------------------|-----------------|--------------------|-----------------|
| AS-A-09 | `0e9614d58424c4f10557bccfa2debe881e805215` | [39409011583](https://github.com/c2melendez/precision-lab-lite/actions/runs/39409011583) SUCCESS | `c52db6cfb461d6e9fa51d404e5e600eb13530928` | [39409024923](https://github.com/c2melendez/precision-lab-plus/actions/runs/39409024923) SUCCESS |
| AS-A-10 | `373702e6df852a32ebccb79639c4271c556933cf` | [39410230278](https://github.com/c2melendez/precision-lab-lite/actions/runs/39410230278) SUCCESS + H1d 39410230284 | `a82daab7ad0d8eeca2b511cb07707ec1a3d5413a` | [39410227638](https://github.com/c2melendez/precision-lab-plus/actions/runs/39410227638) SUCCESS + H1d 39410227610 |
| AS-A-11 | `4fab5b1a37bccf690a587248bf75573f24c7edda` | [39412487217](https://github.com/c2melendez/precision-lab-lite/actions/runs/39412487217) SUCCESS + scientific-ui 39412487075 + H1d 39412487020 | `82059fa1d177ce191f24cedbc3a84003f84cde7f` | [39412482980](https://github.com/c2melendez/precision-lab-plus/actions/runs/39412482980) SUCCESS + H1d 39412482960 + security 39412483056 |
| AS-A-12 | `aacb5c3bfc125b1f4a426c3732758d909e756e46` | [39414422310](https://github.com/c2melendez/precision-lab-lite/actions/runs/39414422310) SUCCESS + scientific-ui 39414422330 + H1d 39414422305 | `663c9f8e52b0d0a527b2b9f6b9bb5b445aa64f4b` | [39414425350](https://github.com/c2melendez/precision-lab-plus/actions/runs/39414425350) SUCCESS + H1d 39414425369 |

AS-A-10: `(x^2+x+1)^3` → `x^6+3x^5+6x^4+7x^3+6x^2+3x+1`. Local Lite vitest 2 passed; Plus pytest 2 passed. CI bilateral verde sobre SHA técnico exacto. Global **OPEN**. Siguiente: **AS-A-11** `(a+b+c)^3`.

AS-A-12: `(x^2-1)^2` → `x^4-2x^2+1`. Local Lite vitest 2 passed; Plus pytest 2 passed. CI bilateral verde sobre SHA técnico exacto. Global **OPEN**. Siguiente: **AS-A-13** `(x+h)^3-x^3`.
