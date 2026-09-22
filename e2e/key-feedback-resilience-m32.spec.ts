import { expect, test } from "@playwright/test";

test("M32: fallos de vibración/sonido no bloquean la escritura del teclado", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-key-vibration", "true");
    localStorage.setItem("precision-lab-key-sound", "true");

    Object.defineProperty(navigator, "maxTouchPoints", {
      configurable: true,
      get: () => 1,
    });

    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: () => {
        throw new Error("M32 synthetic vibration failure");
      },
    });

    class ThrowingAudioContext {
      constructor() {
        throw new Error("M32 synthetic audio failure");
      }
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: ThrowingAudioContext,
    });
  });

  await page.goto("./");
  const input = page.locator("math-field").first();
  await expect(input).toBeVisible();

  const open = page.getByRole("button", { name: /Abrir teclado|Expandir teclado/i }).first();
  await expect(open).toBeVisible();
  await open.click();

  const keyboard = page.getByRole("dialog", { name: "Teclado matemático" });
  await expect(keyboard).toBeVisible();

  await keyboard.getByRole("button", { name: "2", exact: true }).click();
  await expect(input).toHaveJSProperty("value", "2");
});
