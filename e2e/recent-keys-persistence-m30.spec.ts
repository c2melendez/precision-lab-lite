import { expect, test } from "@playwright/test";

test("M30: teclas recientes rehidratan, reordenan y persisten tras reload", async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem("precision-lab-recent-keys")) return;
    localStorage.setItem(
      "precision-lab-recent-keys",
      JSON.stringify({
        basic: {
          operations: [
            { glyph: "sin", insertLatex: "\\sin\\left(#0\\right)", ariaLabel: "seno" },
            { glyph: "cos", insertLatex: "\\cos\\left(#0\\right)", ariaLabel: "coseno" },
          ],
          variables: [],
        },
      }),
    );
  });

  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  const recentLabel = page.getByText("Recientes", { exact: true }).first();
  await expect(recentLabel).toBeVisible();

  const recentRow = recentLabel.locator("..");
  const recentButtons = recentRow.getByRole("button");

  await expect(recentButtons).toHaveCount(2);
  await expect(recentButtons.nth(0)).toHaveAttribute("aria-label", "seno");
  await expect(recentButtons.nth(1)).toHaveAttribute("aria-label", "coseno");

  await recentButtons.nth(1).click();

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = localStorage.getItem("precision-lab-recent-keys");
        if (!raw) return [];
        return JSON.parse(raw).basic?.operations?.map((k: { ariaLabel: string }) => k.ariaLabel) ?? [];
      }),
    )
    .toEqual(["coseno", "seno"]);

  await page.reload();
  await expect(page.locator("math-field").first()).toBeVisible();

  const reloadedLabel = page.getByText("Recientes", { exact: true }).first();
  await expect(reloadedLabel).toBeVisible();
  const reloadedButtons = reloadedLabel.locator("..").getByRole("button");

  await expect(reloadedButtons.nth(0)).toHaveAttribute("aria-label", "coseno");
  await expect(reloadedButtons.nth(1)).toHaveAttribute("aria-label", "seno");
});
