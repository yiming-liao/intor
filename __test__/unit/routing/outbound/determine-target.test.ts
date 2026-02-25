/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect, vi } from "vitest";
import { determineTarget } from "../../../../src/routing/outbound/determine-target";

vi.mock("../../../../src/routing/pathname/localize-pathname", () => ({
  localizePathname: (pathname: string, _config: any, locale: string) => ({
    pathname: `/${locale}${pathname}`,
  }),
}));

vi.mock(
  "../../../../src/routing/outbound/utils/derive-host-destination",
  () => ({
    deriveHostDestination: (pathname: string, _config: any, locale: string) =>
      `https://${locale}.example.com${pathname}`,
  }),
);

vi.mock(
  "../../../../src/routing/outbound/utils/derive-query-destination",
  () => ({
    deriveQueryDestination: (pathname: string, _config: any, locale: string) =>
      `${pathname}?lang=${locale}`,
  }),
);

vi.mock("../../../../src/core", async () => {
  const actual = await vi.importActual<any>("../../../../src/core");
  return {
    ...actual,
    isExternalDestination: (destination: string) =>
      destination.startsWith("http"),
  };
});

const createConfig = (
  localeCarrier: "path" | "host" | "query",
): IntorResolvedConfig =>
  ({
    supportedLocales: ["en-US", "zh-TW"],
    routing: { outbound: { localeCarrier } },
  }) as unknown as IntorResolvedConfig;

describe("deriveTarget", () => {
  it("uses locale override when provided", () => {
    const config = createConfig("path");
    const result = determineTarget(config, "en-US", "/about", {
      locale: "zh-TW",
    });
    expect(result.locale).toBe("zh-TW");
    expect(result.destination).toBe("/zh-TW/about");
    expect(result.isExternal).toBe(false);
  });

  it("falls back to current locale when override is invalid", () => {
    const config = createConfig("path");
    const result = determineTarget(config, "en-US", "/about", {
      locale: "ja-JP",
    });
    expect(result.locale).toBe("en-US");
    expect(result.destination).toBe("/en-US/about");
  });

  it("marks external destination and skips projection", () => {
    const config = createConfig("path");
    const result = determineTarget(config, "en-US", "/about", {
      destination: "https://google.com",
    });
    expect(result.isExternal).toBe(true);
    expect(result.destination).toBe("https://google.com");
  });

  it("projects destination using path carrier", () => {
    const config = createConfig("path");
    const result = determineTarget(config, "en-US", "/docs");
    expect(result.destination).toBe("/en-US/docs");
  });

  it("projects destination using host carrier", () => {
    const config = createConfig("host");
    const result = determineTarget(config, "zh-TW", "/docs");
    expect(result.destination).toBe("https://zh-TW.example.com/docs");
  });

  it("projects destination using query carrier", () => {
    const config = createConfig("query");
    const result = determineTarget(config, "en-US", "/docs");
    expect(result.destination).toBe("/docs?lang=en-US");
  });
});
