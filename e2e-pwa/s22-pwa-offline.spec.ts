import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

async function waitForServiceWorkerControl(page: Page) {
  await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) throw new Error("Service Worker no soportado");
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("service worker ready timeout")), 15_000),
      ),
    ]);
  });

  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) {
    await page.reload();
  }
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
}

async function setExpression(page: Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.focus();
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

async function calculateTwoPlusTwo(page: Page) {
  await setExpression(page, "2+2");
  const calculate = page.getByRole("button", { name: "Calcular", exact: true }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();

  const result = page.getByRole("region", { name: "Resultado", exact: true });
  await expect(result).toContainText("4", { timeout: 15_000 });
}

async function manifestSnapshot(page: Page) {
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toBeTruthy();
  return page.evaluate(async (manifestHref) => {
    const url = new URL(manifestHref!, window.location.href);
    const response = await fetch(url);
    return { ok: response.ok, pathname: url.pathname, body: await response.json() };
  }, href);
}

test("S22: manifest, service worker y operación local sobreviven recarga offline", async ({ page, context }) => {
  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  const manifest = await manifestSnapshot(page);
  expect(manifest.ok).toBe(true);
  expect(manifest.pathname).toContain("/precision-lab-lite/");
  expect(manifest.body).toMatchObject({
    name: "Precision Lab Lite",
    short_name: "Precision Lab",
    display: "standalone",
    start_url: "/precision-lab-lite/",
    scope: "/precision-lab-lite/",
  });
  expect(manifest.body.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ src: "icons/icon-192.png", sizes: "192x192", type: "image/png" }),
      expect.objectContaining({ src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }),
      expect.objectContaining({ src: "icons/icon-512-maskable.png", purpose: "maskable" }),
    ]),
  );

  await waitForServiceWorkerControl(page);
  await calculateTwoPlusTwo(page);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.locator("math-field").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Matrices", exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.onLine)).toBe(false);
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await calculateTwoPlusTwo(page);
  await context.setOffline(false);
});

test("S22: actualización de build reemplaza cache y la nueva versión sigue disponible offline", async ({ page, context }) => {
  // Restablecer v1 hace que el test y sus retries sean independientes.
  writeFileSync(
    "public/s22-version.svg",
    '<svg xmlns="http://www.w3.org/2000/svg"><text>s22-v1</text></svg>',
  );
  execFileSync("npm", ["run", "build"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });

  await page.goto("./");
  await waitForServiceWorkerControl(page);

  const readVersion = () =>
    page.evaluate(async () => {
      const response = await fetch(new URL("s22-version.svg", window.location.href));
      const body = await response.text();
      if (body.includes("s22-v2")) return "s22-v2";
      if (body.includes("s22-v1")) return "s22-v1";
      return "unknown";
    });

  await expect.poll(readVersion).toBe("s22-v1");

  writeFileSync(
    "public/s22-version.svg",
    '<svg xmlns="http://www.w3.org/2000/svg"><text>s22-v2</text></svg>',
  );
  execFileSync("npm", ["run", "build"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });

  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("No existe service worker registrado");

    await registration.update();

    const candidate = registration.installing ?? registration.waiting;
    if (candidate && candidate.state !== "activated") {
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(
          () => reject(new Error("service worker update activation timeout")),
          20_000,
        );
        candidate.addEventListener("statechange", () => {
          if (candidate.state === "activated") {
            window.clearTimeout(timer);
            resolve();
          }
        });
      });
    }
  });

  await page.reload({ waitUntil: "networkidle" });
  await waitForServiceWorkerControl(page);
  await expect.poll(readVersion, { timeout: 20_000 }).toBe("s22-v2");

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("math-field").first()).toBeVisible();

  const cachedVersion = await page.evaluate(async () => {
    const response = await fetch(new URL("s22-version.svg", window.location.href));
    const body = await response.text();
    return body.includes("s22-v2") ? "s22-v2" : "unknown";
  });
  expect(cachedVersion).toBe("s22-v2");

  await calculateTwoPlusTwo(page);
  await context.setOffline(false);
});
