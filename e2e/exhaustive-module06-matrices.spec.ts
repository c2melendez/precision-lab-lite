import { expect, test } from "@playwright/test";

test("suite original módulo 6: matrices expone rango, traza y eigen y calcula rango", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  await expect(page.getByRole("button", { name: "Eigenvalores y eigenvectores", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "tr(A)", exact: true })).toBeVisible();
  const rankButton = page.getByRole("button", { name: "rango(A)", exact: true });
  await expect(rankButton).toBeVisible();
  await rankButton.click();

  const cells = page.locator('input[placeholder="0"]');
  await cells.nth(0).fill("1");
  await cells.nth(1).fill("2");
  await cells.nth(2).fill("2");
  await cells.nth(3).fill("4");
  await page.getByRole("button", { name: "Calcular", exact: true }).click();

  // ResultPanel renderiza resultados simbólicos en MathLive/Shadow DOM.
  // La fuente de verdad accesible es la propiedad value del host readonly.
  const resultField = page.locator("math-field[read-only]").last();
  await expect(resultField).toBeVisible({ timeout: 12000 });
  await expect(resultField).toHaveJSProperty("value", "1");
});


test("M21: Lite permite 6x6, calcula rango 6 y mantiene la grilla dentro del viewport", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  const incRows = page.getByRole("button", { name: "Aumentar Filas A", exact: true });
  const incCols = page.getByRole("button", { name: "Aumentar Col A", exact: true });

  for (let i = 0; i < 4; i++) {
    await incRows.click();
    await incCols.click();
  }

  await expect(page.getByText("6", { exact: true }).first()).toBeVisible();

  // Seleccionar una operación que solo usa A oculta la matriz B 2x2
  // inicial; así el locator representa exactamente las 36 celdas de A.
  const rankButton = page.getByRole("button", { name: "rango(A)", exact: true });
  await rankButton.click();

  const cells = page.locator('input[placeholder="0"]');
  await expect(cells).toHaveCount(36);

  for (const index of [0, 7, 14, 21, 28, 35]) {
    await cells.nth(index).fill("1");
  }
  await page.getByRole("button", { name: "Calcular", exact: true }).click();

  const resultField = page.locator("math-field[read-only]").last();
  await expect(resultField).toBeVisible({ timeout: 12000 });
  await expect(resultField).toHaveJSProperty("value", "6");

  const eigen = page.getByRole("button", { name: "Eigenvalores y eigenvectores", exact: true });
  await expect(eigen).toBeEnabled();

  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewport + 2);
});


test("M22: eigenvectores complejos 2x2 se muestran en Lite", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  const eigen = page.getByRole("button", { name: "Eigenvalores y eigenvectores", exact: true });
  await expect(eigen).toBeEnabled();
  await eigen.click();

  const cells = page.locator('input[placeholder="0"]');
  await expect(cells).toHaveCount(4);
  await cells.nth(0).fill("0");
  await cells.nth(1).fill("-1");
  await cells.nth(2).fill("1");
  await cells.nth(3).fill("0");

  await page.getByRole("button", { name: "Calcular", exact: true }).click();

  const procedure = page.getByRole("list", { name: "Procedimiento paso a paso" });
  await expect(procedure).toBeVisible({ timeout: 12000 });
  await expect(procedure).toContainText("Eigenvector correspondiente:");
  await expect(procedure).toContainText("i");
  await expect(procedure).not.toContainText("no calculado en Lite");
});


test("M23: eigen 4x4 usa fallback numérico y muestra eigenvectores", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  const incRows = page.getByRole("button", { name: "Aumentar Filas A", exact: true });
  const incCols = page.getByRole("button", { name: "Aumentar Col A", exact: true });
  for (let i = 0; i < 2; i++) {
    await incRows.click();
    await incCols.click();
  }

  const eigen = page.getByRole("button", { name: "Eigenvalores y eigenvectores", exact: true });
  await expect(eigen).toBeEnabled();
  await eigen.click();

  const cells = page.locator('input[placeholder="0"]');
  await expect(cells).toHaveCount(16);
  for (const [index, value] of [[0,"1"],[5,"2"],[10,"3"],[15,"4"]] as const) {
    await cells.nth(index).fill(value);
  }

  await page.getByRole("button", { name: "Calcular", exact: true }).click();

  await expect(page.getByText("Aproximado numéricamente (no resuelto simbólicamente)")).toBeVisible({ timeout: 12000 });
  const procedure = page.getByRole("list", { name: "Procedimiento paso a paso" });
  await expect(procedure).toBeVisible({ timeout: 12000 });
  await expect(procedure).toContainText("Eigenvector correspondiente:");
  await expect(procedure).not.toContainText("no se pudo calcular");
});
