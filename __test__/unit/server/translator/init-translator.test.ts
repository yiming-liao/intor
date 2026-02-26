/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "../../../../src/core";
import * as messagesModule from "../../../../src/server/messages";
import { initTranslator } from "../../../../src/server/translator/init-translator";

describe("initTranslator()", () => {
  const config = { id: "test" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coreModule, "createTranslator").mockReturnValue(
      "TRANSLATOR" as any,
    );
  });

  it("uses loadMessages when loaderOptions exists and no custom loader provided", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({} as any);
    vi.spyOn(messagesModule, "loadMessages").mockResolvedValue({
      en: { hello: "world" },
    });
    const result = await initTranslator(config, "en", { fetch });
    expect(messagesModule.loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        locale: "en",
        allowCacheWrite: false,
      }),
    );
    expect(coreModule.createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        locale: "en",
        messages: { en: { hello: "world" } },
      }),
    );
    expect(result).toBe("TRANSLATOR");
  });

  it("skips loadMessages when no loaderOptions", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue(undefined);
    const result = await initTranslator(config, "en", { fetch });
    expect(messagesModule.loadMessages).not.toHaveBeenCalled();
    expect(coreModule.createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
    expect(result).toBe("TRANSLATOR");
  });

  it("uses custom loader when provided", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({} as any);
    const customLoader = vi.fn().mockResolvedValue({ en: { custom: true } });
    const result = await initTranslator(config, "en", {
      fetch,
      loader: customLoader,
    });
    expect(messagesModule.loadMessages).not.toHaveBeenCalled();
    expect(customLoader).toHaveBeenCalledWith(config, "en");
    expect(coreModule.createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: { en: { custom: true } },
      }),
    );
    expect(result).toBe("TRANSLATOR");
  });

  it("falls back to empty object when loadMessages returns undefined", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({} as any);
    vi.spyOn(messagesModule, "loadMessages").mockResolvedValue(undefined);
    await initTranslator(config, "en", { fetch });
    expect(coreModule.createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("forwards handlers and plugins when defined", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue(undefined);
    const handlers = {} as any;
    const plugins = [{ name: "p", run: vi.fn() }];
    await initTranslator(config, "en", { fetch, handlers, plugins });
    expect(coreModule.createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        handlers,
        plugins,
      }),
    );
  });

  it("does not forward handlers/plugins when undefined", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue(undefined);
    await initTranslator(config, "en", { fetch });
    const call = (coreModule.createTranslator as any).mock.calls[0][0];
    expect("handlers" in call).toBe(false);
    expect("plugins" in call).toBe(false);
  });

  it("forwards readers and allowCacheWrite to loadMessages", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({} as any);
    vi.spyOn(messagesModule, "loadMessages").mockResolvedValue({});
    const readers = { json: vi.fn() };
    await initTranslator(config, "en", {
      readers,
      allowCacheWrite: true,
      fetch,
    });
    expect(messagesModule.loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        readers,
        allowCacheWrite: true,
      }),
    );
  });
});
