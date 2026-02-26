import { describe, it, expect, vi, beforeEach } from "vitest";
import { writable, get } from "svelte/store";
import * as messageModule from "../../../../../../src/client/shared/messages";
import { attachMessagesEffects } from "../../../../../../src/client/svelte/provider/effects/attach-messages-effects";

describe("attachMessagesEffects (svelte)", () => {
  const config: any = { id: "test" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not refetch on initial subscribe", () => {
    const refetchMock = vi.fn();

    vi.spyOn(messageModule, "createRefetchMessages").mockReturnValue(
      refetchMock as any,
    );

    const locale = writable("en");
    const runtimeMessages = writable(null);
    const internalIsLoading = writable(false);

    attachMessagesEffects({
      locale,
      config,
      runtimeMessages,
      internalIsLoading,
    });

    expect(refetchMock).not.toHaveBeenCalled();
  });

  it("refetches when locale changes", () => {
    const refetchMock = vi.fn();

    vi.spyOn(messageModule, "createRefetchMessages").mockReturnValue(
      refetchMock as any,
    );

    const locale = writable("en");
    const runtimeMessages = writable(null);
    const internalIsLoading = writable(false);

    attachMessagesEffects({
      locale,
      config,
      runtimeMessages,
      internalIsLoading,
    });

    locale.set("fr");

    expect(refetchMock).toHaveBeenCalledWith("fr");
  });

  it("passes correct handlers into createRefetchMessages", () => {
    const spy = vi.spyOn(messageModule, "createRefetchMessages");

    const locale = writable("en");
    const runtimeMessages = writable(null);
    const internalIsLoading = writable(false);

    attachMessagesEffects({
      locale,
      config,
      runtimeMessages,
      internalIsLoading,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        onMessages: expect.any(Function),
        onLoadingStart: expect.any(Function),
        onLoadingEnd: expect.any(Function),
      }),
    );
  });

  it("wires loading callbacks correctly", () => {
    let capturedOnStart!: () => void;
    let capturedOnEnd!: () => void;

    vi.spyOn(messageModule, "createRefetchMessages").mockImplementation(
      ({ onLoadingStart, onLoadingEnd }) => {
        capturedOnStart = onLoadingStart!;
        capturedOnEnd = onLoadingEnd!;
        return vi.fn();
      },
    );

    const locale = writable("en");
    const runtimeMessages = writable(null);
    const internalIsLoading = writable(false);

    attachMessagesEffects({
      locale,
      config,
      runtimeMessages,
      internalIsLoading,
    });

    capturedOnStart();
    expect(get(internalIsLoading)).toBe(true);

    capturedOnEnd();
    expect(get(internalIsLoading)).toBe(false);
  });

  it("updates runtimeMessages when onMessages is called", () => {
    let capturedOnMessages!: (messages: any) => void;

    vi.spyOn(messageModule, "createRefetchMessages").mockImplementation(
      ({ onMessages }) => {
        capturedOnMessages = onMessages!;
        return vi.fn();
      },
    );

    const locale = writable("en");
    const runtimeMessages = writable(null);
    const internalIsLoading = writable(false);

    attachMessagesEffects({
      locale,
      config,
      runtimeMessages,
      internalIsLoading,
    });

    const fakeMessages = { hello: "world" };

    capturedOnMessages(fakeMessages);

    expect(get(runtimeMessages)).toStrictEqual(fakeMessages);
  });
});
