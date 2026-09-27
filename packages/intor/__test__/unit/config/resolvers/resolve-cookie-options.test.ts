import { describe, it, expect } from "vitest";
import { DEFAULT_COOKIE_OPTIONS } from "../../../../src/config";
import { resolveCookieOptions } from "../../../../src/config/resolvers/resolve-cookie-options";

describe("resolveCookieOptions", () => {
  it("should return default options when cookie is undefined", () => {
    const result = resolveCookieOptions();
    expect(result).toEqual(DEFAULT_COOKIE_OPTIONS);
    expect(result.enabled).toBe(false);
    expect(result.maxAge).toBeUndefined();
  });

  it("should override default options with provided cookie options", () => {
    const result = resolveCookieOptions({
      enabled: true,
      path: "/test",
      httpOnly: false,
    });
    expect(result).toEqual({
      ...DEFAULT_COOKIE_OPTIONS,
      enabled: true,
      path: "/test",
      httpOnly: false,
    });
  });
});
