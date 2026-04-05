/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "intor";
import { describe, it, expect } from "vitest";
import { mergeMessagesByLayer } from "../../../../src/core/collect-messages/merge-messages-by-layer";

const createConfig = (
  overrides: Partial<IntorResolvedConfig> = {},
): IntorResolvedConfig =>
  ({
    id: "test",
    defaultLocale: "en",
    supportedLocales: ["en"],
    messages: { en: {} },
    ...overrides,
  }) as IntorResolvedConfig;

describe("mergeMessagesByLayer", () => {
  it("returns merged messages when base and incoming are both defined", () => {
    const config = createConfig();
    const overrides: any[] = [];
    const result = mergeMessagesByLayer(
      "runtimeOverStatic",
      { en: { a: "1" } } as any,
      { en: { b: "2" } } as any,
      { config, locale: "en", overrides },
    );
    expect(result).toEqual({
      en: { a: "1", b: "2" },
    });
  });

  it("returns incoming when base is undefined", () => {
    const config = createConfig();
    const overrides: any[] = [];
    const result = mergeMessagesByLayer(
      "runtimeOverStatic",
      undefined,
      { en: { b: "2" } } as any,
      { config, locale: "en", overrides },
    );
    expect(result).toEqual({
      en: { b: "2" },
    });
  });

  it("returns base when incoming is undefined", () => {
    const config = createConfig();
    const overrides: any[] = [];
    const result = mergeMessagesByLayer(
      "runtimeOverStatic",
      { en: { a: "1" } } as any,
      undefined,
      { config, locale: "en", overrides },
    );
    expect(result).toEqual({
      en: { a: "1" },
    });
  });

  it("appends override event metadata when merge override occurs", () => {
    const config = createConfig();
    const overrides: any[] = [];
    mergeMessagesByLayer(
      "clientOverServer",
      { en: { a: "1" } } as any,
      { en: { a: "2" } } as any,
      { config, locale: "en", overrides },
    );
    expect(overrides.length).toBeGreaterThan(0);
    expect(overrides[0]).toMatchObject({
      layer: "clientOverServer",
      locale: "en",
      configId: "test",
    });
  });

  it("appends add event metadata when incoming adds a new key", () => {
    const config = createConfig();
    const overrides: any[] = [];
    mergeMessagesByLayer(
      "clientOverServer",
      { en: { a: "1" } } as any,
      { en: { b: "2" } } as any,
      { config, locale: "en", overrides },
    );
    expect(overrides).toHaveLength(1);
    expect(overrides[0]).toMatchObject({
      kind: "add",
      path: "b",
      layer: "clientOverServer",
      locale: "en",
      configId: "test",
    });
  });
});
