import { expect, test } from "@playwright/test";

test("M33: Ajustes persiste preferencias visuales y de accesibilidad tras reload", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  const openSettings = page.getByRole("button", { name: "Ajustes", exact: true });
  await openSettings.click();

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();

  await menu.getByRole("button", { name: "Sepia Cuaderno", exact: true }).click();
  await menu.getByRole("button", { name: "Compacta", exact: true }).click();
  await menu.getByRole("button", { name: "Muy grande", exact: true }).click();

  const dyslexiaToggle = menu
    .getByText("Espaciado amigable con dislexia", { exact: true })
    .locator("..")
    .getByRole("button");
  await dyslexiaToggle.click();

  const motionToggle = menu
    .getByText("Reducir movimiento", { exact: true })
    .locator("..")
    .getByRole("button");
  await motionToggle.click();

  await menu.getByRole("button", { name: /Apta para daltonismo/i }).click();

  const persisted = await page.evaluate(() => ({
    theme: localStorage.getItem("precision-lab-theme"),
    density: localStorage.getItem("precision-lab-density"),
    textSize: localStorage.getItem("precision-lab-text-size"),
    dyslexia: localStorage.getItem("precision-lab-dyslexia-friendly"),
    reducedMotion: localStorage.getItem("precision-lab-reduced-motion"),
    graphPalette: localStorage.getItem("precision-lab-graph-palette"),
    html: {
      theme: document.documentElement.getAttribute("data-theme"),
      density: document.documentElement.getAttribute("data-density"),
      textSize: document.documentElement.getAttribute("data-text-size"),
      dyslexia: document.documentElement.getAttribute("data-dyslexia-friendly"),
      reducedMotion: document.documentElement.getAttribute("data-reduced-motion"),
    },
  }));

  expect(persisted).toEqual({
    theme: "sepia",
    density: "compact",
    textSize: "xlarge",
    dyslexia: "true",
    reducedMotion: "true",
    graphPalette: "colorblind-safe",
    html: {
      theme: "sepia",
      density: "compact",
      textSize: "xlarge",
      dyslexia: "true",
      reducedMotion: "true",
    },
  });

  await page.reload();
  await expect(page.locator("math-field").first()).toBeVisible();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "sepia");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "xlarge");
  await expect(page.locator("html")).toHaveAttribute("data-dyslexia-friendly", "true");
  await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "true");

  await openSettings.click();
  const reloadedMenu = page.getByRole("menu");
  await expect(reloadedMenu).toBeVisible();

  await expect(reloadedMenu.getByRole("button", { name: /Sepia Cuaderno/i })).toHaveAttribute("aria-pressed", "true");
  await expect(reloadedMenu.getByRole("button", { name: "Compacta", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(reloadedMenu.getByRole("button", { name: "Muy grande", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(
    reloadedMenu.getByText("Espaciado amigable con dislexia", { exact: true }).locator("..").getByRole("button"),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    reloadedMenu.getByText("Reducir movimiento", { exact: true }).locator("..").getByRole("button"),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(reloadedMenu.getByRole("button", { name: /Apta para daltonismo/i })).toHaveAttribute("aria-pressed", "true");
});
