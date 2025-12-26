import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRefetchMessages } from "@/client/shared/utils/create-refetch-messages";
import { loadRemoteMessages } from "@/server/messages/load-remote-messages";

vi.mock("@/server/messages/load-remote-messages", () => ({
  loadRemoteMessages: vi.fn(),
}));

const mockedLoadRemoteMessages = vi.mocked(loadRemoteMessages);

const createBaseConfig = (): IntorResolvedConfig =>
  ({
    id: "test",
    messages: { en: { hello: "base" } },
    fallbackLocales: {},
    cache: {},
    logger: {},
    loader: {
      type: "remote",
      remoteUrl: "https://example.com",
      namespaces: [],
      rootDir: "",
    },
  }) as unknown as IntorResolvedConfig;

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("createRefetchMessages", () => {
  let onLoadingStart: () => void;
  let onLoadingEnd: () => void;
  let onMessages: () => void;

  beforeEach(() => {
    onLoadingStart = vi.fn();
    onLoadingEnd = vi.fn();
    onMessages = vi.fn();
    vi.clearAllMocks();
  });

  it("does nothing when loader is not remote", async () => {
    const config = {
      ...createBaseConfig(),
      loader: { type: "local" },
    } as IntorResolvedConfig;

    const refetch = createRefetchMessages({
      config,
      onLoadingStart,
      onLoadingEnd,
      onMessages,
    });

    await refetch("en");

    expect(onLoadingStart).not.toHaveBeenCalled();
    expect(onMessages).not.toHaveBeenCalled();
    expect(onLoadingEnd).not.toHaveBeenCalled();
  });

  it("calls loading callbacks around a successful request", async () => {
    mockedLoadRemoteMessages.mockResolvedValue({
      en: { hello: "world" },
    } as LocaleMessages);

    const refetch = createRefetchMessages({
      config: createBaseConfig(),
      onLoadingStart,
      onLoadingEnd,
      onMessages,
    });

    await refetch("en");

    expect(onLoadingStart).toHaveBeenCalledOnce();
    expect(onMessages).toHaveBeenCalledOnce();
    expect(onLoadingEnd).toHaveBeenCalledOnce();
  });

  it("only applies messages from the latest request", async () => {
    const d1 = deferred<LocaleMessages>();
    const d2 = deferred<LocaleMessages>();

    mockedLoadRemoteMessages
      .mockReturnValueOnce(d1.promise)
      .mockReturnValueOnce(d2.promise);

    const refetch = createRefetchMessages({
      config: createBaseConfig(),
      onLoadingStart,
      onLoadingEnd,
      onMessages,
    });

    refetch("en");
    refetch("ja");

    d1.resolve({ en: { hello: "old" } } as LocaleMessages);
    d2.resolve({ ja: { hello: "new" } } as LocaleMessages);

    await Promise.allSettled([d1.promise, d2.promise]);

    expect(onMessages).toHaveBeenCalledTimes(1);
    expect(onMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        ja: { hello: "new" },
      }),
    );
  });
});
