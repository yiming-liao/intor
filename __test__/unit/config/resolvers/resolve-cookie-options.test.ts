import { describe, it, expect } from "vitest";
import { DEFAULT_COOKIE_OPTIONS } from "../../../../src/config";
import { resolveCookieOptions } from "../../../../src/config/resolvers/resolve-cookie-options";

describe("resolveCookieOptions", () => {
  it("should return default options when cookie is undefined", () => {
    const result = resolveCookieOptions();
    expect(result).toEqual(DEFAULT_COOKIE_OPTIONS);
  });

  it("should override default options with provided cookie options", () => {
    const result = resolveCookieOptions({ path: "/test", httpOnly: false });
    expect(result).toEqual({
      ...DEFAULT_COOKIE_OPTIONS,
      path: "/test",
      httpOnly: false,
    });
  });
});
