/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import * as contextModule from "../../../../../src/client/react/provider";
import * as richModule from "../../../../../src/client/react/translator/create-t-rich";
import { useTranslator } from "../../../../../src/client/react/translator/use-translator";

describe("useTranslator", () => {
  it("returns scoped translator API correctly", () => {
    const scopedMock = {
      hasKey: vi.fn(),
      t: vi.fn(),
    };

    const translatorMock = {
      messages: { en: {} },
      locale: "en",
      isLoading: false,
      scoped: vi.fn().mockReturnValue(scopedMock),
    };

    const setLocaleMock = vi.fn();

    vi.spyOn(contextModule, "useIntorContext").mockReturnValue({
      translator: translatorMock,
      setLocale: setLocaleMock,
    } as any);

    const tRichMock = vi.fn();
    vi.spyOn(richModule, "createTRich").mockReturnValue(tRichMock);

    const result = useTranslator("auth");

    expect(translatorMock.scoped).toHaveBeenCalledWith("auth");

    expect(result).toEqual({
      messages: translatorMock.messages,
      locale: "en",
      isLoading: false,
      setLocale: setLocaleMock,
      hasKey: scopedMock.hasKey,
      t: scopedMock.t,
      tRich: tRichMock,
    });
  });
});
