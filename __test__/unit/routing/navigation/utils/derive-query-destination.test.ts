import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { deriveQueryDestination } from "@/routing/navigation/utils/derive-query-destination";

const createConfig = (key = "lang"): IntorResolvedConfig =>
  ({
    routing: {
      navigation: {
        query: {
          key,
        },
      },
    },
  }) as unknown as IntorResolvedConfig;

describe("deriveQueryDestination", () => {
  it("appends locale as query parameter", () => {
    const config = createConfig("locale");
    const result = deriveQueryDestination(config, "/about", "en-US");
    expect(result).toBe("/about?locale=en-US");
  });

  it("overwrites existing locale query parameter", () => {
    const config = createConfig("lang");
    const result = deriveQueryDestination(config, "/docs?lang=zh-TW", "en-US");
    expect(result).toBe("/docs?lang=en-US");
  });

  it("preserves existing query parameters", () => {
    const config = createConfig("lang");
    const result = deriveQueryDestination(
      config,
      "/search?q=intor&page=2",
      "ja-JP",
    );
    expect(result).toBe("/search?q=intor&page=2&lang=ja-JP");
  });

  it("preserves pathname when raw destination contains no query", () => {
    const config = createConfig("locale");
    const result = deriveQueryDestination(config, "/pricing", "zh-TW");
    expect(result).toBe("/pricing?locale=zh-TW");
  });
});
