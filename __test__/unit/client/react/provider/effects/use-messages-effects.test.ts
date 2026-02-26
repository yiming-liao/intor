// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as messageModule from "../../../../../../src/client/shared/messages";
import { useMessagesEffects } from "../../../../../../src/client/react/provider/effects/use-messages-effects";

describe("useMessagesEffects", () => {
  const config: any = { id: "test" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not refetch on initial render", () => {
    const refetchMock = vi.fn();
    vi.spyOn(messageModule, "createRefetchMessages").mockReturnValue(
      refetchMock as any,
    );
    renderHook(() => useMessagesEffects(config, "en", vi.fn(), vi.fn()));
    expect(refetchMock).not.toHaveBeenCalled();
  });

  it("refetches when locale changes after initial render", async () => {
    const refetchMock = vi.fn();
    vi.spyOn(messageModule, "createRefetchMessages").mockReturnValue(
      refetchMock as any,
    );
    const { rerender } = renderHook(
      ({ locale }) => useMessagesEffects(config, locale, vi.fn(), vi.fn()),
      { initialProps: { locale: "en" } },
    );
    await act(async () => {
      rerender({ locale: "fr" });
    });
    expect(refetchMock).toHaveBeenCalledWith("fr");
  });

  it("passes loading and message handlers into createRefetchMessages", () => {
    const setRuntimeMessages = vi.fn();
    const setInternalIsLoading = vi.fn();
    const spy = vi.spyOn(messageModule, "createRefetchMessages");
    renderHook(() =>
      useMessagesEffects(
        config,
        "en",
        setRuntimeMessages,
        setInternalIsLoading,
      ),
    );
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        onMessages: setRuntimeMessages,
        onLoadingStart: expect.any(Function),
        onLoadingEnd: expect.any(Function),
      }),
    );
  });

  it("wires loading callbacks correctly", async () => {
    const setRuntimeMessages = vi.fn();
    const setInternalIsLoading = vi.fn();
    let capturedOnStart!: () => void;
    let capturedOnEnd!: () => void;
    vi.spyOn(messageModule, "createRefetchMessages").mockImplementation(
      ({ onLoadingStart, onLoadingEnd }) => {
        capturedOnStart = onLoadingStart!;
        capturedOnEnd = onLoadingEnd!;
        return vi.fn();
      },
    );
    renderHook(() =>
      useMessagesEffects(
        config,
        "en",
        setRuntimeMessages,
        setInternalIsLoading,
      ),
    );
    capturedOnStart();
    capturedOnEnd();
    expect(setInternalIsLoading).toHaveBeenCalledWith(true);
    expect(setInternalIsLoading).toHaveBeenCalledWith(false);
  });
});
