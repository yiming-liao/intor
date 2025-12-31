/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { intorProxy } from "@/adapters/next/proxy/intor-proxy";
import { resolveRouting } from "@/routing/resolve-routing";

const mockCookiesSet = vi.fn();

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({
      headers: new Map([["location", url.pathname]]),
      cookies: { set: mockCookiesSet },
    })),
    next: vi.fn(() => ({
      headers: new Map(),
      cookies: { set: mockCookiesSet },
    })),
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Map([["accept-language", "en-US"]])),
}));

vi.mock("@/routing/resolve-routing", () => ({
  resolveRouting: vi.fn(),
}));

function createRequest(url: string): NextRequest {
  const parsed = new URL(url);

  return {
    nextUrl: {
      pathname: parsed.pathname,
      host: parsed.host,
      searchParams: parsed.searchParams,
      clone() {
        return { ...this };
      },
    },
    cookies: {
      get: vi.fn(),
    },
  } as unknown as NextRequest;
}

describe("intorProxy (Next.js adapter)", () => {
  const config = {
    defaultLocale: "en",
    cookie: {
      enabled: true,
      persist: true,
      name: "locale",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      secure: false,
      httpOnly: false,
      sameSite: "lax",
    },
    routing: {
      firstVisit: {
        persist: true,
      },
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects when routing core requests a redirect", async () => {
    (resolveRouting as any).mockReturnValue({
      locale: "zh-TW",
      localeSource: "path",
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
    const request = createRequest("https://example.com/about");
    const response = await intorProxy(config, request);
    expect(resolveRouting).toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("/zh-TW/about");
  });

  it("persists locale on first visit when persistence is allowed", async () => {
    (resolveRouting as any).mockReturnValue({
      locale: "en",
      localeSource: "detected",
      pathname: "/",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/");
    await intorProxy(config, request);
    expect(mockCookiesSet).toHaveBeenCalledWith(
      "locale",
      "en",
      expect.any(Object),
    );
  });

  it("persists locale when source is not detected (return visit)", async () => {
    (resolveRouting as any).mockReturnValue({
      locale: "en",
      localeSource: "cookie",
      pathname: "/",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/");
    await intorProxy(config, request);
    expect(mockCookiesSet).toHaveBeenCalledWith(
      "locale",
      "en",
      expect.any(Object),
    );
  });

  it("does not persist locale on first visit when persistence is disabled", async () => {
    const configNoPersist = {
      ...config,
      routing: {
        firstVisit: {
          persist: false,
        },
      },
    };
    (resolveRouting as any).mockReturnValue({
      locale: "en",
      localeSource: "detected",
      pathname: "/",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/");
    await intorProxy(configNoPersist, request);
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });
});
