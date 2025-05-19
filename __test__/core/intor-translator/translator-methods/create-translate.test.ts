import type { LocaleNamespaceMessages } from "../../../../src/intor/types/message-structure-types";
import { createTranslate } from "../../../../src/intor/core/intor-translator/translator-methods/create-translate";
import { LocaleRef } from "../../../../src/intor/core/intor-translator/types/locale-types";
import { mockLocaleNamespaceMessages } from "../../../mock/mock-locale-namespace-messages";

describe("createTranslate", () => {
  const localeRef: LocaleRef<LocaleNamespaceMessages> = { current: "en-US" };

  const translatorOptions = {
    messages: mockLocaleNamespaceMessages,
    locale: "en",
    fallbackLocales: { "en-US": ["zh-TW", "fr-FR"] },
    isLoading: false,
    loadingMessage: "Loading...",
    placeholder: "N/A",
    handlers: {
      messageFormatter: undefined,
      loadingMessageHandler: undefined,
      placeholderHandler: undefined,
    },
  };

  const t = createTranslate(localeRef, translatorOptions);

  it("should translate an existing key", () => {
    expect(t("common.cancel")).toBe("Cancel");
  });

  // Testing fallback locales: zh-TW -> fr-FR
  it("should return the correct message from fallback locales", () => {
    expect(t("test.non-exist-in-en-us")).toBe("This key only exists in fr-FR");
  });

  it("should return placeholder if key not found", () => {
    expect(t("common.unknown")).toBe("N/A");
  });

  it("should return loadingMessage when isLoading is true", () => {
    const loadingOptions = { ...translatorOptions, isLoading: true };
    const loadingT = createTranslate(localeRef, loadingOptions);
    expect(loadingT("common.unknown")).toBe("Loading...");
  });

  it("should replace placeholders when replacements provided", () => {
    expect(t("profile.greeting", { name: "Alice" })).toBe("Hello, Alice!");
  });

  it("should handle placeholderHandler when provided", () => {
    // Custom handler for missing keys
    const customPlaceholderHandler = jest.fn(() => "Custom Placeholder");
    const optionsWithHandler = {
      ...translatorOptions,
      handlers: {
        ...translatorOptions.handlers,
        placeholderHandler: customPlaceholderHandler,
      },
    };
    const customT = createTranslate(localeRef, optionsWithHandler);

    expect(customT("common.missing")).toBe("Custom Placeholder");
    expect(customPlaceholderHandler).toHaveBeenCalledWith({
      key: "common.missing",
      locale: "en-US",
      replacements: undefined,
    });
  });

  it("should handle loadingMessageHandler when isLoading is true", () => {
    const customLoadingMessageHandler = jest.fn(() => "Custom Loading...");
    const loadingOptions = {
      ...translatorOptions,
      isLoading: true,
      handlers: {
        ...translatorOptions.handlers,
        loadingMessageHandler: customLoadingMessageHandler,
      },
    };
    const loadingT = createTranslate(localeRef, loadingOptions);

    expect(loadingT("common.missing")).toBe("Custom Loading...");
    expect(customLoadingMessageHandler).toHaveBeenCalledWith({
      key: "common.missing",
      locale: "en-US",
      replacements: undefined,
    });
  });
});
