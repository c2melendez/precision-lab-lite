// @ts-nocheck
import { expect, test } from "@playwright/test";
import { gunzipSync } from "node:zlib";

const ENGINE = "Lite";
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

async function ensureDegreeMode(page, wantDegree) {
  const trigger = page.getByRole("button", { name: /Modo de ángulo|modo angular|Unidad angular|RAD|DEG|GRAD/i }).first();
  if (!(await trigger.count())) return false;

  const readDegreeState = async () => {
    const label = ((await trigger.getAttribute("aria-label")) || (await trigger.innerText()) || "").toUpperCase();
    return label.includes("GRAD") || label.includes("DEG");
  };

  if ((await readDegreeState()) === wantDegree) return true;

  // In CalculatorScreen the RAD/DEG badge itself toggles the mode. Some
  // older shells instead open a selector. Re-read the actual UI state
  // before touching any fallback control so the diagnostic never toggles
  // twice and reports a fictitious degreeMode.
  await trigger.click();
  await page.waitForTimeout(50);
  if ((await readDegreeState()) === wantDegree) return true;

  const option = page.getByRole("button", {
    name: wantDegree ? /DEG|GRAD|GRADOS/i : /RAD|RADIAN/i,
  }).last();
  if (await option.count()) {
    await option.click();
    await page.waitForTimeout(50);
    if ((await readDegreeState()) === wantDegree) return true;
  }

  const sw = page.getByRole("switch").first();
  if (await sw.count()) {
    await sw.click();
    await page.waitForTimeout(50);
    return (await readDegreeState()) === wantDegree;
  }

  return false;
}

function normalizeMatrixExercise(value) {
  const raw = String(value ?? "").trim();
  const code = raw.match(/`([^`]*)`/);
  return (code ? code[1] : raw)
    .replace(/^\s*`|`\s*$/g, "")
    .trim();
}

function delayFor(id) {
  if (/^(IT|ID|LM|DV)-/.test(id)) return 1900;
  if (/^CL-0[1-5]$/.test(id)) return 1900;
  return 850;
}

test.describe("Trig matrix diagnostic " + ENGINE, () => {
  for (let shard = 0; shard < 4; shard += 1) {
    test("324 ejercicios · bloque " + (shard + 1) + "/4", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-chromium", "diagnostic runs once per shard");
      test.setTimeout(8 * 60 * 1000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await openScientific(page);

      let degreeMode = false;
      const selected = CASES.filter((_, index) => index % 4 === shard);
      for (const item of selected) {
        const wantDegree = item.id.startsWith("GR-");
        if (wantDegree !== degreeMode) {
          degreeMode = (await ensureDegreeMode(page, wantDegree)) ? wantDegree : degreeMode;
        }

        if (item.id === "CL-10") {
          console.log("TRIG_MATRIX_RESULT " + JSON.stringify({
            engine: ENGINE, id: item.id, status: "SKIP_CONTEXT",
            exercise: item.exercise_cell, expected: item.expected, shard: shard + 1,
            output: "Requiere evaluar la derivada en x=1/2; el bloque LaTeX de la matriz no contiene esa sustitución."
          }));
          continue;
        }

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
          await page.waitForTimeout(delayFor(item.id));

          const alert = page.locator('[role="alert"][aria-live="assertive"]').first();
          if (await alert.isVisible().catch(() => false)) {
            status = "ERROR";
            error = ((await alert.innerText().catch(() => "")) || "").replace(/\s+/g, " ").trim().slice(0, 700);
          }
          const region = page.getByRole("region", { name: "Resultado", exact: true });
          const mathFields = region.locator('math-field[read-only], math-field[readonly]');
          if (await mathFields.count()) {
            const values = await mathFields.evaluateAll((nodes) => nodes.map((node) => node.value || ""));
            output = values.filter(Boolean).join(" || ").slice(0, 1400);
          } else {
            const annotations = region.locator('annotation[encoding="application/x-tex"]');
            if (await annotations.count()) {
              const values = await annotations.allTextContents();
              output = values.filter(Boolean).join(" || ").slice(0, 1400);
            } else {
              output = ((await region.innerText().catch(() => "")) || "").replace(/\s+/g, " ").trim().slice(0, 1400);
            }
          }
          if (!output && !error) status = "NO_OUTPUT";
        } catch (e) {
          status = "HARNESS_ERROR";
          error = String(e).replace(/\s+/g, " ").slice(0, 900);
        }

        console.log("TRIG_MATRIX_RESULT " + JSON.stringify({
          engine: ENGINE, id: item.id, status,
          exercise: item.exercise_cell, expected: item.expected,
          output, error, normalizedInput, degreeMode, shard: shard + 1
        }));
      }
    });
  }
});
