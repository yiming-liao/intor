/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CookieResolvedOptions } from "@/config/types/cookie.types";
import { describe, it, expect, afterEach, vi } from "vitest";
import { getLocaleCookieBrowser } from "@/client/shared/utils/cookie/get-locale-cookie-browser";

const mockCookie: CookieResolvedOptions = {
  name: "intor.locale",
  enabled: true,
  persist: true,
  path: "/",
  domain: null,
  secure: false,
  sameSite: "lax",
  httpOnly: false,
  maxAge: 0,
};

describe("getLocaleCookieBrowser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when document is undefined (non-browser environment)", () => {
    // @ts-expect-error testing non-browser env
    delete globalThis.document;

    const result = getLocaleCookieBrowser(mockCookie);
    expect(result).toBeNull();
  });

  it("returns null when locale cookie does not exist", () => {
    vi.stubGlobal("document", {
      cookie: "foo=bar; hello=world",
    } as any);

    const result = getLocaleCookieBrowser(mockCookie);
    expect(result).toBeNull();
  });

  it("returns locale value when cookie exists", () => {
    vi.stubGlobal("document", {
      cookie: "foo=bar; intor.locale=fr-FR; hello=world",
    } as any);

    const result = getLocaleCookieBrowser(mockCookie);
    expect(result).toBe("fr-FR");
  });

  it("decodes encoded cookie value", () => {
    vi.stubGlobal("document", {
      cookie: "intor.locale=zh-TW%2Dvariant",
    } as any);

    const result = getLocaleCookieBrowser(mockCookie);
    expect(result).toBe("zh-TW-variant");
  });
});
