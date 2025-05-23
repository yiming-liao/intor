import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import type { LocaleRef, RawLocale } from "../types/locale-types";

export type GetLocale<Messages extends LocaleNamespaceMessages> =
  () => RawLocale<Messages>;

export const createGetLocale = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
): GetLocale<Messages> => {
  const getLocale = () => localeRef.current;

  return getLocale;
};
