import type { TranslatorOptions } from "@/intor/core/intor-translator/types/intor-translator.types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";
import { intorTranslator } from "@/intor/core/intor-translator/intor-translator";
import * as createGetLocaleModule from "@/intor/core/intor-translator/translator-methods/create-get-locale";
import * as createGetMessagesModule from "@/intor/core/intor-translator/translator-methods/create-get-messages";
import * as createHasKeyModule from "@/intor/core/intor-translator/translator-methods/create-has-key";
import * as createScopedModule from "@/intor/core/intor-translator/translator-methods/create-scoped";
import * as createSetLocaleModule from "@/intor/core/intor-translator/translator-methods/create-set-locale";
import * as createTranslateModule from "@/intor/core/intor-translator/translator-methods/create-translate";

jest.mock("@/intor/core/intor-translator/translator-methods/create-get-locale");
jest.mock("@/intor/core/intor-translator/translator-methods/create-set-locale");
jest.mock(
  "@/intor/core/intor-translator/translator-methods/create-get-messages",
);
jest.mock("@/intor/core/intor-translator/translator-methods/create-has-key");
jest.mock("@/intor/core/intor-translator/translator-methods/create-translate");
jest.mock("@/intor/core/intor-translator/translator-methods/create-scoped");

describe("intorTranslator", () => {
  const translatorOptions = {
    locale: "en",
    messages: { en: { hello: "Hi" } },
  } as unknown as TranslatorOptions<LocaleNamespaceMessages>;

  beforeEach(() => {
    jest.clearAllMocks();
    (createGetLocaleModule.createGetLocale as jest.Mock).mockReturnValue(
      "getLocale",
    );
    (createSetLocaleModule.createSetLocale as jest.Mock).mockReturnValue(
      "setLocale",
    );
    (createGetMessagesModule.createGetMessages as jest.Mock).mockReturnValue(
      "getMessages",
    );
    (createHasKeyModule.createHasKey as jest.Mock).mockReturnValue("hasKey");
    (createTranslateModule.createTranslate as jest.Mock).mockReturnValue("t");
    (createScopedModule.createScoped as jest.Mock).mockReturnValue("scoped");
  });

  it("returns a translator object with all methods", () => {
    const translator = intorTranslator(translatorOptions);

    expect(translator).toEqual({
      getLocale: "getLocale",
      setLocale: "setLocale",
      getMessages: "getMessages",
      hasKey: "hasKey",
      t: "t",
      scoped: "scoped",
    });
  });
});
