import type { LocaleRef } from "../../../../src/intor/core/intor-translator/types/intor-translator-types";
import type { RawLocale } from "../../../../src/intor/core/intor-translator/types/locale-types";
import { createGetLocale } from "../../../../src/intor/core/intor-translator/translator-methods/create-get-locale";
import { MockLocaleNamespaceMessages } from "../../../mock/mock-locale-namespace-messages";

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
