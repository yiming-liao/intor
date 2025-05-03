import type {
  LocaleRef,
  TranslatorOptions,
} from "@/intor/core/intor-translator/types/intor-translator.types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";
import { createSetLocale } from "@/intor/core/intor-translator/translator-methods/create-set-locale";
import { mockLocaleNamespaceMessages } from "test/mock/locale-namespace-messages.mock";

describe("createSetLocale", () => {
  type Messages = LocaleNamespaceMessages;

  let localeRef: LocaleRef<Messages>;
  let translatorOptions: TranslatorOptions<Messages>;

  beforeEach(() => {
    localeRef = { current: "en-US" };
    translatorOptions = {
      messages: mockLocaleNamespaceMessages,
    } as unknown as TranslatorOptions<LocaleNamespaceMessages>;
  });

  it("should update localeRef.current when setting to a valid locale", () => {
    const setLocale = createSetLocale(localeRef, translatorOptions);
    setLocale("zh-TW");
    expect(localeRef.current).toBe("zh-TW");
  });

  it("should not update localeRef.current when setting to an invalid locale", () => {
    const setLocale = createSetLocale(localeRef, translatorOptions);
    setLocale("jp");
    expect(localeRef.current).toBe("en-US");
  });

  it("should return the same setLocale function instance", () => {
    const setLocale1 = createSetLocale(localeRef, translatorOptions);
    const setLocale2 = createSetLocale(localeRef, translatorOptions);
    expect(typeof setLocale1).toBe("function");
    expect(typeof setLocale2).toBe("function");
  });
});
