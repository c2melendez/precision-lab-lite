import { expect, test } from "@playwright/test";

test("M14: Lite conserva identidad PL y sidebar contractual responsive", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("precision-lab-theme", "light"));
  await page.goto("./");
  await expect(page).toHaveTitle("Precision Lab Lite");

  const sidebar = page.locator('aside[aria-label="Navegación principal"]');
  const brandImage = sidebar.locator('img[src*="precision-lab-lite.svg"]');
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const startsCompact = viewport!.width < 1200;
  await expect(sidebar).toHaveAttribute("data-sidebar-responsive", "auto");
  await expect(sidebar).toHaveAttribute("data-sidebar-state", startsCompact ? "compact" : "expanded");
  await expect(sidebar).toHaveCSS("background-color", "rgb(7, 43, 82)");
  await expect(brandImage).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Precision Lab Plus");

  if (startsCompact) {
    await expect(page.getByRole("heading", { name: "Precision Lab Lite", exact: true })).toHaveClass(/sr-only/);
  } else {
    await expect(page.getByRole("heading", { name: "Precision Lab Lite", exact: true })).toBeVisible();
  }

  const iconHref = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(iconHref).toBeTruthy();
  expect(iconHref).toContain("icons/precision-lab-lite.svg");
  const icon = await page.request.get(new URL(iconHref!, page.url()).toString());
  expect(icon.ok()).toBeTruthy();

  await expect(page.getByRole("button", { name: "Gráficas", exact: true }).locator("svg path").nth(1))
    .toHaveAttribute("d", "m6 15 4-5 3 3 5-7");
  await expect(page.getByRole("button", { name: "Geometría", exact: true }).locator("svg path").first())
    .toHaveAttribute("d", "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z");

  if (startsCompact) {
    await page.getByRole("button", { name: "Expandir navegación", exact: true }).click();
    await expect(sidebar).toHaveAttribute("data-sidebar-state", "expanded");
    await expect(page.getByRole("heading", { name: "Precision Lab Lite", exact: true })).toBeVisible();
  } else {
    const original = { width: viewport!.width, height: viewport!.height };
    await page.setViewportSize({ width: 1100, height: original.height });
    await expect(sidebar).toHaveAttribute("data-sidebar-state", "compact");
    await expect(brandImage).toBeVisible();
    await expect(page.getByRole("heading", { name: "Precision Lab Lite", exact: true })).toHaveClass(/sr-only/);

    await page.setViewportSize(original);
    await expect(sidebar).toHaveAttribute("data-sidebar-state", "expanded");
    await expect(page.getByRole("heading", { name: "Precision Lab Lite", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Contraer navegación", exact: true }).click();
    await expect(sidebar).toHaveAttribute("data-sidebar-state", "compact");
  }

  await expect(brandImage).toBeVisible();
});
