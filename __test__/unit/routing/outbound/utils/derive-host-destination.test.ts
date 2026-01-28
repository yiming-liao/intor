import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { deriveHostDestination } from "@/routing/outbound/utils/derive-host-destination";

const createConfig = (
  hostMap: Record<string, string>,
  defaultHost?: string,
): IntorResolvedConfig =>
  ({
    routing: {
      outbound: {
        host: {
          map: hostMap,
          default: defaultHost,
        },
      },
    },
  }) as IntorResolvedConfig;

describe("deriveHostDestination", () => {
  it("derives destination using locale-specific host", () => {
    const config = createConfig({
      "en-US": "en.example.com",
    });
    const result = deriveHostDestination("/about?x=1", config, "en-US");
    expect(result).toBe("http://en.example.com/about?x=1");
  });

  it("falls back to default host when locale host is not defined", () => {
    const config = createConfig(
      {
        "en-US": "en.example.com",
      },
      "default.example.com",
    );
    const result = deriveHostDestination("/contact", config, "zh-TW");
    expect(result).toBe("http://default.example.com/contact");
  });

  it("returns raw destination when no host is resolved", () => {
    const config = createConfig({});
    const result = deriveHostDestination("/pricing", config, "en-US");
    expect(result).toBe("/pricing");
  });

  it("preserves pathname and search when deriving host destination", () => {
    const config = createConfig({
      "ja-JP": "jp.example.com",
    });
    const result = deriveHostDestination(
      "/docs/getting-started?ref=nav",
      config,
      "ja-JP",
    );
    expect(result).toBe("http://jp.example.com/docs/getting-started?ref=nav");
  });
});
