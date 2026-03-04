import type { TranslateContext } from "../../../src/pipeline/types/context";
import { describe, it, expect } from "vitest";
import { makeHandlerContext } from "../../../src/pipeline/utils/make-handler-context";

describe("makeHandlerContext", () => {
  it("should return a frozen snapshot of the handler-related context fields", () => {
    const ctx: TranslateContext = {
      locale: "en",
      key: "hello",
      replacements: { name: "John" },
      messages: { en: { hello: "Hi" } },
      candidateLocales: ["en"],
      config: { missingMessage: "??" },
      isLoading: false,
      rawMessage: "Hi",
      formattedMessage: "Hi (formatted)",
      meta: { custom: true },
    };

    const snapshot = makeHandlerContext(ctx);

    // snapshot contains selected fields
    expect(snapshot).toEqual({
      locale: "en",
      key: "hello",
      replacements: { name: "John" },
      messages: ctx.messages,
      candidateLocales: ["en"],
      config: ctx.config,
      isLoading: false,
      rawMessage: "Hi",
      formattedMessage: "Hi (formatted)",
      meta: { custom: true },
    });

    // finalMessage must NOT exist
    expect("finalMessage" in snapshot).toBe(false);
  });

  it("should freeze the returned context (prevent modifications)", () => {
    const ctx = {
      locale: "en",
      key: "hello",
      messages: {},
      candidateLocales: [],
      config: {},
      meta: {},
    } as unknown as TranslateContext;

    const snapshot = makeHandlerContext(ctx);

    expect(Object.isFrozen(snapshot)).toBe(true);

    // attempt mutation should fail silently or throw (strict mode)
    // we test that it does NOT change
    const originalLocale = snapshot.locale;

    expect(() => {
      // @ts-expect-error - mutate attempt
      snapshot.locale = "zh";
    }).toThrow();

    expect(snapshot.locale).toBe(originalLocale);
  });

  it("should create a new object instead of returning the same reference", () => {
    const ctx = {
      locale: "en",
      key: "hello",
      messages: {},
      candidateLocales: [],
      config: {},
      meta: {},
    } as unknown as TranslateContext;

    const snapshot = makeHandlerContext(ctx);

    expect(snapshot).not.toBe(ctx);
  });
});
