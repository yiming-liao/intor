import type { IntorRawConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { validateSupportedLocales } from "@/config/validators/validate-supported-locales";
import { IntorError, IntorErrorCode } from "@/core";

describe("validateSupportedLocales", () => {
  const configBase = {
    id: "TEST_ID",
    messages: { en: {}, zh: {} },
  };

  it("throws if root loader is used but supportedLocales is missing", () => {
    expect(() =>
      validateSupportedLocales({
        ...configBase,
        loader: { type: "remote", url: "/api" },
      } as unknown as IntorRawConfig),
    ).toThrowError(IntorError);
  });

  it("throws if server.loader is used but supportedLocales is missing", () => {
    expect(() =>
      validateSupportedLocales({
        ...configBase,
        server: {
          loader: { type: "local", rootDir: "messages" },
        },
      } as unknown as IntorRawConfig),
    ).toThrowError(IntorError);
  });

  it("throws if client.loader is used but supportedLocales is missing", () => {
    expect(() =>
      validateSupportedLocales({
        ...configBase,
        client: {
          loader: { url: "/api" },
        },
      } as unknown as IntorRawConfig),
    ).toThrowError(IntorError);
  });

  it("throws IntorError with correct error code when loader is present without supportedLocales", () => {
    try {
      validateSupportedLocales({
        ...configBase,
        server: {
          loader: { type: "local", rootDir: "messages" },
        },
      } as unknown as IntorRawConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.MISSING_SUPPORTED_LOCALES);
      expect(e.message).toContain("supportedLocales");
    }
  });

  it("returns provided supportedLocales when given (even if loaders exist)", () => {
    const supported = ["en", "zh"];
    const result = validateSupportedLocales({
      ...configBase,
      supportedLocales: supported,
      server: {
        loader: { type: "local", rootDir: "messages" },
      },
    } as unknown as IntorRawConfig);
    expect(result).toEqual(supported);
  });

  it("infers supportedLocales from messages when no loader is configured", () => {
    const result = validateSupportedLocales({
      ...configBase,
    } as unknown as IntorRawConfig);
    expect(result).toEqual(["en", "zh"]);
  });

  it("allows supportedLocales inference when messages exist and no loader is used", () => {
    const result = validateSupportedLocales({
      id: "TEST_ID",
      messages: {
        "en-US": {},
        "zh-TW": {},
      },
      defaultLocale: "en-US",
    } as unknown as IntorRawConfig);

    expect(result).toEqual(["en-US", "zh-TW"]);
  });
});
