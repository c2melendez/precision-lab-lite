import { expect, test } from "@playwright/test";

test("M34: tema automático y movimiento siguen al sistema hasta override manual", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("precision-lab-theme", "auto");
    localStorage.removeItem("precision-lab-reduced-motion");

    const nativeMatchMedia = window.matchMedia.bind(window);
    const states = {
      dark: false,
      reduce: false,
    };

    type Listener = (event: MediaQueryListEvent) => void;

    function makeMql(query: string, key: "dark" | "reduce") {
      const listeners = new Set<Listener>();

      return {
        media: query,
        onchange: null,
        get matches() {
          return states[key];
        },
        addEventListener(type: string, cb: Listener) {
          if (type === "change") listeners.add(cb);
        },
        removeEventListener(type: string, cb: Listener) {
          if (type === "change") listeners.delete(cb);
        },
        addListener(cb: Listener) {
          listeners.add(cb);
        },
        removeListener(cb: Listener) {
          listeners.delete(cb);
        },
        dispatchEvent() {
          return true;
        },
        __emit() {
          const event = { matches: states[key], media: query } as MediaQueryListEvent;
          for (const cb of listeners) cb(event);
        },
      };
    }

    const darkMql = makeMql("(prefers-color-scheme: dark)", "dark");
    const reduceMql = makeMql("(prefers-reduced-motion: reduce)", "reduce");

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => {
        if (query === "(prefers-color-scheme: dark)") return darkMql;
        if (query === "(prefers-reduced-motion: reduce)") return reduceMql;
        return nativeMatchMedia(query);
      },
    });

    Object.defineProperty(window, "__m34SetSystemPreference", {
      configurable: true,
      value: (kind: "dark" | "reduce", value: boolean) => {
        states[kind] = value;
        if (kind === "dark") darkMql.__emit();
        else reduceMql.__emit();
      },
    });
  });

  await page.goto("./");
  await expect(page.locator("math-field").first()).toBeVisible();

  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(html).toHaveAttribute("data-reduced-motion", "false");

  await page.evaluate(() =>
    (window as Window & { __m34SetSystemPreference: (kind: "dark" | "reduce", value: boolean) => void })
      .__m34SetSystemPreference("dark", true),
  );
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.evaluate(() =>
    (window as Window & { __m34SetSystemPreference: (kind: "dark" | "reduce", value: boolean) => void })
      .__m34SetSystemPreference("reduce", true),
  );
  await expect(html).toHaveAttribute("data-reduced-motion", "true");

  const settings = page.getByRole("button", { name: "Ajustes", exact: true });
  await settings.click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();

  // Con reducción del sistema activa, el toggle arranca activado.
  // Al tocarlo, el usuario crea override manual "false".
  await menu.getByRole("button", { name: "Accesibilidad", exact: true }).click();
  const motionToggle = menu
    .getByText("Reducir movimiento", { exact: true })
    .locator("..")
    .getByRole("button");
  await expect(motionToggle).toHaveAttribute("aria-pressed", "true");
  await motionToggle.click();

  expect(
    await page.evaluate(() => localStorage.getItem("precision-lab-reduced-motion")),
  ).toBe("false");
  await expect(html).toHaveAttribute("data-reduced-motion", "false");

  // Cambios posteriores del SO ya no deben modificar el override manual.
  await page.evaluate(() =>
    (window as Window & { __m34SetSystemPreference: (kind: "dark" | "reduce", value: boolean) => void })
      .__m34SetSystemPreference("reduce", false),
  );
  await page.evaluate(() =>
    (window as Window & { __m34SetSystemPreference: (kind: "dark" | "reduce", value: boolean) => void })
      .__m34SetSystemPreference("reduce", true),
  );
  await expect(html).toHaveAttribute("data-reduced-motion", "false");

  // Igual para tema: una selección manual deja de seguir al sistema.
  await menu.getByRole("button", { name: "Apariencia", exact: true }).click();
  await menu.getByRole("button", { name: "Oscuro", exact: true }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.evaluate(() =>
    (window as Window & { __m34SetSystemPreference: (kind: "dark" | "reduce", value: boolean) => void })
      .__m34SetSystemPreference("dark", false),
  );
  await expect(html).toHaveAttribute("data-theme", "dark");
});
