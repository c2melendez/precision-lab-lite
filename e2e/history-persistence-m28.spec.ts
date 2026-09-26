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
  await expect(panel.getByText("Operación de matrices · determinante", { exact: true })).toBeVisible();
});


test("M28: Reusar vuelve al módulo de origen y muestra matriz, fecha y hora", async ({ page }) => {
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
        id: "reuse-matrix",
        module: "Matrices",
        mode: "Matrices (A × B)",
        input: JSON.stringify({ A: [[1, 2], [3, 4]], B: [[5, 6], [7, 8]] }),
        resultSummary: "\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}",
        timestamp: new Date(2026, 8, 25, 20, 16, 21).getTime(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

    db.close();
  });

  await page.reload();
  await page.getByRole("button", { name: "Historial", exact: true }).click();
  const panel = page.locator("#history-panel");
  await expect(panel).toBeVisible();
  await expect(panel.getByText("A =", { exact: true })).toBeVisible();
  await expect(panel.getByText("B =", { exact: true })).toBeVisible();
  await expect(panel.getByText("Resultado =", { exact: true })).toBeVisible();
  await expect(panel.locator("time")).toContainText(/\d{2}\/\d{2}\/\d{4}/);
  await expect(panel.locator("time")).toContainText(/\d{2}:\d{2}/);

  await panel.getByRole("button", { name: /Reusar entrada/ }).click();
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Matrices", exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Matriz A celda fila 1 columna 1")).toHaveValue("1");
  await expect(page.getByLabel("Matriz A celda fila 1 columna 2")).toHaveValue("2");
  await expect(page.getByLabel("Matriz A celda fila 2 columna 1")).toHaveValue("3");
  await expect(page.getByLabel("Matriz A celda fila 2 columna 2")).toHaveValue("4");
  await expect(page.getByLabel("Matriz B celda fila 1 columna 1")).toHaveValue("5");
  await expect(page.getByLabel("Matriz B celda fila 2 columna 2")).toHaveValue("8");
});
