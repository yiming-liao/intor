/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "../../../../src/core";
import { getTranslator } from "../../../../src/edge";
import * as translatorModule from "../../../../src/edge/translator";

describe("edge getTranslator", () => {
  const mockScoped = {
    hasKey: vi.fn(),
    t: vi.fn(),
  };
  const mockTranslator = {
    messages: { en: { hello: "world" } },
    locale: "en",
    scoped: vi.fn().mockReturnValue(mockScoped),
  };
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(translatorModule, "initTranslator").mockResolvedValue(
      mockTranslator as any,
    );
    vi.spyOn(coreModule, "createTRich").mockImplementation(
      (t: any) => `wrapped:${t}` as any,
    );
  });

  it("calls initTranslator with default global fetch when not provided", async () => {
    const config = {} as any;
    await getTranslator(config, { locale: "en" });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      config,
      "en",
      expect.objectContaining({
        fetch: globalThis.fetch,
      }),
    );
  });

  it("forwards custom fetch when provided", async () => {
    const config = {} as any;
    const customFetch = vi.fn();
    await getTranslator(config, { locale: "en", fetch: customFetch });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      config,
      "en",
      expect.objectContaining({
        fetch: customFetch,
      }),
    );
  });

  it("forwards handlers and plugins when provided", async () => {
    const config = {} as any;
    const handlers = { formatHandler: vi.fn() };
    const plugins = [{ name: "test", run: vi.fn() }];
    await getTranslator(config, {
      locale: "en",
      handlers,
      plugins,
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      config,
      "en",
      expect.objectContaining({
        handlers,
        plugins,
      }),
    );
  });

  it("does not forward handlers/plugins when undefined", async () => {
    const config = {} as any;
    await getTranslator(config, { locale: "en" });
    const callArgs = (translatorModule.initTranslator as any).mock.calls[0][2];
    expect("handlers" in callArgs).toBe(false);
    expect("plugins" in callArgs).toBe(false);
  });

  it("calls scoped with preKey", async () => {
    const config = {} as any;
    await getTranslator(config, { locale: "en", preKey: "auth" as any });
    expect(mockTranslator.scoped).toHaveBeenCalledWith("auth");
  });

  it("returns wrapped translator snapshot correctly", async () => {
    const config = {} as any;
    const result = await getTranslator(config, { locale: "en" });
    expect(result).toEqual({
      messages: mockTranslator.messages,
      locale: mockTranslator.locale,
      hasKey: mockScoped.hasKey,
      t: mockScoped.t,
      tRich: "wrapped:" + mockScoped.t,
    });
  });
});
