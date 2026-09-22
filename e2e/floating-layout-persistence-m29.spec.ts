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
  await expect(page.getByRole("dialog", { name: "Gráfica" })).toBeVisible();

  const openKeyboard = page.getByRole("button", { name: "Abrir teclado", exact: true });
  await expect(openKeyboard).toBeVisible();
  await openKeyboard.click();

  const dialogs = [
    page.getByRole("dialog", { name: "Gráfica" }),
    page.getByRole("dialog", { name: "Teclado" }),
  ];

  for (const dialog of dialogs) {
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);
  }

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("precision-lab-floating-layout") ?? "{}"),
  );

  expect(stored.keyboardWindow.x).toBeGreaterThanOrEqual(8);
  expect(stored.keyboardWindow.y).toBeGreaterThanOrEqual(8);
  expect(stored.graphWindow.x).toBeGreaterThanOrEqual(8);
  expect(stored.graphWindow.y).toBeGreaterThanOrEqual(8);

  await page.reload();
  await expect(page.getByRole("dialog", { name: "Gráfica" })).toBeVisible();

  const reloaded = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("precision-lab-floating-layout") ?? "{}"),
  );
  expect(reloaded).toEqual(stored);
});
