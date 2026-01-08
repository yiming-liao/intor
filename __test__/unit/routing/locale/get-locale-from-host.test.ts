import { describe, it, expect } from "vitest";
import { getLocaleFromHost } from "@/routing";

describe("getLocaleFromHost", () => {
  it("returns undefined when host is undefined", () => {
    const result = getLocaleFromHost(undefined);
    expect(result).toBeUndefined();
  });

  it("extracts left-most subdomain as locale candidate", () => {
    const result = getLocaleFromHost("en.example.com");
    expect(result).toBe("en");
  });

  it("returns left-most subdomain even if it is not a valid locale", () => {
    const result = getLocaleFromHost("api.example.com");
    expect(result).toBe("api");
  });

  it("extracts locale from multi-level subdomain host", () => {
    const result = getLocaleFromHost("jp.shop.example.com");
    expect(result).toBe("jp");
  });

  it("ignores port number in host", () => {
    const result = getLocaleFromHost("zh-TW.example.com:3000");
    expect(result).toBe("zh-TW");
  });

  it("extracts left-most label even for apex domain", () => {
    const result = getLocaleFromHost("example.com");
    expect(result).toBe("example");
  });

  it("returns undefined when hostname has no dot", () => {
    const result = getLocaleFromHost("localhost");
    expect(result).toBeUndefined();
  });
});
