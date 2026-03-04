/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "../../../../src/core";
import { intor } from "../../../../src/server/intor";
import * as translatorModule from "../../../../src/server/translator";

describe("intor()", () => {
  let info: any;
  let debug: any;

  beforeEach(() => {
    vi.clearAllMocks();
    info = vi.fn();
    debug = vi.fn(); // mock logger
    vi.spyOn(coreModule, "getLogger").mockReturnValue({
      child: () => ({ info, debug }),
    } as any);
  });

  function mockInitTranslator() {
    vi.spyOn(translatorModule, "initTranslator").mockResolvedValue({
      locale: "en",
      messages: { en: { hello: "world" } },
    } as any);
  }

  it("initializes with default allowCacheWrite=true and global fetch", async () => {
    mockInitTranslator();
    const config = { logger: {}, supportedLocales: ["en"] } as any;
    const result = await intor(config, "en");
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      config,
      "en",
      expect.objectContaining({
        allowCacheWrite: true,
        fetch: globalThis.fetch,
      }),
    );
    expect(info).toHaveBeenCalledWith("Start Intor initialization.");
    expect(debug).toHaveBeenCalledWith(`Initializing Intor with locale "en".`);
    expect(info).toHaveBeenCalledWith("Intor initialized.");
    expect(result).toEqual({
      config,
      locale: "en",
      messages: { en: { hello: "world" } },
    });
  });

  it("forwards readers when provided", async () => {
    mockInitTranslator();
    const readers = {};
    await intor({ logger: {}, supportedLocales: ["en"] } as any, "en", {
      readers,
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      expect.anything(),
      "en",
      expect.objectContaining({ readers }),
    );
  });

  it("does not forward readers when undefined", async () => {
    mockInitTranslator();
    await intor({ logger: {}, supportedLocales: ["en"] } as any, "en");
    const callOptions = (translatorModule.initTranslator as any).mock
      .calls[0][2];
    expect("readers" in callOptions).toBe(false);
  });

  it("uses custom fetch when provided", async () => {
    mockInitTranslator();
    const customFetch = vi.fn();
    await intor({ logger: {}, supportedLocales: ["en"] } as any, "en", {
      fetch: customFetch,
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      expect.anything(),
      "en",
      expect.objectContaining({ fetch: customFetch }),
    );
  });

  it("uses allowCacheWrite=false when explicitly provided", async () => {
    mockInitTranslator();
    await intor({ logger: {}, supportedLocales: ["en"] } as any, "en", {
      allowCacheWrite: false,
    });
    expect(translatorModule.initTranslator).toHaveBeenCalledWith(
      expect.anything(),
      "en",
      expect.objectContaining({ allowCacheWrite: false }),
    );
  });
});
