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
  await page.locator("#main-content").getByRole("button", { name: "Calcular", exact: true }).click();

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
  await page.locator("#main-content").getByRole("button", { name: "Calcular", exact: true }).click();

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

  await page.locator("#main-content").getByRole("button", { name: "Calcular", exact: true }).click();

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

  await page.locator("#main-content").getByRole("button", { name: "Calcular", exact: true }).click();

  await expect(page.getByText("Aproximado numéricamente (no resuelto simbólicamente)")).toBeVisible({ timeout: 12000 });
  const procedure = page.getByRole("list", { name: "Procedimiento paso a paso" });
  await expect(procedure).toBeVisible({ timeout: 12000 });
  await expect(procedure).toContainText("Eigenvector correspondiente:");
  await expect(procedure).not.toContainText("no se pudo calcular");
});


test("M24: eigen repetido 4x4 identidad agrupa multiplicidad y conserva eigenvector", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  const incRows = page.getByRole("button", { name: "Aumentar Filas A", exact: true });
  const incCols = page.getByRole("button", { name: "Aumentar Col A", exact: true });
  for (let i = 0; i < 2; i++) {
    await incRows.click();
    await incCols.click();
  }

  const eigen = page.getByRole("button", { name: "Eigenvalores y eigenvectores", exact: true });
  await eigen.click();

  const cells = page.locator('input[placeholder="0"]');
  await expect(cells).toHaveCount(16);
  for (const index of [0,5,10,15]) await cells.nth(index).fill("1");

  await page.locator("#main-content").getByRole("button", { name: "Calcular", exact: true }).click();

  const procedure = page.getByRole("list", { name: "Procedimiento paso a paso" });
  await expect(procedure).toBeVisible({ timeout: 12000 });
  await expect(procedure).toContainText("Multiplicidad algebraica 4");
  await expect(procedure).toContainText("Eigenvector:");
  await expect(procedure).not.toContainText("no se pudo calcular");
});


test("M25: matrices C y F persisten, se seleccionan explícitamente y calculan C + F", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  const primary = page.getByRole("combobox", { name: "Matriz principal" });
  const secondary = page.getByRole("combobox", { name: "Matriz secundaria" });

  await primary.selectOption("C");
  await secondary.selectOption("F");
  await expect(page.getByRole("button", { name: "C + F", exact: true })).toBeVisible();

  const cells = page.locator('input[placeholder="0"]');
  await expect(cells).toHaveCount(8);

  // C = diag(1,2), F = diag(10,20)
  for (const [index, value] of [[0,"1"],[3,"2"],[4,"10"],[7,"20"]] as const) {
    await cells.nth(index).fill(value);
  }

  await page.locator("#main-content").getByRole("button", { name: "Calcular", exact: true }).click();
  const resultField = page.locator("math-field[read-only]").last();
  await expect(resultField).toBeVisible({ timeout: 12000 });
  const resultValue = await resultField.evaluate((el) =>
    String((el as HTMLElement & { value?: string }).value ?? ""),
  );
  expect(resultValue).toContain("11");
  expect(resultValue).toContain("22");

  await page.reload();
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  await expect(page.getByRole("combobox", { name: "Matriz principal" })).toHaveValue("C");
  await expect(page.getByRole("combobox", { name: "Matriz secundaria" })).toHaveValue("F");
  await expect(page.getByRole("button", { name: "C + F", exact: true })).toBeVisible();

  const persistedCells = page.locator('input[placeholder="0"]');
  await expect(persistedCells).toHaveCount(8);
  await expect(persistedCells.nth(0)).toHaveValue("1");
  await expect(persistedCells.nth(3)).toHaveValue("2");
  await expect(persistedCells.nth(4)).toHaveValue("10");
  await expect(persistedCells.nth(7)).toHaveValue("20");

  const duplicateTarget = page.getByRole("combobox", { name: "Duplicar principal en" });
  await duplicateTarget.selectOption("D");
  await page.getByRole("button", { name: "Duplicar C en D", exact: true }).click();

  await page.getByRole("combobox", { name: "Matriz principal" }).selectOption("D");
  const copiedCells = page.locator('input[placeholder="0"]');
  await expect(copiedCells.nth(0)).toHaveValue("1");
  await expect(copiedCells.nth(3)).toHaveValue("2");

  await page.reload();
  await page.getByRole("button", { name: "Matrices", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Matriz principal" })).toHaveValue("D");
  const reloadedCopy = page.locator('input[placeholder="0"]');
  await expect(reloadedCopy.nth(0)).toHaveValue("1");
  await expect(reloadedCopy.nth(3)).toHaveValue("2");
});


test("M26: expresiones matriciales A-F evalúan matrices y escalares por el worker", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Matrices", exact: true }).click();

  const primary = page.getByRole("combobox", { name: "Matriz principal" });
  const secondary = page.getByRole("combobox", { name: "Matriz secundaria" });
  await primary.selectOption("C");
  await secondary.selectOption("F");

  const cells = page.locator('input[placeholder="0"]');
  await expect(cells).toHaveCount(8);

  // C = diag(1,2), F = diag(10,20)
  for (const [index, value] of [[0,"1"],[3,"2"],[4,"10"],[7,"20"]] as const) {
    await cells.nth(index).fill(value);
  }

  const expression = page.getByLabel("Expresión matricial A–F");
  await expression.fill("(C+F)*C");
  await page.getByRole("button", { name: "Evaluar expresión", exact: true }).click();

  let resultField = page.locator("math-field[read-only]").last();
  await expect(resultField).toBeVisible({ timeout: 12000 });
  let value = await resultField.evaluate((el) =>
    String((el as HTMLElement & { value?: string }).value ?? ""),
  );
  expect(value).toContain("11");
  expect(value).toContain("44");

  await expression.fill("det(C)+tr(F)");
  await page.getByRole("button", { name: "Evaluar expresión", exact: true }).click();

  const scalarResult = page.getByRole("status").filter({ hasText: "32" }).first();
  await expect(scalarResult).toBeVisible({ timeout: 12000 });
  await expect(scalarResult).toContainText("32");
});
