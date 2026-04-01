/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import * as providerModule from "../../../../../src/client/vue/provider";
import * as richModule from "../../../../../src/client/vue/translator/create-t-rich";
import { useTranslator } from "../../../../../src/client/vue/translator/use-translator";

describe("Vue useTranslator", () => {
  it("returns scoped translator API correctly", () => {
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

    const translatorRef = ref({
      messages: { en: {} },
      locale: "en",
      isLoading: false,
      scoped: vi.fn().mockReturnValue(scopedMock),
    });

    const setLocaleMock = vi.fn();

    vi.spyOn(providerModule, "injectIntorContext").mockReturnValue({
      value: {
        translator: translatorRef,
        setLocale: setLocaleMock,
      },
    } as any);

    const tRichMock = vi.fn() as any;
    vi.spyOn(richModule, "createTRich").mockReturnValue(() => tRichMock);

    const result = useTranslator("auth");

    expect(result.messages.value).toEqual({ en: {} });
    expect(result.locale.value).toBe("en");
    expect(result.isLoading.value).toBe(false);

    result.hasKey("a");

    expect(translatorRef.value.scoped).toHaveBeenCalledWith("auth");

    expect(scopedMock.hasKey).toHaveBeenCalledWith("a");

    result.t("b");
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

    result.tRich("c");
    expect(richModule.createTRich).toHaveBeenCalledWith(scopedMock.t);

    expect(result.setLocale).toBe(setLocaleMock);
  });
});
