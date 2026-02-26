/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIntorHandler } from "../../../../src/adapters/next/create-intor-handler";
import { INTOR_HEADERS } from "../../../../src/core";
import { resolveInbound } from "../../../../src/routing/inbound/resolve-inbound";

const mockRedirect = vi.fn();
const mockNext = vi.fn();

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url) => {
      const headers = new Headers();
      headers.set("location", url.pathname);
      mockRedirect(url.pathname);
      return { headers };
    }),
    next: vi.fn(() => {
      const headers = new Headers();
      mockNext();
      return { headers };
    }),
  },
}));

vi.mock("../../../../src/routing/inbound/resolve-inbound", () => ({
  resolveInbound: vi.fn(),
}));

function createRequest(
  url: string,
  headers?: Record<string, string>,
): NextRequest {
  const parsed = new URL(url);
  return {
    headers: new Headers(headers),
    nextUrl: {
      pathname: parsed.pathname,
      host: parsed.host,
      searchParams: parsed.searchParams,
      clone() {
        return { ...this };
      },
    },
    cookies: { get: vi.fn() },
  } as unknown as NextRequest;
}

describe("intorProxy (Next.js adapter)", () => {
  const config = { defaultLocale: "en", cookie: { name: "locale" } } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects when routing core requests a redirect", async () => {
    (resolveInbound as any).mockReturnValue({
      locale: "zh-TW",
      localeSource: "cookie",
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
    const handler = createIntorHandler(config);
    const request = createRequest("https://example.com/about");
    const response = await handler(request);
    expect(resolveInbound).toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("/zh-TW/about");
    expect(response.headers.get("x-intor-redirected")).toBe("1");
  });

  it("passes through when no redirect is required", async () => {
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "cookie",
      pathname: "/about",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const request = createRequest("https://example.com/about");
    const response = await handler(request);
    expect(resolveInbound).toHaveBeenCalled();
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-intor-redirected")).toBeNull();
  });

  it("exposes resolved routing metadata via response headers", async () => {
    (resolveInbound as any).mockReturnValue({
      locale: "zh-TW",
      localeSource: "path",
      pathname: "/zh-TW/about",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const request = createRequest("https://example.com/zh-TW/about");
    const response = await handler(request);
    expect(response.headers.get(INTOR_HEADERS.LOCALE)).toBe("zh-TW");
    expect(response.headers.get(INTOR_HEADERS.LOCALE_SOURCE)).toBe("path");
    expect(response.headers.get(INTOR_HEADERS.PATHNAME)).toBe("/zh-TW/about");
  });

  it("never mutates cookies", async () => {
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "detected",
      pathname: "/",
      shouldRedirect: false,
    });
    const handler = createIntorHandler(config);
    const request = createRequest("https://example.com/");
    handler(request);
    expect(request.cookies.get).toHaveBeenCalled();
  });
});
