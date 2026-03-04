/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadRemoteMessages, createTranslator } from "../../../../src/core";
import { initTranslator } from "../../../../src/edge/translator/init-translator";

vi.mock("../../../../src/core", async () => {
  const actual = await vi.importActual<any>("../../../../src/core");
  return {
    ...actual,
    loadRemoteMessages: vi.fn(),
    createTranslator: vi.fn(),
  };
});

describe("edge initTranslator", () => {
  const baseConfig = {
    fallbackLocales: { en: ["zh"] },
    logger: { id: "test" },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not load messages when no loader configured", async () => {
    const config = { ...baseConfig };
    await initTranslator(config, "en", {
      fetch: vi.fn(),
    });
    expect(loadRemoteMessages).not.toHaveBeenCalled();
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("does not load messages when loader mode is not remote", async () => {
    const config = {
      ...baseConfig,
      loader: { mode: "local" },
    };
    await initTranslator(config, "en", {
      fetch: vi.fn(),
    });
    expect(loadRemoteMessages).not.toHaveBeenCalled();
  });

  it("loads remote messages when loader.mode === remote", async () => {
    (loadRemoteMessages as any).mockResolvedValue({
      en: { hello: "world" },
    });
    const config = {
      ...baseConfig,
      loader: {
        mode: "remote",
        url: "https://api.test",
        namespaces: ["common"],
        concurrency: 3,
        headers: { Authorization: "Bearer token" },
      },
    };
    await initTranslator(config, "en", {
      fetch: vi.fn(),
    });
    expect(loadRemoteMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        fallbackLocales: ["zh"],
        namespaces: ["common"],
        concurrency: 3,
        url: "https://api.test",
        headers: { Authorization: "Bearer token" },
      }),
    );
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: { en: { hello: "world" } },
      }),
    );
  });

  it("uses empty object when loaded messages are undefined", async () => {
    (loadRemoteMessages as any).mockResolvedValue(undefined);
    const config = {
      ...baseConfig,
      loader: {
        mode: "remote",
        url: "https://api.test",
      },
    };
    await initTranslator(config, "en", {
      fetch: vi.fn(),
    });
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("does not pass namespaces/concurrency/headers when undefined", async () => {
    (loadRemoteMessages as any).mockResolvedValue({});
    const config = {
      ...baseConfig,
      loader: {
        mode: "remote",
        url: "https://api.test",
      },
    };
    await initTranslator(config, "en", {
      fetch: vi.fn(),
    });
    const call = (loadRemoteMessages as any).mock.calls[0][0];
    expect("namespaces" in call).toBe(false);
    expect("concurrency" in call).toBe(false);
    expect("headers" in call).toBe(false);
  });

  it("forwards handlers and hooks when provided", async () => {
    const handlers = { formatHandler: vi.fn() };
    const hooks = [{ name: "p", run: vi.fn() }];
    await initTranslator({ ...baseConfig } as any, "en", {
      fetch: vi.fn(),
      handlers,
      hooks,
    });
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        handlers,
        hooks,
      }),
    );
  });

  it("does not forward handlers/hooks when undefined", async () => {
    await initTranslator({ ...baseConfig } as any, "en", { fetch: vi.fn() });
    const call = (createTranslator as any).mock.calls[0][0];
    expect("handlers" in call).toBe(false);
    expect("hooks" in call).toBe(false);
  });

  it("uses empty array when no fallbackLocales defined for locale", async () => {
    (loadRemoteMessages as any).mockResolvedValue({});
    const config = {
      fallbackLocales: { en: ["zh"] },
      logger: { id: "test" },
      loader: {
        mode: "remote",
        url: "https://api.test",
      },
    };
    await initTranslator(config as any, "fr", {
      fetch: vi.fn(),
    });
    expect(loadRemoteMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLocales: [],
      }),
    );
  });
});
