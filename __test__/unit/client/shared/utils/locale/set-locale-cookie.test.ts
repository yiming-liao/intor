/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { setLocaleCookie } from "../../../../../../src/client/shared/utils";
import * as buildModule from "../../../../../../src/client/shared/utils/build-cookie-string";

describe("setLocaleCookie", () => {
  const cookieOptions = {
    name: "locale",
    path: "/",
    sameSite: "lax",
  } as any;

  beforeEach(() => {
    document.cookie = "";
    vi.restoreAllMocks();
  });

  it("writes cookie string to document.cookie in browser environment", () => {
    vi.spyOn(buildModule, "buildCookieString").mockReturnValue(
      "locale=en-US; Path=/",
    );
    setLocaleCookie(cookieOptions, "en-US");
    expect(buildModule.buildCookieString).toHaveBeenCalledWith(
      cookieOptions,
      "en-US",
    );
    expect(document.cookie).toContain("locale=en-US");
  });

  it("does nothing when document is undefined", () => {
    const original = globalThis.document;
    Object.defineProperty(globalThis, "document", {
      value: undefined,
      configurable: true,
    });
    expect(() => setLocaleCookie(cookieOptions, "en-US")).not.toThrow();
    Object.defineProperty(globalThis, "document", {
      value: original,
      configurable: true,
    });
  });
});
