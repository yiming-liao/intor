import type { GetLocale } from "@/intor/core/intor-translator/translator-methods/create-get-locale";
import type { GetMessages } from "@/intor/core/intor-translator/translator-methods/create-get-messages";
import type { HasKey } from "@/intor/core/intor-translator/translator-methods/create-has-key";
import type { SetLocale } from "@/intor/core/intor-translator/translator-methods/create-set-locale";
import type { Translate } from "@/intor/core/intor-translator/translator-methods/create-translate";
import type {
  NestedKeyPaths,
  RawLocale,
} from "@/intor/core/intor-translator/types/locale-types";
import type { TranslatorHandlers } from "@/intor/core/intor-translator/types/translator-handlers-types";
import type {
  FallbackLocalesMap,
  LocaleNamespaceMessages,
} from "@/intor/types/message-structure-types";

export type TranslatorOptions<Messages extends LocaleNamespaceMessages> = {
  messages: Readonly<Messages>;
  locale: RawLocale<Messages>;
  fallbackLocales: FallbackLocalesMap;
  isLoading?: boolean;
  loadingMessage: string;
  placeholder?: string;
  handlers?: TranslatorHandlers;
  debugHandler?: (key: string, locale: string) => void;
};

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
    t: Translate<Messages>;
    hasKey: HasKey<Messages>;
  };
};

// Ref of current locale
export type LocaleRef<Messages extends LocaleNamespaceMessages> = {
  current: RawLocale<Messages>;
};
