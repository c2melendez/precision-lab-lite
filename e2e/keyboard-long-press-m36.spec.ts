import { expect, test } from "@playwright/test";

test("M36: long-press muestra tooltip sin insertar y tap corto sigue insertando", async ({ page }) => {
  await page.goto("./");

  const input = page.locator("math-field").first();
  await expect(input).toBeVisible();
  await input.focus();

  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();

  const twoKey = page.getByRole("button", { name: "2", exact: true });
  await expect(twoKey).toBeVisible();

  await twoKey.dispatchEvent("pointerdown", {
    pointerType: "touch",
    button: 0,
    buttons: 1,
  });
  await page.waitForTimeout(450);

  await expect(page.getByText("inserta el número dos", { exact: true })).toBeVisible();

  await twoKey.dispatchEvent("pointerup", {
    pointerType: "touch",
    button: 0,
    buttons: 0,
  });

  expect(
    await input.evaluate((node) => (node as HTMLElement & { value: string }).value),
  ).toBe("");

  await twoKey.click();

  await expect.poll(async () =>
    input.evaluate((node) => (node as HTMLElement & { value: string }).value),
  ).toBe("2");
});
