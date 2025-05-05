import type {
  NestedKeyPaths,
  RawLocale,
} from "@/intor/core/intor-translator/types/locale-types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";

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
