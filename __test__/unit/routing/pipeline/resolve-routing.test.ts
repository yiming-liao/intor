/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveLocale } from "@/routing/pipeline/resolve-locale";
import { resolvePathname } from "@/routing/pipeline/resolve-pathname";
import { resolveRouting } from "@/routing/pipeline/resolve-routing";

vi.mock("@/routing/pipeline/resolve-locale", () => ({
  resolveLocale: vi.fn(),
}));

vi.mock("@/routing/pipeline/resolve-pathname", () => ({
  resolvePathname: vi.fn(),
}));

describe("resolveRouting", () => {
  const config = {
    supportedLocales: ["en", "zh-TW"],
    defaultLocale: "en",
    routing: { locale: { queryKey: "locale" } },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves locale and pathname as a single routing decision", () => {
    (resolveLocale as any).mockReturnValue({
      locale: "zh-TW",
      localeSource: "path",
    });
    (resolvePathname as any).mockReturnValue({
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
    const result = resolveRouting(config, "/about", {
      host: "zh-TW.example.com",
      query: {},
      cookie: undefined,
      detected: "en",
    });
    expect(resolveLocale).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        detected: { locale: "en" },
      }),
    );
    expect(resolvePathname).toHaveBeenCalledWith(
      config,
      "/about",
      expect.objectContaining({
        locale: "zh-TW",
        localeSource: "path",
      }),
    );
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "path",
      pathname: "/zh-TW/about",
      shouldRedirect: true,
    });
  });

  it("passes through when no redirect is required", () => {
    (resolveLocale as any).mockReturnValue({
      locale: "en",
      localeSource: "cookie",
    });
    (resolvePathname as any).mockReturnValue({
      pathname: "/about",
      shouldRedirect: false,
    });
    const result = resolveRouting(config, "/about", {
      detected: "en",
    });
    expect(result.shouldRedirect).toBe(false);
    expect(result.pathname).toBe("/about");
  });
});
