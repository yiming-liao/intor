/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import * as providerModule from "../../../../../src/client/vue/provider";
import * as richModule from "../../../../../src/client/vue/translator/create-t-rich";
import { useTranslator } from "../../../../../src/client/vue/translator/use-translator";

describe("Vue useTranslator", () => {
  it("returns scoped translator API correctly", () => {
    const scopedMock = {
      hasKey: vi.fn(),
      t: vi.fn(),
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

    result.tRich("c");
    expect(richModule.createTRich).toHaveBeenCalledWith(scopedMock.t);

    expect(result.setLocale).toBe(setLocaleMock);
  });
});
