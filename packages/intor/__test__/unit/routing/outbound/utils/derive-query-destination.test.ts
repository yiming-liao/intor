import type { IntorResolvedConfig } from "../../../../../src/config";
import { describe, it, expect } from "vitest";
import { deriveQueryDestination } from "../../../../../src/routing/outbound/utils/derive-query-destination";

const createConfig = (key = "lang"): IntorResolvedConfig =>
  ({ routing: { outbound: { queryKey: key } } }) as IntorResolvedConfig;

describe("deriveQueryDestination", () => {
  it("appends locale as query parameter", () => {
    const config = createConfig("locale");
    const result = deriveQueryDestination("/about", config, "en-US");
    expect(result).toBe("/about?locale=en-US");
  });

  it("overwrites existing locale query parameter", () => {
    const config = createConfig("lang");
    const result = deriveQueryDestination("/docs?lang=zh-TW", config, "en-US");
    expect(result).toBe("/docs?lang=en-US");
  });

  it("preserves existing query parameters", () => {
    const config = createConfig("lang");
    const result = deriveQueryDestination(
      "/search?q=intor&page=2",
      config,
      "ja-JP",
    );
    expect(result).toBe("/search?q=intor&page=2&lang=ja-JP");
  });

  it("preserves pathname when raw destination contains no query", () => {
    const config = createConfig("locale");
    const result = deriveQueryDestination("/pricing", config, "zh-TW");
    expect(result).toBe("/pricing?locale=zh-TW");
  });
});
