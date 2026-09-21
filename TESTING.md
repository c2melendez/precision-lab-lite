# Validación local y CI — Precision Lab Lite

## Validación principal

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## E2E con Playwright

Playwright se mantiene fuera del `package-lock.json` para no alterar la aplicación solo por la infraestructura E2E.

```bash
npm install --no-save --package-lock=false @playwright/test@1.55.0
npx playwright install chromium
npx playwright test
```

El `playwright.config.ts` levanta Vite automáticamente y prueba tres perfiles: Desktop 1440, tablet y móvil. En CI se conservan trazas, capturas y vídeo solamente cuando una prueba falla.

## Quality gate recomendado

No publicar si falla cualquiera de estos pasos: typecheck, Vitest/paridad del teclado, build de producción o Playwright E2E.
