/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { intorProxy } from "@/adapters/next/proxy/intor-proxy";
import { setLocaleCookieEdge } from "@/adapters/next/proxy/utils/set-locale-cookie-edge";
import { resolveRouting } from "@/routing/resolve-routing";

vi.mock("@/routing/resolve-routing", () => ({
  resolveRouting: vi.fn(),
}));
vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({
      headers: new Map([["location", url.pathname]]),
    })),
    next: vi.fn(() => ({ headers: new Map() })),
  },
}));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Map([["accept-language", "en-US"]])),
}));
vi.mock("@/adapters/next/proxy/utils/set-locale-cookie-edge", () => ({
  setLocaleCookieEdge: vi.fn(),
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

describe("intorProxy", () => {
  const config = {
    defaultLocale: "en",
    cookie: { name: "locale" },
    routing: {
      firstVisit: { persist: true },
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

  it("persists locale on first visit when source is detected", async () => {
    (resolveRouting as any).mockReturnValue({
      locale: "en",
      localeSource: "detected",
      pathname: "/",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/");
    await intorProxy(config, request);
    expect(setLocaleCookieEdge).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" }),
    );
  });

  it("persists locale when source is not detected", async () => {
    (resolveRouting as any).mockReturnValue({
      locale: "en",
      localeSource: "cookie",
      pathname: "/",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/");
    await intorProxy(config, request);
    expect(setLocaleCookieEdge).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" }),
    );
  });
});
