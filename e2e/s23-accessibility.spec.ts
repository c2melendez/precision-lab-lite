import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoCriticalSerious(page: Page) {
  for (const field of await page.locator("math-field").all()) {
    const label = await field.getAttribute("aria-label");
    expect((label ?? "").trim().length, "math-field sin nombre accesible").toBeGreaterThan(0);
  }

  const result = await new AxeBuilder({ page }).exclude("math-field").withTags(WCAG_TAGS).analyze();
  const blocking = result.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  expect(
    blocking,
    blocking
      .map((v) => `${v.id} [${v.impact}]: ${v.help}\n${v.nodes.map((n) => `  ${n.target.join(" ")} — ${n.failureSummary ?? ""}`).join("\n")}`)
      .join("\n\n"),
  ).toEqual([]);
}

async function setExpression(page: Page, value: string) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.evaluate((node, v) => {
    const el = node as HTMLElement & { value: string };
    el.value = v as string;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test("S23: axe sin teclado y con teclado abierto no reporta critical/serious", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("main")).toBeVisible();
  await expectNoCriticalSerious(page);

  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await expect(opener).toBeVisible();
  await opener.focus();
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cerrar teclado" })).toBeFocused();
  await expectNoCriticalSerious(page);
});

test("S23: teclas no disponibles exponen aria-disabled y tabs tienen nombre", async ({ page }) => {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();

  const tabs = dialog.getByRole("tab");
  expect(await tabs.count()).toBeGreaterThan(0);

  for (let i = 0; i < await tabs.count(); i++) {
    const tab = tabs.nth(i);
    expect((await tab.getAttribute("aria-label")) ?? (await tab.textContent()) ?? "").not.toBe("");
    await tab.click();

    const visuallyUnavailable = dialog.locator('button[class*="border-dashed"]');
    for (let j = 0; j < await visuallyUnavailable.count(); j++) {
      const button = visuallyUnavailable.nth(j);
      if (await button.isVisible()) {
        await expect(button).toHaveAttribute("aria-disabled", "true");
      }
    }
  }
});

test("S23: Escape cierra el teclado y devuelve el foco al disparador", async ({ page }) => {
  await page.goto("./");
  const opener = page.getByRole("button", { name: /abrir teclado|expandir teclado/i }).first();
  await opener.focus();
  await opener.click();

  const dialog = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cerrar teclado" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("S23: resultado y error dinámicos son anunciables", async ({ page }) => {
  await page.goto("./");

  await setExpression(page, "2+2");
  const calculate = page.getByRole("button", { name: /calcular|evaluar/i }).first();
  await expect(calculate).toBeEnabled();
  await calculate.click();

  await expect.poll(async () =>
    page.locator('[role="status"], [aria-live="polite"]').evaluateAll((els) =>
      els.some((el) => (el.textContent ?? "").replace(/\s+/g, " ").includes("4")),
    ),
  ).toBe(true);

  await setExpression(page, "(");
  await calculate.click();

  await expect(page.locator('[role="alert"][aria-live="assertive"]').first()).toBeVisible({ timeout: 15000 });
});
