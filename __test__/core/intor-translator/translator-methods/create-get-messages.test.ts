import type { TranslatorOptions } from "@/intor/core/intor-translator/types/intor-translator.types";
import type {
  LocaleNamespaceMessages,
  MessageRecord,
} from "@/intor/types/message-structure-types";
import { createGetMessages } from "@/intor/core/intor-translator/translator-methods/create-get-messages";
import { mockLocaleNamespaceMessages } from "test/mock/locale-namespace-messages.mock";

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
