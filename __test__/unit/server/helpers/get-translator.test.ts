/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "../../../../src/core";
import { getTranslator } from "../../../../src/server";
import * as translatorModule from "../../../../src/server/translator";

describe("getTranslator()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockInitTranslator() {
    const scoped = {
      hasKey: vi.fn(),
      t: vi.fn(),
    };
    const translator = {
      messages: { en: { hello: "world" } },
      locale: "en",
      scoped: vi.fn(() => scoped),
    };
    vi.spyOn(translatorModule, "initTranslator").mockResolvedValue(
      translator as any,
    );
    return { translator, scoped };
  }

  it("initializes translator with minimal params (default allowCacheWrite=false)", async () => {
    const { scoped } = mockInitTranslator();
    vi.spyOn(coreModule, "createTRich").mockReturnValue("rich" as any);
    const result = await getTranslator({ supportedLocales: ["en"] } as any, {
      locale: "en",
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      expect.anything(),
      "en",
      expect.objectContaining({
        allowCacheWrite: false,
        fetch: globalThis.fetch,
      }),
    );
    expect(result.locale).toBe("en");
    expect(result.messages).toEqual({ en: { hello: "world" } });
    expect(result.hasKey).toBe(scoped.hasKey);
    expect(result.t).toBe(scoped.t);
    expect(result.tRich).toBe("rich");
  });

  it("forwards loader, readers, handlers, plugins when defined", async () => {
    mockInitTranslator();
    vi.spyOn(coreModule, "createTRich").mockReturnValue("rich" as any);
    const loader = vi.fn();
    const readers = {};
    const handlers = {};
    const plugins = [{}];
    await getTranslator({ supportedLocales: ["en"] } as any, {
      locale: "en",
      loader,
      readers,
      handlers,
      plugins,
      allowCacheWrite: true,
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      expect.anything(),
      "en",
      expect.objectContaining({
        loader,
        readers,
        handlers,
        plugins,
        allowCacheWrite: true,
      }),
    );
  });

  it("does NOT forward undefined optional fields", async () => {
    mockInitTranslator();
    vi.spyOn(coreModule, "createTRich").mockReturnValue("rich" as any);
    await getTranslator(
      { supportedLocales: ["en"] } as any,
      {
        locale: "en",
        loader: undefined,
        readers: undefined,
        handlers: undefined,
        plugins: undefined,
      } as any,
    );
    const callOptions = (translatorModule.initTranslator as any).mock
      .calls[0][2];
    expect("loader" in callOptions).toBe(false);
    expect("readers" in callOptions).toBe(false);
    expect("handlers" in callOptions).toBe(false);
    expect("plugins" in callOptions).toBe(false);
  });

  it("uses provided fetch instead of global fetch", async () => {
    mockInitTranslator();
    vi.spyOn(coreModule, "createTRich").mockReturnValue("rich" as any);
    const customFetch = vi.fn();
    await getTranslator({ supportedLocales: ["en"] } as any, {
      locale: "en",
      fetch: customFetch,
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      expect.anything(),
      "en",
      expect.objectContaining({
        fetch: customFetch,
      }),
    );
  });

  it("calls scoped with preKey", async () => {
    const { translator } = mockInitTranslator();
    vi.spyOn(coreModule, "createTRich").mockReturnValue("rich" as any);
    await getTranslator({ supportedLocales: ["en"] } as any, {
      locale: "en",
      preKey: "common" as any,
    });
    expect(translator.scoped).toHaveBeenCalledWith("common");
  });

  it("creates tRich using scoped.t", async () => {
    const { scoped } = mockInitTranslator();
    const richSpy = vi
      .spyOn(coreModule, "createTRich")
      .mockReturnValue("rich" as any);
    await getTranslator({ supportedLocales: ["en"] } as any, { locale: "en" });
    expect(richSpy).toHaveBeenCalledWith(scoped.t);
  });
});
