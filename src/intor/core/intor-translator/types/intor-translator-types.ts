import type { GetLocale } from "../../../core/intor-translator/translator-methods/create-get-locale";
import type { GetMessages } from "../../../core/intor-translator/translator-methods/create-get-messages";
import type { HasKey } from "../../../core/intor-translator/translator-methods/create-has-key";
import type { SetLocale } from "../../../core/intor-translator/translator-methods/create-set-locale";
import type {
  Translate,
  UntypedTranslate,
} from "../../../core/intor-translator/translator-methods/create-translate";
import type {
  NestedKeyPaths,
  RawLocale,
} from "../../../core/intor-translator/types/locale-types";
import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";

export type Translator<
  Messages extends LocaleNamespaceMessages = LocaleNamespaceMessages,
> = {
  getLocale: GetLocale<Messages>;
  setLocale: SetLocale<Messages>;
  getMessages: GetMessages;

  t: Translate<Messages>;
  hasKey: HasKey<Messages>;

  // Scoped with preKey
  scoped: <Locale extends RawLocale<Messages>>(
    preKey?: NestedKeyPaths<Messages[Locale]>,
  ) => {
    t: UntypedTranslate;
    hasKey: HasKey<Messages>;
  };
};
