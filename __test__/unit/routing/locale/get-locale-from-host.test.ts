/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getLocaleFromHost } from "@/routing";

describe("getLocaleFromHost", () => {
  const config = {
    supportedLocales: ["en", "en-US", "zh-TW", "jp"] as const,
  } as any;

  it("returns undefined when host is undefined", () => {
    const result = getLocaleFromHost(config, undefined);
    expect(result).toBe(undefined);
  });

  it("extracts locale from left-most subdomain", () => {
    const result = getLocaleFromHost(config, "en.example.com");
    expect(result).toBe("en");
  });

  it("normalizes locale using supportedLocales", () => {
    const result = getLocaleFromHost(config, "EN-us.example.com");
    expect(result).toBe("en-US");
  });

  it("returns undefined when no subdomain is present", () => {
    const result = getLocaleFromHost(config, "example.com");
    expect(result).toBeUndefined();
  });

  it("returns undefined when left-most subdomain is not a locale", () => {
    const result = getLocaleFromHost(config, "api.jp.example.com");
    expect(result).toBeUndefined();
  });

  it("ignores port number in host", () => {
    const result = getLocaleFromHost(config, "zh-TW.example.com:3000");
    expect(result).toBe("zh-TW");
  });

  it("returns undefined for unsupported locale subdomain", () => {
    const result = getLocaleFromHost(config, "fr.example.com");
    expect(result).toBeUndefined();
  });

  it("returns undefined when hostname has no subdomain (no dot)", () => {
    const result = getLocaleFromHost(config, "localhost");
    expect(result).toBeUndefined();
  });
});
