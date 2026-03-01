/* eslint-disable @typescript-eslint/no-explicit-any */
import { Translator } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTranslator } from "../../../../src/core/translator/create-translator";

vi.mock("intor-translator", () => {
  return {
    Translator: vi.fn().mockImplementation(function (this: any, opts: any) {
      this.options = opts;
      this.t = vi.fn();
    }),
  };
});

describe("createTranslator defensive branches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forwards loadingMessage and missingMessage when defined", () => {
    const config = {
      messages: {},
      fallbackLocales: {},
      translator: {
        loadingMessage: "Loading...",
        missingMessage: "Missing!",
      },
    } as any;
    createTranslator({
      config,
      locale: "en",
      messages: {},
    });
    expect(Translator).toHaveBeenCalledWith(
      expect.objectContaining({
        loadingMessage: "Loading...",
        missingMessage: "Missing!",
      }),
    );
  });

  it("does not forward loadingMessage and missingMessage when undefined", () => {
    const config = {
      messages: {},
      fallbackLocales: {},
      translator: {},
    } as any;
    createTranslator({
      config,
      locale: "en",
      messages: {},
    });
    const call = (Translator as any).mock.calls[0][0];
    expect("loadingMessage" in call).toBe(false);
    expect("missingMessage" in call).toBe(false);
  });

  it("forwards handlers when provided", () => {
    const handlers = { formatHandler: vi.fn() };
    createTranslator({
      config: {
        messages: {},
        fallbackLocales: {},
        translator: {},
      } as any,
      locale: "en",
      messages: {},
      handlers,
    });
    expect(Translator).toHaveBeenCalledWith(
      expect.objectContaining({ handlers }),
    );
  });

  it("forwards hooks when provided", () => {
    const hooks = [{ name: "test", run: vi.fn() }];
    createTranslator({
      config: {
        messages: {},
        fallbackLocales: {},
        translator: {},
      } as any,
      locale: "en",
      messages: {},
      hooks,
    });
    expect(Translator).toHaveBeenCalledWith(expect.objectContaining({ hooks }));
  });

  it("does not forward handlers or hooks when undefined", () => {
    createTranslator({
      config: {
        messages: {},
        fallbackLocales: {},
        translator: {},
      } as any,
      locale: "en",
      messages: {},
    });
    const call = (Translator as any).mock.calls[0][0];
    expect("handlers" in call).toBe(false);
    expect("hooks" in call).toBe(false);
  });

  it("handles undefined config.translator safely", () => {
    createTranslator({
      config: {
        messages: {},
        fallbackLocales: {},
      } as any,
      locale: "en",
      messages: {},
    });
    const call = (Translator as any).mock.calls[0][0];
    expect("loadingMessage" in call).toBe(false);
    expect("missingMessage" in call).toBe(false);
  });
});
