import type {
  Locale,
  LocaleNamespaceMessages,
  Replacement,
  RichReplacement,
} from "../../../types/message-structure-types";
import type { UntypedHasKey } from "../translator-methods/create-has-key";
import type { UntypedTranslate } from "../translator-methods/create-translate";
import type {
  LocaleRef,
  NestedKeyPaths,
  RawLocale,
} from "../types/locale-types";
import { createHasKey } from "../translator-methods/create-has-key";
import { createTranslate } from "../translator-methods/create-translate";
import { TranslatorOptions } from "../types/intor-translator-options-types";
import { getFullKey } from "../utils/get-full-key";

export type Scoped<Messages extends LocaleNamespaceMessages> = <
  Locale extends RawLocale<Messages>,
>(
  preKey?: NestedKeyPaths<Messages[Locale]>,
) => {
  t: UntypedTranslate;
  hasKey: UntypedHasKey;
};

export const createScoped = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
  translatorOptions: TranslatorOptions<Messages>,
) => {
  const t = createTranslate<Messages>(localeRef, translatorOptions);
  const hasKey = createHasKey<Messages>(localeRef, translatorOptions);

  const scoped = <L extends RawLocale<Messages>>(
    preKey?: NestedKeyPaths<Messages[L]>,
  ): ReturnType<Scoped<Messages>> => {
    return {
      // t (Scoped)
      t: (
        key?: string,
        replacements?: Replacement | RichReplacement,
      ): string => {
        const fullKey = getFullKey(preKey, key);
        return t(fullKey, replacements);
      },

      // hasKey (Scoped)
      hasKey: (key?: string, locale?: Locale): boolean => {
        const fullKey = getFullKey(preKey, key);
        return hasKey(fullKey, locale);
      },
    };
  };

  return scoped;
};
