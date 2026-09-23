# Validación local y CI — Precision Lab Lite

## Validación principal

```bash
npm ci
npm audit --package-lock-only
npm run typecheck
npm test
npm run build
```

## E2E con Playwright

Playwright se mantiene fuera del `package-lock.json` para no alterar la aplicación solo por la infraestructura E2E.

```bash
npm install --no-save --package-lock=false @playwright/test@1.63.0 @axe-core/playwright@4.13.0
npx playwright install chromium
npx playwright test
```

El `playwright.config.ts` levanta el artefacto de producción con Vite Preview y prueba tres perfiles: Desktop 1440, tablet y móvil. En CI se conservan trazas, capturas y vídeo solamente cuando una prueba falla.

## Quality gate recomendado

No publicar si falla cualquiera de estos pasos: audit de dependencias, typecheck, Vitest/paridad del teclado, build de producción o Playwright E2E. En CI, `npm audit --package-lock-only` es un gate duro: una vulnerabilidad reportada por npm debe dejar el workflow en rojo hasta ser evaluada y corregida sin usar `npm audit fix --force`.
