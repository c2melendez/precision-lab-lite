import { expect, test } from "@playwright/test";

test("M28: historial IndexedDB sobrevive reload y puede borrarse desde la UI", async ({ page }) => {
  await page.goto("./");

  await page.evaluate(async () => {
    const request = indexedDB.open("calculadora-historial", 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("history", { keyPath: "id" });
        store.createIndex("by-timestamp", "timestamp");
      };
    });

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("history", "readwrite");
      tx.objectStore("history").put({
        id: "m28-persisted-entry",
        mode: "Científica",
        input: "persistencia-m28",
        resultSummary: "OK-M28",
        timestamp: 1_790_000_000_000,
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

    db.close();
  });

  await page.reload();

  const trigger = page.getByRole("button", { name: "Historial", exact: true });
  await trigger.click();

  const panel = page.locator("#history-panel");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("persistencia-m28");
  await expect(panel).toContainText("OK-M28");

  await panel.getByRole("button", { name: "Borrar todo" }).click();

  await expect(panel).toContainText("Todavía no hay cálculos guardados.");

  const remaining = await page.evaluate(async () => {
    const request = indexedDB.open("calculadora-historial", 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const count = await new Promise<number>((resolve, reject) => {
      const tx = db.transaction("history", "readonly");
      const countRequest = tx.objectStore("history").count();
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });

    db.close();
    return count;
  });

  expect(remaining).toBe(0);
});


test("M28: historial distingue módulos de origen en una misma ventana", async ({ page }) => {
  await page.goto("./");

  await page.evaluate(async () => {
    const request = indexedDB.open("calculadora-historial", 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("history", { keyPath: "id" });
        store.createIndex("by-timestamp", "timestamp");
      };
    });

    const rows = [
      { id: "science-1", module: "Científica", mode: "Álgebra", input: "x+1=2", resultSummary: "x=1", timestamp: 1790000000004 },
      { id: "matrix-1", module: "Matrices", mode: "Matrices (determinante)", input: "[[1,2],[3,4]]", resultSummary: "-2", timestamp: 1790000000003 },
      { id: "stats-1", module: "Estadística", mode: "Estadística (Descriptiva)", input: "1,2,3", resultSummary: "2", timestamp: 1790000000002 },
      { id: "graph-1", module: "Gráficas", mode: "Graficación", input: "x^2", resultSummary: "y=x^2", timestamp: 1790000000001 },
    ];

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("history", "readwrite");
      for (const row of rows) tx.objectStore("history").put(row);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

    db.close();
  });

  await page.getByRole("button", { name: "Historial", exact: true }).click();
  const panel = page.locator("#history-panel");
  await expect(panel).toBeVisible();

  for (const module of ["Científica", "Matrices", "Estadística", "Gráficas"]) {
    await expect(panel.getByText(module, { exact: true })).toBeVisible();
  }
  await expect(panel.getByText("Álgebra", { exact: true })).toBeVisible();
  await expect(panel.getByText("Matrices (determinante)", { exact: true })).toBeVisible();
});
