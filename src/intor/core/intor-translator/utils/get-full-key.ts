import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import type { NestedKeyPaths, RawLocale } from "../types/locale-types";

export const getFullKey = <
  Messages extends LocaleNamespaceMessages,
  Locale extends RawLocale<Messages>,
>(
  preKey?: NestedKeyPaths<Messages[Locale]>,
  key?: NestedKeyPaths<Messages[Locale]>,
): NestedKeyPaths<Messages[Locale]> => {
  if (!preKey) {
    return key as NestedKeyPaths<Messages[Locale]>;
  }

  if (!key) {
    return preKey;
  }

  return `${preKey}.${key}` as NestedKeyPaths<Messages[Locale]>;
};
