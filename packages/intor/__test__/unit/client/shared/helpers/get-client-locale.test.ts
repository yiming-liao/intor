/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../../src/config";
import { describe, it, expect, afterEach, vi } from "vitest";
import { getClientLocale } from "../../../../../src/client/shared/helpers/get-client-locale";

const mockConfig = {
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW", "fr-FR"],
  cookie: { name: "intor.locale" },
} as unknown as IntorResolvedConfig;

// @ts-expect-error globalThis
const deleteGlobal = (name: string) => delete globalThis[name];

describe("getClientLocale", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should use cookie if present and valid", () => {
    vi.stubGlobal("document", {
      cookie: "intor.locale=fr-FR",
    } as any);
    vi.stubGlobal("navigator", { languages: ["zh-TW"], language: "zh-TW" });
    const locale = getClientLocale(mockConfig);
    expect(locale).toBe("fr-FR");
  });

  it("should fallback to browser language if cookie not present", () => {
    vi.stubGlobal("document", { cookie: "" } as any);
    vi.stubGlobal("navigator", { languages: ["zh-TW"], language: "zh-TW" });
    const locale = getClientLocale(mockConfig);
    expect(locale).toBe("zh-TW");
  });

  it("should fallback to defaultLocale if cookie/browser language not supported", () => {
    vi.stubGlobal("document", { cookie: "intor.locale=de-DE" } as any);
    vi.stubGlobal("navigator", { languages: ["de-DE"], language: "de-DE" });
    const locale = getClientLocale(mockConfig);
    expect(locale).toBe("en-US");
  });

  it("should normalize casing for cookie/browser language", () => {
    vi.stubGlobal("document", { cookie: "intor.locale=FR-fr" } as any);
    vi.stubGlobal("navigator", { languages: ["ZH-tw"], language: "ZH-tw" });
    const locale = getClientLocale(mockConfig);
    expect(locale).toBe("fr-FR");
  });

  it("should use defaultLocale if nothing matches", () => {
    vi.stubGlobal("document", { cookie: "" } as any);
    vi.stubGlobal("navigator", { languages: [], language: "" });
    const locale = getClientLocale(mockConfig);
    expect(locale).toBe("en-US");
  });

  it("should fallback to defaultLocale when both document and navigator are undefined", () => {
    deleteGlobal("document");
    deleteGlobal("navigator");
    const locale = getClientLocale(mockConfig);
    expect(locale).toBe("en-US");
  });
});
