/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIntorHandler } from "../../../../src/adapters/next/create-intor-handler";
import { INTOR_HEADERS } from "../../../../src/core";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
} from "../../../../src/routing";

vi.mock("../../../../src/routing", () => ({
  resolveInbound: vi.fn(),
  getLocaleFromAcceptLanguage: vi.fn(),
}));

describe("createIntorHandler (Next.js)", () => {
  const config = {
    supportedLocales: ["en", "fr"],
    defaultLocale: "en",
    cookie: { name: "locale" },
  } as any;

  let request: Partial<NextRequest> & Record<string, any>;

  function createMockRequest(
    pathname = "/",
    search: Record<string, string> = {},
  ): any {
    const url = new URL(`https://example.com${pathname}`);
    Object.entries(search).forEach(([k, v]) => url.searchParams.set(k, v));
    return {
      nextUrl: {
        host: "example.com",
        pathname: url.pathname,
        search: url.search,
        searchParams: url.searchParams,
        clone: () => new URL(url.toString()),
      },
      headers: {
        get: vi.fn(() => undefined),
      },
      cookies: {
        get: vi.fn(() => undefined),
      },
    };
  }

  beforeEach(() => {
    request = createMockRequest("/");
    vi.clearAllMocks();
  });

  it("forwards correct pathname and query to resolveInbound", () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    handler(request as NextRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.objectContaining({
        host: "example.com",
        query: {},
        detected: "en",
      }),
      expect.objectContaining({
        hasRedirected: false,
      }),
    );
  });

  it("returns redirect response when shouldRedirect is true", () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/fr",
      shouldRedirect: true,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    expect(response.status).toBe(307);
    expect(response.headers.get(INTOR_HEADERS.REDIRECTED)).toBe("1");
  });

  it("returns next response when shouldRedirect is false", () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    expect(response.status).toBe(200);
  });

  it("attaches routing metadata headers", () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("fr");
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "cookie",
      pathname: "/fr",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    expect(response.headers.get(INTOR_HEADERS.LOCALE)).toBe("fr");
    expect(response.headers.get(INTOR_HEADERS.LOCALE_SOURCE)).toBe("cookie");
    expect(response.headers.get(INTOR_HEADERS.PATHNAME)).toBe("/fr");
  });

  it("passes hasRedirected=true when header is set", () => {
    (request.headers as any).get = vi.fn((key: string) =>
      key === INTOR_HEADERS.REDIRECTED ? "1" : undefined,
    );
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    handler(request as NextRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.any(Object),
      expect.objectContaining({
        hasRedirected: true,
      }),
    );
  });

  it("forwards cookie when present", () => {
    (request.cookies as any).get = vi.fn(() => ({ value: "fr" }));
    (getLocaleFromAcceptLanguage as any).mockReturnValue(undefined);
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "cookie",
      pathname: "/fr",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    handler(request as NextRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.objectContaining({
        cookie: "fr",
      }),
      expect.any(Object),
    );
  });

  it("does not pass detected when accept-language is undefined", () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue(undefined);
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    handler(request as NextRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.not.objectContaining({
        detected: expect.anything(),
      }),
      expect.any(Object),
    );
  });

  it("attaches search header", () => {
    request = createMockRequest("/", { page: "2" });
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    expect(response.headers.get(INTOR_HEADERS.SEARCH)).toBe("?page=2");
  });

  it("preserves search params on redirect", () => {
    request = createMockRequest("/", { page: "2" });
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/fr",
      shouldRedirect: true,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    const location = response.headers.get("location");
    expect(location).toContain("/fr?page=2");
  });

  it("attaches empty search when no query", () => {
    request = createMockRequest("/");
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    expect(response.headers.get(INTOR_HEADERS.SEARCH)).toBe("");
  });

  it("redirect without query does not append ?", () => {
    request = createMockRequest("/");
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/fr",
      shouldRedirect: true,
    });
    const handler = createIntorHandler(config);
    const response = handler(request as NextRequest);
    const location = response.headers.get("location");
    expect(location).toBe("https://example.com/fr");
  });
});
