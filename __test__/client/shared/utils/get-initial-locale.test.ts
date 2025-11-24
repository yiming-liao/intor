/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect, afterEach, vi } from "vitest";
import { getInitialLocale } from "@/client/shared/utils/get-initial-locale";

const mockConfig = {
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW", "fr-FR"],
  cookie: { name: "intor.i18n.locale" },
} as unknown as IntorResolvedConfig;

describe("getInitialLocale", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should use cookie if present and valid", () => {
    vi.stubGlobal("document", {
      cookie: "intor.i18n.locale=fr-FR",
    } as any);
    vi.stubGlobal("navigator", { languages: ["zh-TW"], language: "zh-TW" });

    const locale = getInitialLocale(mockConfig);
    expect(locale).toBe("fr-FR");
  });

  it("should fallback to browser language if cookie not present", () => {
    vi.stubGlobal("document", { cookie: "" } as any);
    vi.stubGlobal("navigator", { languages: ["zh-TW"], language: "zh-TW" });

    const locale = getInitialLocale(mockConfig);
    expect(locale).toBe("zh-TW");
  });

  it("should fallback to defaultLocale if cookie/browser language not supported", () => {
    vi.stubGlobal("document", { cookie: "intor.i18n.locale=de-DE" } as any);
    vi.stubGlobal("navigator", { languages: ["de-DE"], language: "de-DE" });

    const locale = getInitialLocale(mockConfig);
    expect(locale).toBe("en-US");
  });

  it("should normalize casing for cookie/browser language", () => {
    vi.stubGlobal("document", { cookie: "intor.i18n.locale=FR-fr" } as any);
    vi.stubGlobal("navigator", { languages: ["ZH-tw"], language: "ZH-tw" });

    const locale = getInitialLocale(mockConfig);
    expect(locale).toBe("fr-FR");
  });

  it("should use defaultLocale if nothing matches", () => {
    vi.stubGlobal("document", { cookie: "" } as any);
    vi.stubGlobal("navigator", { languages: [], language: "" });

    const locale = getInitialLocale(mockConfig);
    expect(locale).toBe("en-US");
  });
});
