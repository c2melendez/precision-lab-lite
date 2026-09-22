import { expect, test } from "@playwright/test";

test("M31: PWA expone manifiesto válido, registra service worker y recarga offline", async ({ page, context }) => {
  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(manifestHref).toBeTruthy();

  const manifest = await page.evaluate(async (href) => {
    const url = new URL(href!, window.location.href);
    const response = await fetch(url);
    return {
      ok: response.ok,
      url: url.pathname,
      body: await response.json(),
    };
  }, manifestHref);

  expect(manifest.ok).toBe(true);
  expect(manifest.url).toContain("/precision-lab-lite/");
  expect(manifest.body.name).toBe("Precision Lab Lite");
  expect(manifest.body.short_name).toBe("Precision Lab");
  expect(manifest.body.display).toBe("standalone");
  expect(manifest.body.start_url).toBe("/precision-lab-lite/");
  expect(manifest.body.scope).toBe("/precision-lab-lite/");
  expect(manifest.body.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ src: "icons/icon-192.png", sizes: "192x192", type: "image/png" }),
      expect.objectContaining({ src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }),
      expect.objectContaining({ src: "icons/icon-512-maskable.png", purpose: "maskable" }),
    ]),
  );

  const swSupported = await page.evaluate(() => "serviceWorker" in navigator);
  expect(swSupported).toBe(true);

  await page.evaluate(async () => {
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error("service worker ready timeout")), 12000)),
    ]);
  });

  // La primera visita instala/activa el worker. Una recarga online hace
  // que la página quede bajo control antes de simular pérdida de red.
  await page.reload();
  await expect(page.locator("math-field").first()).toBeVisible();

  const controlled = await page.evaluate(() => Boolean(navigator.serviceWorker.controller));
  expect(controlled).toBe(true);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.locator("math-field").first()).toBeVisible({ timeout: 12000 });
  await expect(page.getByRole("button", { name: "Matrices", exact: true })).toBeVisible();

  const offlineState = await page.evaluate(() => ({
    online: navigator.onLine,
    controlled: Boolean(navigator.serviceWorker.controller),
  }));
  expect(offlineState.online).toBe(false);
  expect(offlineState.controlled).toBe(true);

  await context.setOffline(false);
});
