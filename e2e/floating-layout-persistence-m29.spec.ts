import { expect, test } from "@playwright/test";

test("M29: Flotante recupera geometría persistida y la recorta al viewport", async ({ page }) => {
  const viewport = page.viewportSize();
  test.skip((viewport?.width ?? 0) < 1024, "Flotante degrada a Enfoque por debajo de 1024px");

  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-layout-mode", "floating");
    localStorage.setItem(
      "precision-lab-floating-layout",
      JSON.stringify({
        keyboardWindow: { x: 5000, y: 5000, width: 1400, height: 1000 },
        graphWindow: { x: -500, y: 5000, width: 1200, height: 900 },
      }),
    );
  });

  await page.goto("./");

  const graph = page.getByRole("dialog", { name: "Gráfica" });
  await expect(graph).toBeVisible();

  const graphBox = await graph.boundingBox();
  expect(graphBox).not.toBeNull();
  expect(graphBox!.x).toBeGreaterThanOrEqual(0);
  expect(graphBox!.y).toBeGreaterThanOrEqual(0);
  expect(graphBox!.x + graphBox!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
  expect(graphBox!.y + graphBox!.height).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("precision-lab-floating-layout") ?? "{}"),
  );

  for (const rect of [stored.keyboardWindow, stored.graphWindow]) {
    expect(rect.x).toBeGreaterThanOrEqual(8);
    expect(rect.y).toBeGreaterThanOrEqual(8);
    expect(rect.width).toBeGreaterThanOrEqual(220);
    expect(rect.height).toBeGreaterThanOrEqual(160);
    expect(rect.x + rect.width).toBeLessThanOrEqual((viewport?.width ?? 0) - 8 + 1);
    expect(rect.y + rect.height).toBeLessThanOrEqual((viewport?.height ?? 0) - 8 + 1);
  }

  await page.reload();
  await expect(page.getByRole("dialog", { name: "Gráfica" })).toBeVisible();

  const reloaded = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("precision-lab-floating-layout") ?? "{}"),
  );
  expect(reloaded).toEqual(stored);
});
