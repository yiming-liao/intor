/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveInbound } from "../../../../src/routing/inbound/resolve-inbound";
import * as resolveLocaleModule from "../../../../src/routing/inbound/resolve-locale";
import * as resolvePathModule from "../../../../src/routing/inbound/resolve-pathname";
import * as localeModule from "../../../../src/routing/locale";

describe("resolveInbound()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseConfig = {
    routing: {
      inbound: {
        queryKey: "lang",
      },
    },
  } as any;

  it("resolves full inbound state when all sources present", () => {
    vi.spyOn(localeModule, "getLocaleFromPathname").mockReturnValue("en");
    vi.spyOn(localeModule, "getLocaleFromHost").mockReturnValue("fr");
    vi.spyOn(localeModule, "getLocaleFromQuery").mockReturnValue("de");
    vi.spyOn(resolveLocaleModule, "resolveLocale").mockReturnValue({
      locale: "fr",
      localeSource: "host",
    } as any);
    vi.spyOn(resolvePathModule, "resolvePathname").mockReturnValue({
      pathname: "/fr/home",
      shouldRedirect: true,
    });
    const result = resolveInbound(
      baseConfig,
      "/en/home",
      {
        host: "fr.example.com",
        query: { lang: "de" },
        cookie: "it",
        detected: "es",
      },
      { hasRedirected: false },
    );
    expect(resolveLocaleModule.resolveLocale).toHaveBeenCalledWith(
      baseConfig,
      expect.objectContaining({
        path: { locale: "en" },
        host: { locale: "fr" },
        query: { locale: "de" },
        cookie: { locale: "it" },
        detected: { locale: "es" },
      }),
    );
    expect(resolvePathModule.resolvePathname).toHaveBeenCalledWith(
      baseConfig,
      "/en/home",
      {
        locale: "fr",
        hasPathLocale: true,
        hasPersisted: true,
        hasRedirected: false,
      },
    );
    expect(result).toEqual({
      locale: "fr",
      localeSource: "host",
      pathname: "/fr/home",
      shouldRedirect: true,
    });
  });

  it("omits undefined locale sources", () => {
    vi.spyOn(localeModule, "getLocaleFromPathname").mockReturnValue(undefined);
    vi.spyOn(localeModule, "getLocaleFromHost").mockReturnValue(undefined);
    vi.spyOn(localeModule, "getLocaleFromQuery").mockReturnValue(undefined);
    vi.spyOn(resolveLocaleModule, "resolveLocale").mockReturnValue({
      locale: "en",
      localeSource: "detected",
    } as any);
    vi.spyOn(resolvePathModule, "resolvePathname").mockReturnValue({
      pathname: "/en",
      shouldRedirect: false,
    });
    resolveInbound(baseConfig, "/home", {
      detected: "en",
    });
    const callArgs = (resolveLocaleModule.resolveLocale as any).mock
      .calls[0][1];
    expect(callArgs).not.toHaveProperty("path");
    expect(callArgs).not.toHaveProperty("host");
    expect(callArgs).not.toHaveProperty("query");
    expect(callArgs).not.toHaveProperty("cookie");
    expect(callArgs).toHaveProperty("detected");
  });

  it("handles missing options safely", () => {
    vi.spyOn(localeModule, "getLocaleFromPathname").mockReturnValue("en");
    vi.spyOn(localeModule, "getLocaleFromHost").mockReturnValue(undefined);
    vi.spyOn(localeModule, "getLocaleFromQuery").mockReturnValue(undefined);
    vi.spyOn(resolveLocaleModule, "resolveLocale").mockReturnValue({
      locale: "en",
      localeSource: "path",
    } as any);
    vi.spyOn(resolvePathModule, "resolvePathname").mockReturnValue({
      pathname: "/en",
      shouldRedirect: false,
    });
    resolveInbound(baseConfig, "/en", {
      detected: "en",
    });
    expect(resolvePathModule.resolvePathname).toHaveBeenCalledWith(
      baseConfig,
      "/en",
      expect.objectContaining({
        hasRedirected: false,
      }),
    );
  });
});
