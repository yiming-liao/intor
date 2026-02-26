/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi } from "vitest";
import { writable } from "svelte/store";
import { useTranslator } from "../../../../../src/client/svelte/translator/use-translator";
import { getIntorContext } from "../../../../../src/client/svelte/provider";
import { createTRich } from "../../../../../src/core";

vi.mock("../../../../../src/client/svelte/provider", () => ({
  getIntorContext: vi.fn(),
}));

vi.mock("../../../../../src/core", async () => {
  const actual = await vi.importActual<any>("../../../../../src/core");
  return {
    ...actual,
    createTRich: vi.fn(),
  };
});

describe("Svelte useTranslator", () => {
  it("returns fully reactive scoped translator API", () => {
    const scopedMock = {
      hasKey: vi.fn(),
      t: vi.fn(),
    };

    const translatorStore = writable({
      messages: { en: { hello: "hi" } },
      locale: "en",
      isLoading: false,
      scoped: vi.fn().mockReturnValue(scopedMock),
    });

    const localeStore = writable("en");
    const setLocaleMock = vi.fn();

    (getIntorContext as any).mockReturnValue({
      translator: translatorStore,
      locale: localeStore,
      setLocale: setLocaleMock,
    });

    const tRichMock = vi.fn();
    (createTRich as any).mockReturnValue(tRichMock);

    const result = useTranslator("auth");

    const get = (store: any) => {
      let value: any;
      const unsub = store.subscribe((v: any) => (value = v));
      unsub();
      return value;
    };

    get(result.hasKey);

    expect(scopedMock.hasKey).not.toHaveBeenCalled();

    expect(get(result.messages)).toEqual({ en: { hello: "hi" } });

    expect(get(result.locale)).toBe("en");

    expect(get(result.isLoading)).toBe(false);

    translatorStore.update((prev) => ({
      ...prev,
      isLoading: true,
    }));

    expect(get(result.isLoading)).toBe(true);

    const hasKeyFn = get(result.hasKey);
    hasKeyFn("a");
    expect(scopedMock.hasKey).toHaveBeenCalledWith("a");

    const tFn = get(result.t);
    tFn("b");
    expect(scopedMock.t).toHaveBeenCalledWith("b");

    const tRichFn = get(result.tRich);
    tRichFn("c");

    expect(createTRich).toHaveBeenCalledWith(scopedMock.t);
    expect(tRichMock).toHaveBeenCalledWith("c");

    expect(result.setLocale).toBe(setLocaleMock);
  });
});
