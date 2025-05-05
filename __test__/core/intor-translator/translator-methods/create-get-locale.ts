import type { LocaleRef } from "@/intor/core/intor-translator/types/intor-translator-types";
import type { RawLocale } from "@/intor/core/intor-translator/types/locale-types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";

export type GetLocale<Messages extends LocaleNamespaceMessages> =
  () => RawLocale<Messages>;

export const createGetLocale = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
): GetLocale<Messages> => {
  const getLocale = () => localeRef.current;

  return getLocale;
};
