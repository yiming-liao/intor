/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeNavigation } from "@/client/shared/navigation";
import { setLocaleCookie } from "@/client/shared/utils";
import { shouldSyncLocale } from "@/policies";

vi.mock("@/policies", () => ({
  shouldSyncLocale: vi.fn(),
}));

vi.mock("@/client/shared/utils", () => ({
  setLocaleCookie: vi.fn(),
}));

describe("executeNavigation", () => {
  const baseConfig = { cookie: { persist: true } } as any;

  let setLocale: any;

  beforeEach(() => {
    setLocale = vi.fn();
    vi.clearAllMocks(); // mock location.href
    Object.defineProperty(globalThis, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  // --------------------------------------------------
  // External navigation
  // --------------------------------------------------
  it("does nothing for external navigation", () => {
    executeNavigation(
      { kind: "external", destination: "https://example.com", locale: "en" },
      { config: baseConfig, currentLocale: "en", setLocale },
    );
    expect(setLocale).not.toHaveBeenCalled();
    expect(setLocaleCookie).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe("");
  });

  // --------------------------------------------------
  // Reload navigation
  // --------------------------------------------------
  it("prevents default and reloads when kind is reload", () => {
    const e = { preventDefault: vi.fn() };
    (shouldSyncLocale as any).mockReturnValue(true);
    executeNavigation(
      { kind: "reload", destination: "/fr/about", locale: "fr" },
      { config: baseConfig, currentLocale: "en", setLocale },
      e,
    );
    expect(e.preventDefault).toHaveBeenCalled();
    expect(setLocaleCookie).toHaveBeenCalledWith(baseConfig.cookie, "fr");
    expect(setLocale).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe("/fr/about");
  });

  it("does not sync locale on reload if shouldSyncLocale is false", () => {
    const e = { preventDefault: vi.fn() };
    (shouldSyncLocale as any).mockReturnValue(false);
    executeNavigation(
      { kind: "reload", destination: "/en/about", locale: "en" },
      { config: baseConfig, currentLocale: "en", setLocale },
      e,
    );
    expect(e.preventDefault).toHaveBeenCalled();
    expect(setLocaleCookie).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe("/en/about");
  });

  it("reloads without persisting cookie when persist is false", () => {
    const e = { preventDefault: vi.fn() };
    (shouldSyncLocale as any).mockReturnValue(true);
    executeNavigation(
      { kind: "reload", destination: "/fr/about", locale: "fr" },
      {
        config: { cookie: { persist: false } } as any,
        currentLocale: "en",
        setLocale,
      },
      e,
    );
    expect(e.preventDefault).toHaveBeenCalled();
    expect(setLocaleCookie).not.toHaveBeenCalled();
    expect(setLocale).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe("/fr/about");
  });

  // --------------------------------------------------
  // Client-side navigation
  // --------------------------------------------------
  it("syncs locale and cookie on client navigation", () => {
    (shouldSyncLocale as any).mockReturnValue(true);
    executeNavigation(
      { kind: "client", destination: "/fr/about", locale: "fr" },
      { config: baseConfig, currentLocale: "en", setLocale },
    );
    expect(setLocaleCookie).toHaveBeenCalledWith(baseConfig.cookie, "fr");
    expect(setLocale).toHaveBeenCalledWith("fr");
    expect(globalThis.location.href).toBe("");
  });

  it("does nothing on client navigation if locale does not change", () => {
    (shouldSyncLocale as any).mockReturnValue(false);
    executeNavigation(
      { kind: "client", destination: "/en/about", locale: "en" },
      { config: baseConfig, currentLocale: "en", setLocale },
    );
    expect(setLocaleCookie).not.toHaveBeenCalled();
    expect(setLocale).not.toHaveBeenCalled();
  });

  it("does not persist cookie when cookie.persist is false", () => {
    (shouldSyncLocale as any).mockReturnValue(true);
    executeNavigation(
      { kind: "client", destination: "/fr/about", locale: "fr" },
      {
        config: { cookie: { persist: false } } as any,
        currentLocale: "en",
        setLocale,
      },
    );
    expect(setLocaleCookie).not.toHaveBeenCalled();
    expect(setLocale).toHaveBeenCalledWith("fr");
  });
});
