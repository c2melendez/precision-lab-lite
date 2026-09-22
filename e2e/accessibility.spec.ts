import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoWcagViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(
    results.violations,
    results.violations
      .map((violation) =>
        `${violation.id}: ${violation.help}\n${violation.nodes
          .map((node) => `  ${node.target.join(" ")} — ${node.failureSummary ?? ""}`)
          .join("\n")}`,
      )
      .join("\n\n"),
  ).toEqual([]);
}

test("M19: landmarks, skip-link y navegación principal cumplen WCAG A/AA", async ({ page }) => {
  await page.goto("./");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Modos de la calculadora" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido principal" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  await expectNoWcagViolations(page);
});

test("M19: los modos visibles no introducen violaciones WCAG A/AA", async ({ page }) => {
  await page.goto("./");
  const nav = page.getByRole("navigation", { name: "Modos de la calculadora" });
  for (const name of ["Científica", "Matrices", "Gráficas", "Estadística", "Unidades"]) {
    await nav.getByRole("button", { name, exact: true }).click();
    await expectNoWcagViolations(page);
  }
});

test("M19: Historial se cierra con Escape y devuelve el foco al disparador", async ({ page }) => {
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "Historial", exact: true });
  await trigger.focus();
  await trigger.click();
  await expect(page.locator("#history-panel")).toBeVisible();
  await expectNoWcagViolations(page);

  await page.keyboard.press("Escape");
  await expect(page.locator("#history-panel")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
