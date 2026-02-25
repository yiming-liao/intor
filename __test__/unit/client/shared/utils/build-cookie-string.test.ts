/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CookieResolvedOptions } from "../../../../../src/config";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildCookieString } from "../../../../../src/client/shared/utils/build-cookie-string";

const baseCookie: CookieResolvedOptions = {
  persist: true,
  name: "intor.locale",
  path: "/",
  maxAge: 10,
  httpOnly: false,
  secure: true,
  sameSite: "lax",
};

describe("buildCookieString", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds a basic locale cookie string", () => {
    const result = buildCookieString(baseCookie, "en-US");
    expect(result).toContain("intor.locale=en-US");
    expect(result).toContain("path=/");
    expect(result).toContain("SameSite=Lax");
    expect(result).toContain("Secure");
  });

  it("encodes locale value", () => {
    const result = buildCookieString(baseCookie, "zh-TW@test");
    expect(result).toContain("intor.locale=zh-TW%40test");
  });

  it("adds expires and max-age when maxAge is provided", () => {
    const result = buildCookieString(
      {
        ...baseCookie,
        maxAge: 60, // seconds
      },
      "en-US",
    );
    expect(result).toContain("max-age=60");
    expect(result).toMatch(/expires=.*GMT/);
  });

  it("includes domain when specified", () => {
    const result = buildCookieString(
      {
        ...baseCookie,
        domain: "example.com",
      },
      "en-US",
    );
    expect(result).toContain("domain=example.com");
  });

  it("omits domain when not specified", () => {
    const result = buildCookieString({ ...baseCookie }, "en-US");
    expect(result).not.toContain("domain=");
  });

  it("respects SameSite option casing", () => {
    const result = buildCookieString(
      {
        ...baseCookie,
        sameSite: "strict",
      },
      "en-US",
    );
    expect(result).toContain("SameSite=Strict");
  });

  it("does not include Secure flag when explicitly disabled", () => {
    const result = buildCookieString(
      {
        ...baseCookie,
        secure: false,
      },
      "en-US",
    );
    expect(result).not.toContain("Secure");
  });

  it("does not include expires and max-age when maxAge is undefined", () => {
    const result = buildCookieString(
      {
        ...baseCookie,
        maxAge: undefined as any,
      },
      "en-US",
    );
    expect(result).not.toContain("expires=");
    expect(result).not.toContain("max-age=");
  });

  it("omits SameSite when not provided", () => {
    const result = buildCookieString(
      {
        ...baseCookie,
        sameSite: undefined as any,
      },
      "en-US",
    );
    expect(result).not.toContain("SameSite=");
  });

  it("defaults path to '/' when cookie.path is undefined", () => {
    const result = buildCookieString(
      {
        name: "locale",
        path: undefined,
        enabled: true,
      } as any,
      "en-US",
    );
    expect(result).toContain("path=/");
  });
});
