/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../../src/config";
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRefetchMessages } from "../../../../../src/client/shared/messages/create-refetch-messages";
import { loadRemoteMessages, mergeMessages } from "../../../../../src/core";

vi.mock("../../../../../src/core", async () => {
  const actual = await vi.importActual<any>("../../../../../src/core");
  return {
    ...actual,
    loadRemoteMessages: vi.fn(),
    mergeMessages: vi.fn(),
  };
});

const mockedLoadRemoteMessages = vi.mocked(loadRemoteMessages);
const mockedMergeMessages = vi.mocked(mergeMessages);

const createBaseConfig = (): IntorResolvedConfig =>
  ({
    id: "test",
    messages: { en: { base: "base" } },
    fallbackLocales: { en: ["zh"] },
    logger: {},
    loader: {
      mode: "remote",
      url: "https://example.com",
    },
  }) as any;

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

describe("createRefetchMessages", () => {
  let onLoadingStart: ReturnType<any>;
  let onLoadingEnd: ReturnType<any>;
  let onMessages: ReturnType<any>;

  beforeEach(() => {
    onLoadingStart = vi.fn();
    onLoadingEnd = vi.fn();
    onMessages = vi.fn();
    vi.clearAllMocks();
  });

  it("does nothing when loader is not remote", async () => {
    const config = {
      ...createBaseConfig(),
      loader: { mode: "local" },
    } as any;
    const refetch = createRefetchMessages({
      config,
      onLoadingStart,
      onLoadingEnd,
      onMessages,
    });
    await refetch("en");
    expect(mockedLoadRemoteMessages).not.toHaveBeenCalled();
  });

  it("passes only defined loader options", async () => {
    mockedLoadRemoteMessages.mockResolvedValue({
      en: { hello: "world" },
    } as LocaleMessages);
    const config = {
      ...createBaseConfig(),
      loader: {
        mode: "remote",
        url: "https://example.com",
        namespaces: ["common"],
        concurrency: 3,
        headers: { Authorization: "token" },
      },
    } as any;
    const refetch = createRefetchMessages({
      config,
      onMessages,
    });
    await refetch("en");
    expect(mockedLoadRemoteMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        namespaces: ["common"],
        concurrency: 3,
        headers: { Authorization: "token" },
        fallbackLocales: ["zh"],
      }),
    );
  });

  it("does not pass undefined loader options", async () => {
    mockedLoadRemoteMessages.mockResolvedValue({
      en: { hello: "world" },
    } as LocaleMessages);
    const refetch = createRefetchMessages({
      config: createBaseConfig(),
      onMessages,
    });
    await refetch("en");
    const args = mockedLoadRemoteMessages.mock.calls[0]![0];
    expect(args.namespaces).toBeUndefined();
    expect(args.concurrency).toBeUndefined();
    expect(args.headers).toBeUndefined();
  });

  it("only applies latest request (abort previous)", async () => {
    const d1 = deferred<LocaleMessages>();
    const d2 = deferred<LocaleMessages>();
    mockedLoadRemoteMessages
      .mockReturnValueOnce(d1.promise)
      .mockReturnValueOnce(d2.promise);
    const refetch = createRefetchMessages({
      config: createBaseConfig(),
      onMessages,
    });
    refetch("en");
    refetch("ja");
    d1.resolve({ en: { old: "old" } } as LocaleMessages);
    d2.resolve({ ja: { new: "new" } } as LocaleMessages);
    await Promise.allSettled([d1.promise, d2.promise]);
    expect(onMessages).toHaveBeenCalledTimes(1);
  });

  it("calls mergeMessages before emitting messages", async () => {
    mockedLoadRemoteMessages.mockResolvedValue({
      en: { hello: "world" },
    } as LocaleMessages);
    mockedMergeMessages.mockReturnValue({
      en: { merged: true },
    } as any);
    const refetch = createRefetchMessages({
      config: createBaseConfig(),
      onMessages,
    });
    await refetch("en");
    expect(mockedMergeMessages).toHaveBeenCalledWith(
      createBaseConfig().messages,
      { en: { hello: "world" } },
      expect.objectContaining({
        locale: "en",
      }),
    );
    expect(onMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        en: { merged: true },
      }),
    );
  });

  it("passes abort signal to remote loader", async () => {
    mockedLoadRemoteMessages.mockResolvedValue({} as LocaleMessages);
    const refetch = createRefetchMessages({
      config: createBaseConfig(),
    });
    await refetch("en");
    const args = mockedLoadRemoteMessages.mock.calls[0]![0];
    expect(args.signal).toBeInstanceOf(AbortSignal);
  });
});
