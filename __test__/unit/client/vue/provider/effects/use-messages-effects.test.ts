import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import * as messageModule from "../../../../../../src/client/shared/messages";
import { useMessagesEffects } from "../../../../../../src/client/vue/provider/effects/use-messages-effects";

describe("useMessagesEffects (vue)", () => {
  const config: any = { id: "test" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not refetch on initial run", async () => {
    const refetchMock = vi.fn();
    vi.spyOn(messageModule, "createRefetchMessages").mockReturnValue(
      refetchMock as any,
    );
    const locale = ref("en");
    const runtimeMessages = ref(null);
    const internalIsLoading = ref(false);
    useMessagesEffects(config, locale, runtimeMessages, internalIsLoading);
    await nextTick();
    expect(refetchMock).not.toHaveBeenCalled();
  });

  it("refetches when locale changes after initial render", async () => {
    const refetchMock = vi.fn();
    vi.spyOn(messageModule, "createRefetchMessages").mockReturnValue(
      refetchMock as any,
    );
    const locale = ref("en");
    const runtimeMessages = ref(null);
    const internalIsLoading = ref(false);
    useMessagesEffects(config, locale, runtimeMessages, internalIsLoading); // change locale
    locale.value = "fr";
    await nextTick();
    expect(refetchMock).toHaveBeenCalledWith("fr");
  });

  it("passes correct handlers into createRefetchMessages", () => {
    const spy = vi.spyOn(messageModule, "createRefetchMessages");
    const locale = ref("en");
    const runtimeMessages = ref(null);
    const internalIsLoading = ref(false);
    useMessagesEffects(config, locale, runtimeMessages, internalIsLoading);
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
    const locale = ref("en");
    const runtimeMessages = ref(null);
    const internalIsLoading = ref(false);
    useMessagesEffects(config, locale, runtimeMessages, internalIsLoading);
    capturedOnStart();
    expect(internalIsLoading.value).toBe(true);
    capturedOnEnd();
    expect(internalIsLoading.value).toBe(false);
  });

  it("updates runtimeMessages when onMessages is called", () => {
    let capturedOnMessages!: (messages: any) => void;
    vi.spyOn(messageModule, "createRefetchMessages").mockImplementation(
      ({ onMessages }) => {
        capturedOnMessages = onMessages!;
        return vi.fn();
      },
    );
    const locale = ref("en");
    const runtimeMessages = ref(null);
    const internalIsLoading = ref(false);
    useMessagesEffects(config, locale, runtimeMessages, internalIsLoading);
    const fakeMessages = { hello: "world" };
    capturedOnMessages(fakeMessages);
    expect(runtimeMessages.value).toStrictEqual(fakeMessages);
  });
});
