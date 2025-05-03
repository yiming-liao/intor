import type {
  LocaleRef,
  TranslatorOptions,
} from "@/intor/core/intor-translator/types/intor-translator.types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";
import { createHasKey } from "@/intor/core/intor-translator/translator-methods/create-has-key";
import { mockLocaleNamespaceMessages } from "test/mock/locale-namespace-messages.mock";

jest.mock("@/intor/core/intor-translator/utils/get-value-by-key", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValueByKey: (obj: any, key: string) => {
    return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  },
}));

jest.mock("@/intor/core/intor-translator/utils/resolve-locales-to-try", () => ({
  resolveLocalesToTry: (
    locale: string,
    fallbacks: Record<string, string[]>,
  ) => {
    return [locale, ...(fallbacks[locale] || [])];
  },
}));

describe("createHasKey", () => {
  let localeRef: LocaleRef<LocaleNamespaceMessages>;
  let translatorOptions: TranslatorOptions<LocaleNamespaceMessages>;

  beforeEach(() => {
    localeRef = { current: "en-US" };
    translatorOptions = {
      messages: mockLocaleNamespaceMessages,
      fallbackLocales: {
        "en-US": ["zh-TW", "fr-FR"],
      },
    } as unknown as TranslatorOptions<LocaleNamespaceMessages>;
  });

  it("should return true if key exists in the current locale", () => {
    const hasKey = createHasKey(localeRef, translatorOptions);
    expect(hasKey("common.ok")).toBe(true);
  });

  it("should return true if key does not exist in current locale but exists in fallback", () => {
    localeRef.current = "en-US";
    const hasKey = createHasKey(localeRef, translatorOptions);
    expect(hasKey("test.non-exist-in-en-us")).toBe(true);
  });

  it("should return false if key does not exist in any locale", () => {
    const hasKey = createHasKey(localeRef, translatorOptions);
    expect(hasKey("common.goodbye")).toBe(false);
  });

  it("should return false if given an invalid locale", () => {
    const hasKey = createHasKey(localeRef, translatorOptions);
    expect(hasKey("common.hello", "en-UK")).toBe(false);
  });

  it("should use provided locale if specified", () => {
    const hasKey = createHasKey(localeRef, translatorOptions);
    expect(hasKey("test.non-exist-in-en-us", "zh-TW")).toBe(false);
    expect(hasKey("test.non-exist-in-en-us", "fr-FR")).toBe(true);
  });
});
