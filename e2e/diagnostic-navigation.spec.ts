import { test, expect } from "@playwright/test";

test("diagnóstico de navegación al calcular Lite", async ({ page }) => {
  const events: string[] = [];
  page.on("console", (msg) => events.push("CONSOLE: " + msg.text()));
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) events.push("NAV: " + frame.url());
  });

  await page.addInitScript(() => {
    window.addEventListener("beforeunload", () => console.log("DIAG_BEFOREUNLOAD"));
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
      console.log(
        "DIAG_SUBMIT action=" + (form?.action ?? "") +
        " submitter=" + (submitter?.getAttribute("aria-label") ?? submitter?.textContent ?? "") +
        " type=" + (submitter?.type ?? ""),
      );
    }, true);
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button") as HTMLButtonElement | null;
      if (button && /calcular/i.test(button.getAttribute("aria-label") ?? button.textContent ?? "")) {
        console.log(
          "DIAG_CLICK_CALC type=" + button.type +
          " form=" + Boolean(button.form) +
          " defaultPrevented=" + event.defaultPrevented,
        );
      }
    }, true);
  });

  await page.goto("./");
  const field = page.locator("math-field").first();
  await field.focus();
  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();
  await keyboard.getByRole("tab", { name: "Básico", exact: true }).click();
  await keyboard.getByRole("button", { name: "borrar todo el campo", exact: true }).click();
  await keyboard.getByRole("button", { name: "2", exact: true }).click();
  await keyboard.getByRole("button", { name: "sumar", exact: true }).click();
  await keyboard.getByRole("button", { name: "2", exact: true }).click();

  const swBefore = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return [] as string[];
    return (await navigator.serviceWorker.getRegistrations()).map((r) => r.scope);
  });
  events.push("SW_BEFORE: " + JSON.stringify(swBefore));
  events.push("FIELD_BEFORE: " + await field.evaluate((el) => String((el as HTMLElement & { value?: string }).value ?? "")));

  // Descarta la navegación inicial de page.goto; a partir de aquí solo
  // interesan eventos causados por Calcular.
  const baseline = events.length;
  await keyboard.getByRole("button", { name: "calcular", exact: true }).click();
  await page.waitForTimeout(2500);

  let after = "";
  try {
    after = await page.locator("body").innerText();
  } catch (e) {
    after = "BODY_READ_FAILED: " + String(e);
  }
  const navEntries = await page.evaluate(() =>
    performance.getEntriesByType("navigation").map((x) => ({
      name: x.name,
      type: (x as PerformanceNavigationTiming).type,
    })),
  ).catch(() => []);

  const relevant = events.slice(baseline);
  relevant.push("URL_AFTER: " + page.url());
  relevant.push("NAV_ENTRIES: " + JSON.stringify(navEntries));
  relevant.push("BODY_HAS_RESULT_CLASS: " + String(await page.locator(".a11y-scale-result-3xl").count()));
  relevant.push("BODY_TAIL: " + JSON.stringify(after.slice(-1200)));

  throw new Error("NAV_DIAGNOSTIC\n" + relevant.join("\n"));
});
