/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { localizePathname } from "@/core/utils";
import { resolveNavigationTarget } from "@/routing/resolve-navigation-target";

vi.mock("@/core/utils", () => ({
  localizePathname: vi.fn(),
}));

const mockConfig: IntorResolvedConfig = {
  supportedLocales: ["en-US", "zh-TW"],
} as any;

describe("resolveNavigationTarget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses current locale when no locale is provided", () => {
    vi.mocked(localizePathname).mockReturnValue({
      localizedPathname: "/en-US/about",
    } as any);
    const result = resolveNavigationTarget(mockConfig, "en-US", "/about", {});
    expect(result).toEqual({
      locale: "en-US",
      destination: "/en-US/about",
      isExternal: false,
    });
    expect(localizePathname).toHaveBeenCalledWith(
      mockConfig,
      "/about",
      "en-US",
    );
  });

  it("uses input locale when it is supported", () => {
    vi.mocked(localizePathname).mockReturnValue({
      localizedPathname: "/zh-TW/about",
    } as any);
    const result = resolveNavigationTarget(mockConfig, "en-US", "/about", {
      locale: "zh-TW",
    });
    expect(result.locale).toBe("zh-TW");
    expect(result.destination).toBe("/zh-TW/about");
  });

  it("falls back to current locale when input locale is not supported", () => {
    vi.mocked(localizePathname).mockReturnValue({
      localizedPathname: "/en-US/about",
    } as any);
    const result = resolveNavigationTarget(mockConfig, "en-US", "/about", {
      locale: "ja-JP" as any,
    });
    expect(result.locale).toBe("en-US");
    expect(result.destination).toBe("/en-US/about");
  });

  it("uses input destination when provided", () => {
    vi.mocked(localizePathname).mockReturnValue({
      localizedPathname: "/en-US/contact",
    } as any);
    const result = resolveNavigationTarget(mockConfig, "en-US", "/about", {
      destination: "/contact",
    });
    expect(result.destination).toBe("/en-US/contact");
    expect(localizePathname).toHaveBeenCalledWith(
      mockConfig,
      "/contact",
      "en-US",
    );
  });

  it("treats external destination as external and skips localization", () => {
    const result = resolveNavigationTarget(mockConfig, "en-US", "/about", {
      destination: "https://example.com",
    });
    expect(result).toEqual({
      locale: "en-US",
      destination: "https://example.com",
      isExternal: true,
    });
    expect(localizePathname).not.toHaveBeenCalled();
  });

  it("treats mailto destination as external", () => {
    const result = resolveNavigationTarget(mockConfig, "en-US", "/about", {
      destination: "mailto:test@example.com",
    });
    expect(result.isExternal).toBe(true);
    expect(result.destination).toBe("mailto:test@example.com");
  });
});
