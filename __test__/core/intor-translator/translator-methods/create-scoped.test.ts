import type { TranslatorOptions } from "../../../../src/intor/core/intor-translator/types/intor-translator-types";
import type { LocaleNamespaceMessages } from "../../../../src/intor/types/message-structure-types";
import { mockLocaleNamespaceMessages } from "../../../mock/mock-locale-namespace-messages";
import { createHasKey } from "../../../../src/intor/core/intor-translator/translator-methods/create-has-key";
import { createScoped } from "../../../../src/intor/core/intor-translator/translator-methods/create-scoped";
import { createTranslate } from "../../../../src/intor/core/intor-translator/translator-methods/create-translate";

jest.mock(
  "../../../../src/intor/core/intor-translator/translator-methods/create-translate",
);
jest.mock(
  "../../../../src/intor/core/intor-translator/translator-methods/create-has-key",
);

describe("createScoped", () => {
  const mockTranslate = jest.fn();
  const mockHasKey = jest.fn();

  const localeRef = { current: "en" };
  const translatorOptions = {
    messages: mockLocaleNamespaceMessages,
    fallbackLocales: {
      "en-US": ["zh-TW", "fr-FR"],
    },
  } as unknown as TranslatorOptions<LocaleNamespaceMessages>;

  beforeEach(() => {
    (createTranslate as jest.Mock).mockReturnValue(mockTranslate);
    (createHasKey as jest.Mock).mockReturnValue(mockHasKey);
    mockTranslate.mockClear();
    mockHasKey.mockClear();
  });

  it("calls translate with combined key", () => {
    const scoped = createScoped(localeRef, translatorOptions);
    const s = scoped("greeting");

    s.t("morning", { name: "Alice" });

    expect(mockTranslate).toHaveBeenCalledWith("greeting.morning", {
      name: "Alice",
    });
  });

  it("calls hasKey with combined key", () => {
    const scoped = createScoped(localeRef, translatorOptions);
    const s = scoped("greeting");

    s.hasKey("morning", "en");

    expect(mockHasKey).toHaveBeenCalledWith("greeting.morning", "en");
  });

  it("handles undefined preKey", () => {
    const scoped = createScoped(localeRef, translatorOptions);
    const s = scoped();

    s.t("simple", {});

    expect(mockTranslate).toHaveBeenCalledWith("simple", {});
  });

  it("handles undefined key", () => {
    const scoped = createScoped(localeRef, translatorOptions);
    const s = scoped("greeting");

    s.t(undefined, {});

    expect(mockTranslate).toHaveBeenCalledWith("greeting", {});
  });
});
