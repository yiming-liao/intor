import type { LocaleRef } from "@/intor/core/intor-translator/types/intor-translator.types";
import type { RawLocale } from "@/intor/types/message-structure-types";
import type { MockLocaleNamespaceMessages } from "test/mock/locale-namespace-messages.mock";
import { createGetLocale } from "@/intor/core/intor-translator/translator-methods/create-get-locale";

describe("createGetLocale", () => {
  it("should return the current locale from localeRef", () => {
    const mockLocaleRef: LocaleRef<MockLocaleNamespaceMessages> = {
      current: "en" as RawLocale<MockLocaleNamespaceMessages>,
    };

    const getLocale = createGetLocale(mockLocaleRef);

    expect(getLocale()).toBe("en");

    mockLocaleRef.current = "fr" as RawLocale<MockLocaleNamespaceMessages>;

    expect(getLocale()).toBe("fr");
  });
});
