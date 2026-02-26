/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "../../../../../src/core";
import { resolveInboundFromRequest } from "../../../../../src/routing";
import * as inboundModule from "../../../../../src/routing/inbound/resolve-inbound";
import * as localeModule from "../../../../../src/routing/locale";

describe("resolveInboundFromRequest()", () => {
  const baseConfig = {
    supportedLocales: ["en", "zh"],
    defaultLocale: "en",
    cookie: { name: "lang" },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves full request with cookie and accept-language", () => {
    vi.spyOn(coreModule, "parseCookieHeader").mockReturnValue({
      lang: "zh",
    });
    vi.spyOn(coreModule, "normalizeQuery").mockReturnValue({
      foo: "bar",
    });
    vi.spyOn(localeModule, "getLocaleFromAcceptLanguage").mockReturnValue("zh");
    const inboundSpy = vi
      .spyOn(inboundModule, "resolveInbound")
      .mockReturnValue({
        locale: "zh",
        localeSource: "cookie",
        pathname: "/zh",
        shouldRedirect: false,
      } as any);
    const request = new Request("https://example.com/docs?foo=bar", {
      headers: {
        cookie: "lang=zh",
        "accept-language": "zh,en;q=0.9",
      },
    });
    const result = resolveInboundFromRequest(baseConfig, request);
    expect(coreModule.parseCookieHeader).toHaveBeenCalledWith("lang=zh");
    expect(coreModule.normalizeQuery).toHaveBeenCalledWith({
      foo: "bar",
    });
    expect(localeModule.getLocaleFromAcceptLanguage).toHaveBeenCalledWith(
      "zh,en;q=0.9",
      baseConfig.supportedLocales,
    );
    expect(inboundSpy).toHaveBeenCalledWith(
      baseConfig,
      "/docs",
      expect.objectContaining({
        host: "example.com",
        query: { foo: "bar" },
        cookie: "zh",
        detected: "zh",
      }),
    );
    expect(result.locale).toBe("zh");
  });

  it("falls back to defaultLocale when accept-language is missing", () => {
    vi.spyOn(coreModule, "parseCookieHeader").mockReturnValue({});
    vi.spyOn(coreModule, "normalizeQuery").mockReturnValue({});
    vi.spyOn(localeModule, "getLocaleFromAcceptLanguage").mockReturnValue(
      undefined,
    );
    const inboundSpy = vi
      .spyOn(inboundModule, "resolveInbound")
      .mockReturnValue({} as any);
    const request = new Request("https://example.com/docs");
    resolveInboundFromRequest(baseConfig, request);
    expect(localeModule.getLocaleFromAcceptLanguage).toHaveBeenCalledWith(
      undefined,
      baseConfig.supportedLocales,
    );
    expect(inboundSpy).toHaveBeenCalledWith(
      baseConfig,
      "/docs",
      expect.objectContaining({
        detected: "en",
      }),
    );
  });

  it("omits cookie when not present", () => {
    vi.spyOn(coreModule, "parseCookieHeader").mockReturnValue({});
    vi.spyOn(coreModule, "normalizeQuery").mockReturnValue({});
    vi.spyOn(localeModule, "getLocaleFromAcceptLanguage").mockReturnValue("en");
    const inboundSpy = vi
      .spyOn(inboundModule, "resolveInbound")
      .mockReturnValue({} as any);
    const request = new Request("https://example.com");
    resolveInboundFromRequest(baseConfig, request);
    const args = inboundSpy.mock.calls[0]![2];
    expect(args).not.toHaveProperty("cookie");
  });

  it("handles missing cookie header safely", () => {
    const parseSpy = vi.spyOn(coreModule, "parseCookieHeader");
    vi.spyOn(coreModule, "normalizeQuery").mockReturnValue({});
    vi.spyOn(localeModule, "getLocaleFromAcceptLanguage").mockReturnValue("en");
    vi.spyOn(inboundModule, "resolveInbound").mockReturnValue({} as any);
    const request = new Request("https://example.com");
    resolveInboundFromRequest(baseConfig, request);
    expect(parseSpy).toHaveBeenCalledWith(undefined);
  });
});
