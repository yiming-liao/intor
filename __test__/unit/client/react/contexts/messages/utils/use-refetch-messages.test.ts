import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { LocaleMessages } from "intor-translator";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRefetchMessages } from "@/client/react/contexts/messages/utils/use-refetch-messages";
import * as serverMessages from "@/server/messages/load-remote-messages";

// --- mock loadRemoteMessages ---
vi.mock("@/server/messages/load-remote-messages", () => ({
  loadRemoteMessages: vi.fn(),
}));

describe("useRefetchMessages", () => {
  const mockSetRuntimeMessages = vi.fn();
  const mockSetIsLoadingMessages = vi.fn();

  const baseConfig = {
    id: "test-app",
    messages: {
      "en-US": {
        hello: "world",
      },
    },
    fallbackLocales: {},
    cache: {},
  } as unknown as IntorResolvedConfig;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when loader type is not remote", async () => {
    const config = {
      ...baseConfig,
      loader: {
        type: "local",
      },
    } as IntorResolvedConfig;

    const { result } = renderHook(() =>
      useRefetchMessages({
        config,
        setRuntimeMessages: mockSetRuntimeMessages,
        setIsLoadingMessages: mockSetIsLoadingMessages,
      }),
    );

    await act(async () => {
      await result.current.refetchMessages("zh-TW");
    });

    expect(serverMessages.loadRemoteMessages).not.toHaveBeenCalled();
    expect(mockSetIsLoadingMessages).not.toHaveBeenCalled();
    expect(mockSetRuntimeMessages).not.toHaveBeenCalled();
  });

  it("calls loadRemoteMessages when loader type is remote", async () => {
    const loadedMessages: LocaleMessages = {
      "zh-TW": {
        hello: "你好",
      },
    };

    vi.mocked(serverMessages.loadRemoteMessages).mockResolvedValue(
      loadedMessages,
    );

    const config = {
      ...baseConfig,
      loader: {
        type: "remote",
        namespaces: ["common"],
        rootDir: "",
        remoteUrl: "https://example.com/messages",
        remoteHeaders: {},
      },
    } as IntorResolvedConfig;

    const { result } = renderHook(() =>
      useRefetchMessages({
        config,
        setRuntimeMessages: mockSetRuntimeMessages,
        setIsLoadingMessages: mockSetIsLoadingMessages,
      }),
    );

    await act(async () => {
      await result.current.refetchMessages("zh-TW");
    });

    expect(serverMessages.loadRemoteMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "zh-TW",
        namespaces: ["common"],
        remoteUrl: "https://example.com/messages",
      }),
    );
  });

  it("merges loaded messages with config messages and updates loading state", async () => {
    const loadedMessages: LocaleMessages = {
      "zh-TW": {
        hello: "你好",
      },
    };

    vi.mocked(serverMessages.loadRemoteMessages).mockResolvedValue(
      loadedMessages,
    );

    const config = {
      ...baseConfig,
      loader: {
        type: "remote",
        namespaces: ["common"],
        rootDir: "",
        remoteUrl: "https://example.com/messages",
        remoteHeaders: {},
      },
    } as IntorResolvedConfig;

    const { result } = renderHook(() =>
      useRefetchMessages({
        config,
        setRuntimeMessages: mockSetRuntimeMessages,
        setIsLoadingMessages: mockSetIsLoadingMessages,
      }),
    );

    await act(async () => {
      await result.current.refetchMessages("zh-TW");
    });

    expect(mockSetIsLoadingMessages).toHaveBeenNthCalledWith(1, true);
    expect(mockSetRuntimeMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        "en-US": {
          hello: "world",
        },
        "zh-TW": {
          hello: "你好",
        },
      }),
    );
    expect(mockSetIsLoadingMessages).toHaveBeenLastCalledWith(false);
  });
});
