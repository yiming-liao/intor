/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveInbound } from "../../../../src/routing/inbound/resolve-inbound";
import { resolveLocale } from "../../../../src/routing/inbound/resolve-locale";
import { resolvePathname } from "../../../../src/routing/inbound/resolve-path";

vi.mock("../../../../src/routing/inbound/resolve-locale", () => ({
  resolveLocale: vi.fn(),
}));

vi.mock("../../../../src/routing/inbound/resolve-path", () => ({
  resolvePathname: vi.fn(),
}));

describe("resolveInbound", () => {
  const config = {
    defaultLocale: "en",
    supportedLocales: ["en"],
    routing: {
      inbound: {
        firstVisit: { redirect: true },
      },
    },
  } as unknown as IntorResolvedConfig;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves locale and path as a single inbound decision", async () => {
    (resolveLocale as any).mockReturnValue({
      locale: "zh-TW",
      localeSource: "path",
    });
    (resolvePathname as any).mockReturnValue({
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
    const result = await resolveInbound(
      config,
      "/about",
      {
        host: "zh-TW.example.com",
        query: {},
        cookie: undefined,
        detected: "en",
      },
      { hasRedirected: false }, // hasRedirected
    );
    expect(resolveLocale).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        host: { locale: "zh-TW" },
        detected: { locale: "en" },
      }),
    );
    expect(resolvePathname).toHaveBeenCalledWith(
      config,
      "/about",
      expect.objectContaining({
        locale: "zh-TW",
        hasPathLocale: false,
        hasPersisted: false,
        hasRedirected: false,
      }),
    );
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "path",
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
  });

  it("passes through when no redirect is required", async () => {
    (resolveLocale as any).mockReturnValue({
      locale: "en",
      localeSource: "cookie",
    });
    (resolvePathname as any).mockReturnValue({
      pathname: "/about",
      shouldRedirect: false,
    });
    const result = await resolveInbound(
      config,
      "/about",
      {
        cookie: "en",
        detected: "en",
      },
      { hasRedirected: false },
    );
    expect(resolvePathname).toHaveBeenCalledWith(
      config,
      "/about",
      expect.objectContaining({ locale: "en", hasPersisted: true }),
    );
    expect(result.shouldRedirect).toBe(false);
    expect(result.pathname).toBe("/about");
  });
});
