import type {
  LocaleNamespaceMessages,
  MessageRecord,
} from "../../../../src/intor/types/message-structure-types";
import { createGetMessages } from "../../../../src/intor/core/intor-translator/translator-methods/create-get-messages";
import { TranslatorOptions } from "../../../../src/intor/core/intor-translator/types/intor-translator-options-types";
import { mockLocaleNamespaceMessages } from "../../../mock/mock-locale-namespace-messages";

describe("createGetMessages", () => {
  it("should return the messages provided in translatorOptions", () => {
    const translatorOptions: TranslatorOptions<LocaleNamespaceMessages> = {
      messages: mockLocaleNamespaceMessages,
      locale: "en",
      fallbackLocales: {},
      loadingMessage: "...",
    };

    const getMessages = createGetMessages(translatorOptions);
    const result = getMessages();

    expect(result).toBe(mockLocaleNamespaceMessages);

    expect((result["en-US"].common as MessageRecord).ok).toBe("OK");
    expect((result["zh-TW"].profile as MessageRecord).greeting).toBe(
      "你好，{name}！",
    );
  });
});
