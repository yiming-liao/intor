import type { CookieResolvedOptions } from "@/modules/config/types/cookie.types";
import type { RoutingResolvedOptions } from "@/modules/config/types/routing.types";
import { describe, it, expect, beforeEach } from "vitest";
import { defineIntorConfig } from "@/modules/config";
import { resolveCookieOptions } from "@/modules/config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/modules/config/resolvers/resolve-fallback-locales";
import { resolveRoutingOptions } from "@/modules/config/resolvers/resolve-routing-options";
import { validateDefaultLocale } from "@/modules/config/validators/validate-default-locale";
import { validateSupportedLocales } from "@/modules/config/validators/validate-supported-locales";

vi.mock("@/modules/config/resolvers/resolve-cookie-options");
vi.mock("@/modules/config/resolvers/resolve-fallback-locales");
vi.mock("@/modules/config/resolvers/resolve-routing-options");
vi.mock("@/modules/config/validators/validate-default-locale");
vi.mock("@/modules/config/validators/validate-supported-locales");

describe("defineIntorConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(validateSupportedLocales).mockReturnValue(["en", "zh"]);
    vi.mocked(validateDefaultLocale).mockReturnValue("en");
    vi.mocked(resolveFallbackLocales).mockReturnValue({
      en: ["zh"],
    });
    vi.mocked(resolveCookieOptions).mockReturnValue({
      some: "cookie",
    } as unknown as CookieResolvedOptions);
    vi.mocked(resolveRoutingOptions).mockReturnValue({
      some: "routing",
    } as unknown as RoutingResolvedOptions);
  });

  it("should resolve all config fields correctly", () => {
    const result = defineIntorConfig({
      messages: {},
      supportedLocales: ["en", "zh"],
      defaultLocale: "en",
      translator: { loadingMessage: "Loading...", placeholder: "MISSING" },
    });

    expect(result).toMatchObject({
      id: expect.stringMatching(/^ID[a-z0-9]{4}$/),
      messages: {},
      defaultLocale: "en",
      supportedLocales: ["en", "zh"],
      fallbackLocales: { en: ["zh"] },
      translator: { loadingMessage: "Loading...", placeholder: "MISSING" },
      cookie: { some: "cookie" },
      routing: { some: "routing" },
    });

    expect(resolveCookieOptions).toHaveBeenCalled();
    expect(resolveRoutingOptions).toHaveBeenCalled();
    expect(resolveFallbackLocales).toHaveBeenCalled();
  });

  it("should use provided id if given", () => {
    const result = defineIntorConfig({
      id: "CUSTOM_ID",
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.id).toBe("CUSTOM_ID");
  });

  it("should initialize logger with custom log level", () => {
    defineIntorConfig({
      logger: { level: "info" },
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });
  });

  it("should handle undefined optional fields (messages, loaderOptions)", () => {
    const result = defineIntorConfig({
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.messages).toBeUndefined();
    expect(result.loader).toBeUndefined();
  });

  it("should throw if validateSupportedLocales fails", () => {
    vi.mocked(validateSupportedLocales).mockImplementation(() => {
      throw new Error("Invalid supported locales");
    });

    expect(() =>
      defineIntorConfig({
        messages: {},
        supportedLocales: ["xx"],
        defaultLocale: "en",
      }),
    ).toThrow("Invalid supported locales");
  });

  it("should preserve messages as-is", () => {
    const messages = {
      en: { greeting: "Hello" },
      zh: { greeting: "你好" },
    };

    const result = defineIntorConfig({
      messages,
      supportedLocales: ["en", "zh"],
      defaultLocale: "en",
    });

    expect(result.messages).toEqual(messages);
  });
});
