import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { deriveHostDestination } from "@/routing/navigation/utils/derive-host-destination";

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
    const result = deriveHostDestination(config, "/about?x=1", "en-US");
    expect(result).toBe("http://en.example.com/about?x=1");
  });

  it("falls back to default host when locale host is not defined", () => {
    const config = createConfig(
      {
        "en-US": "en.example.com",
      },
      "default.example.com",
    );
    const result = deriveHostDestination(config, "/contact", "zh-TW");
    expect(result).toBe("http://default.example.com/contact");
  });

  it("returns raw destination when no host is resolved", () => {
    const config = createConfig({});
    const result = deriveHostDestination(config, "/pricing", "en-US");
    expect(result).toBe("/pricing");
  });

  it("preserves pathname and search when deriving host destination", () => {
    const config = createConfig({
      "ja-JP": "jp.example.com",
    });
    const result = deriveHostDestination(
      config,
      "/docs/getting-started?ref=nav",
      "ja-JP",
    );
    expect(result).toBe("http://jp.example.com/docs/getting-started?ref=nav");
  });
});
