/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { intorProxy } from "@/adapters/next/proxy/intor-proxy";
import { resolveInbound } from "@/routing/inbound/resolve-inbound";

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

vi.mock("@/routing/inbound/resolve-inbound", () => ({
  resolveInbound: vi.fn(),
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
      name: "locale",
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects when routing core requests a redirect", async () => {
    (resolveInbound as any).mockReturnValue({
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
    const request = createRequest("https://example.com/about");
    const response = await intorProxy(config, request);
    expect(resolveInbound).toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("/zh-TW/about");
  });

  it("passes through when no redirect is required", async () => {
    (resolveInbound as any).mockReturnValue({
      pathname: "/about",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/about");
    await intorProxy(config, request);
    expect(resolveInbound).toHaveBeenCalled();
  });

  it("never sets cookies", async () => {
    (resolveInbound as any).mockReturnValue({
      pathname: "/",
      shouldRedirect: false,
    });
    const request = createRequest("https://example.com/");
    await intorProxy(config, request);
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });
});
