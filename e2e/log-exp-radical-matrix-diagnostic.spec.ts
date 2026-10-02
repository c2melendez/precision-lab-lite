// @ts-nocheck
import { expect, test } from "@playwright/test";
import { gunzipSync } from "node:zlib";

const ENGINE = "Lite";
// Source attachment SHA-256: bb7030e28f11b2bfb61b6c7d64e3d4e1c758702cc15d2d0cffc0304433fd4912
const CASES = JSON.parse(gunzipSync(Buffer.from("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", "base64")).toString("utf8"));

async function openScientific(page) {
  await page.goto("./");
  await page.evaluate(() => localStorage.setItem("precision-lab-layout-mode", "fused"));
  await page.reload();
  const scientific = page.locator("nav").getByRole("button", { name: "Científica", exact: true });
  await scientific.click();
  await expect(scientific).toHaveAttribute("aria-current", "page");
}

async function setExpression(page, value) {
  await page.evaluate(() => customElements.whenDefined("math-field"));
  const field = page.locator("math-field").first();
  await expect(field).toBeVisible();
  await field.evaluate((node, v) => {
    node.value = v;
    node.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
  return field.evaluate((node) => node.value || "");
}

function normalizeMatrixExercise(value) {
  const raw = String(value ?? "").trim();
  const code = raw.match(/\`([^\`]*)\`/);
  return (code ? code[1] : raw).replace(/^\s*\`|\`\s*$/g, "").trim();
}

function delayFor(item) {
  if (/^(LM|DV|IT|ID)-/.test(item.id)) return 1800;
  if (/^(EC|IN)-/.test(item.id) && item.level === "N3") return 1400;
  return 850;
}

test.describe("Log/exp/radical matrix diagnostic " + ENGINE, () => {
  for (let shard = 0; shard < 6; shard += 1) {
    test("540 ejercicios · bloque " + (shard + 1) + "/6", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-chromium", "diagnostic runs once per shard");
      test.setTimeout(10 * 60 * 1000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await openScientific(page);

      const selected = CASES.filter((_, index) => index % 6 === shard);
      for (const item of selected) {
        let status = "RESULT";
        let output = "";
        let error = "";
        let normalizedInput = "";
        try {
          normalizedInput = await setExpression(page, normalizeMatrixExercise(item.exercise));
          const calculate = page.getByRole("region", { name: "Entrada", exact: true })
            .getByRole("button", { name: /calcular|evaluar/i }).first();
          await expect(calculate).toBeEnabled({ timeout: 5000 });
          await calculate.click();
          await page.waitForTimeout(delayFor(item));

          const alert = page.locator('[role="alert"][aria-live="assertive"]').first();
          if (await alert.isVisible().catch(() => false)) {
            status = "ERROR";
            error = ((await alert.innerText().catch(() => "")) || "").replace(/\s+/g, " ").trim().slice(0, 900);
          }
          const region = page.getByRole("region", { name: "Resultado", exact: true });
          const mathFields = region.locator('math-field[read-only], math-field[readonly]');
          if (await mathFields.count()) {
            const values = await mathFields.evaluateAll((nodes) => nodes.map((node) => node.value || ""));
            output = values.filter(Boolean).join(" || ").slice(0, 1600);
          } else {
            const annotations = region.locator('annotation[encoding="application/x-tex"]');
            if (await annotations.count()) {
              const values = await annotations.allTextContents();
              output = values.filter(Boolean).join(" || ").slice(0, 1600);
            } else {
              output = ((await region.innerText().catch(() => "")) || "").replace(/\s+/g, " ").trim().slice(0, 1600);
            }
          }
          if (!output && !error) status = "NO_OUTPUT";
        } catch (e) {
          status = "HARNESS_ERROR";
          error = String(e).replace(/\s+/g, " ").slice(0, 1100);
        }

        console.log("LER_MATRIX_RESULT " + JSON.stringify({
          engine: ENGINE,
          id: item.id,
          level: item.level,
          status,
          exercise: item.exercise_cell,
          expected: item.expected,
          output,
          error,
          normalizedInput,
          shard: shard + 1
        }));
      }
    });
  }
});
