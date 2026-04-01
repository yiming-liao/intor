/* eslint-disable @typescript-eslint/no-explicit-any */

import { writable } from "svelte/store";
import { describe, it, expect, vi } from "vitest";
import { getIntorContext } from "../../../../../src/client/svelte/provider";
import { useTranslator } from "../../../../../src/client/svelte/translator/use-translator";
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
    const formatMock = {
      number: vi.fn().mockReturnValue("1,000"),
      currency: vi.fn().mockReturnValue("$1,000.00"),
      date: vi.fn().mockReturnValue("Apr 1, 2026"),
      relativeTime: vi.fn().mockReturnValue("2 hours ago"),
      list: vi.fn().mockReturnValue("A, B, and C"),
      plural: vi.fn().mockReturnValue("one"),
    };

    const scopedMock = {
      hasKey: vi.fn(),
      t: vi.fn(),
      format: formatMock,
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

    expect(result.format.number(1000)).toBe("1,000");
    expect(formatMock.number).toHaveBeenCalledWith(1000, undefined);

    expect(result.format.currency(1000, "USD")).toBe("$1,000.00");
    expect(formatMock.currency).toHaveBeenCalledWith(1000, "USD", undefined);

    const date = new Date("2026-04-01T00:00:00.000Z");
    expect(result.format.date(date)).toBe("Apr 1, 2026");
    expect(formatMock.date).toHaveBeenCalledWith(date, undefined);

    expect(result.format.relativeTime(-2, "hour")).toBe("2 hours ago");
    expect(formatMock.relativeTime).toHaveBeenCalledWith(-2, "hour", undefined);

    expect(result.format.list(["A", "B", "C"])).toBe("A, B, and C");
    expect(formatMock.list).toHaveBeenCalledWith(["A", "B", "C"], undefined);

    expect(result.format.plural(1)).toBe("one");
    expect(formatMock.plural).toHaveBeenCalledWith(1, undefined);

    const tRichFn = get(result.tRich);
    tRichFn("c");

    expect(createTRich).toHaveBeenCalledWith(scopedMock.t);
    expect(tRichMock).toHaveBeenCalledWith("c");

    expect(result.setLocale).toBe(setLocaleMock);
  });
});
