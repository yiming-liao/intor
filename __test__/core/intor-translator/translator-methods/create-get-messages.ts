import type { TranslatorOptions } from "@/intor/core/intor-translator/types/intor-translator-types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";

export type GetMessages = () => Readonly<LocaleNamespaceMessages>;

export const createGetMessages = <Messages extends LocaleNamespaceMessages>(
  translatorOptions: TranslatorOptions<Messages>,
): GetMessages => {
  const { messages } = translatorOptions;

  const getMessages = () => messages;

  return getMessages;
};
