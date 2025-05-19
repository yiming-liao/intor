import type { NestedKeyPaths, RawLocale } from "./locale-types";
import type { TranslatorHandlers } from "./translator-handlers-types";
import type {
  FallbackLocalesMap,
  LocaleNamespaceMessages,
} from "../../../types/message-structure-types";
import type { GetLocale } from "../translator-methods/create-get-locale";
import type { GetMessages } from "../translator-methods/create-get-messages";
import type { HasKey } from "../translator-methods/create-has-key";
import type { SetLocale } from "../translator-methods/create-set-locale";
import type {
  Translate,
  UntypedTranslate,
} from "../translator-methods/create-translate";

/**
 * - Options for creating a translator instance.
 *
 * @example
 * ```ts
 * const options: TranslatorOptions = {
 *   locale: 'en',
 *   messages: {
 *     en: { common: { hello: "Hello" } },
 *     zh: { common: { hello: "你好" } },
 *   },
 *   fallbackLocales: { zh: ['en'] },
 *   handlers: {
 *     messageFormatter: ({ message }) => message.toUpperCase(),
 *   },
 * };
 * ```
 */
export type TranslatorOptions<Messages extends LocaleNamespaceMessages> = {
  /**
   * - The message definitions to be used by the translator.
   * - These should be pre-loaded and structured by locale and namespace.
   */
  messages: Readonly<Messages>;

  /**
   * - The current active locale, e.g., "en" or "zh-TW".
   */
  locale: RawLocale<Messages>;

  /**
   * - Optional fallback locale(s) to use when a message is missing in the primary locale.
   */
  fallbackLocales?: FallbackLocalesMap;

  /**
   * - Whether the translator is currently in a loading state.
   * - Useful for SSR or async loading scenarios.
   */
  isLoading?: boolean;

  /**
   * - The message string to return while in loading state.
   * - Will be overridden if you provide a `loadingMessageHandler` in handlers.
   */
  loadingMessage?: string;

  /**
   * - A fallback string to show when the message key is missing.
   * - Will be overridden if you provide a `placeholderHandler` in handlers.
   */
  placeholder?: string;

  /**
   * - Optional handlers to customize translation behavior (formatting, placeholders, etc).
   */
  handlers?: TranslatorHandlers;
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
    t: UntypedTranslate;
    hasKey: HasKey<Messages>;
  };
};
