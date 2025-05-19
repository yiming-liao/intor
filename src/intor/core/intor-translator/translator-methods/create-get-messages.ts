import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import type { TranslatorOptions } from "../types/intor-translator-options-types";

export type GetMessages = () => Readonly<LocaleNamespaceMessages>;

export const createGetMessages = <Messages extends LocaleNamespaceMessages>(
  translatorOptions: TranslatorOptions<Messages>,
): GetMessages => {
  const { messages } = translatorOptions;

  const getMessages = () => messages;

  return getMessages;
};
