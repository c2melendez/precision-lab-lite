import { beforeEach, describe, expect, it, vi } from "vitest";

class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }

  clear() {
    this.data.clear();
  }
}

describe("M32 key feedback resilience", () => {
  const storage = new MemoryStorage();

  beforeEach(() => {
    storage.clear();
    vi.resetModules();
    vi.restoreAllMocks();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", { maxTouchPoints: 0 });
  });

  it("uses safe defaults when preferences are absent", async () => {
    const { readSoundEnabled, readVibrationEnabled } = await import("../src/utils/keyFeedback");

    expect(readVibrationEnabled()).toBe(true);
    expect(readSoundEnabled()).toBe(false);
  });

  it("persists vibration and sound preferences", async () => {
    const {
      readSoundEnabled,
      readVibrationEnabled,
      setSoundEnabled,
      setVibrationEnabled,
    } = await import("../src/utils/keyFeedback");

    setVibrationEnabled(false);
    setSoundEnabled(true);

    expect(storage.getItem("precision-lab-key-vibration")).toBe("false");
    expect(storage.getItem("precision-lab-key-sound")).toBe("true");
    expect(readVibrationEnabled()).toBe(false);
    expect(readSoundEnabled()).toBe(true);
  });

  it("vibrates only on touch devices when enabled", async () => {
    const vibrate = vi.fn();
    vi.stubGlobal("navigator", { maxTouchPoints: 1, vibrate });
    vi.stubGlobal("window", {});
    const { triggerKeyFeedback } = await import("../src/utils/keyFeedback");

    triggerKeyFeedback();

    expect(vibrate).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith(15);
  });

  it("does not vibrate on desktop-like devices", async () => {
    const vibrate = vi.fn();
    vi.stubGlobal("navigator", { maxTouchPoints: 0, vibrate });
    vi.stubGlobal("window", {});
    const { triggerKeyFeedback } = await import("../src/utils/keyFeedback");

    triggerKeyFeedback();

    expect(vibrate).not.toHaveBeenCalled();
  });

  it("respects explicit vibration disabled preference", async () => {
    storage.setItem("precision-lab-key-vibration", "false");
    const vibrate = vi.fn();
    vi.stubGlobal("navigator", { maxTouchPoints: 1, vibrate });
    vi.stubGlobal("window", {});
    const { triggerKeyFeedback } = await import("../src/utils/keyFeedback");

    triggerKeyFeedback();

    expect(vibrate).not.toHaveBeenCalled();
  });

  it("swallows vibration/audio failures so keyboard input cannot crash", async () => {
    storage.setItem("precision-lab-key-vibration", "true");
    storage.setItem("precision-lab-key-sound", "true");

    vi.stubGlobal("navigator", {
      maxTouchPoints: 1,
      vibrate: () => {
        throw new Error("synthetic vibration failure");
      },
    });

    class ThrowingAudioContext {
      constructor() {
        throw new Error("synthetic audio failure");
      }
    }

    vi.stubGlobal("window", { AudioContext: ThrowingAudioContext });

    const { triggerKeyFeedback } = await import("../src/utils/keyFeedback");

    expect(() => triggerKeyFeedback()).not.toThrow();
  });
});
