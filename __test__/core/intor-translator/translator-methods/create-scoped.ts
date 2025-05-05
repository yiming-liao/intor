import type { HasKey } from "@/intor/core/intor-translator/translator-methods/create-has-key";
import type { Translate } from "@/intor/core/intor-translator/translator-methods/create-translate";
import type {
  LocaleRef,
  TranslatorOptions,
} from "@/intor/core/intor-translator/types/intor-translator-types";
import type {
  NestedKeyPaths,
  RawLocale,
} from "@/intor/core/intor-translator/types/locale-types";
import type {
  LocaleNamespaceMessages,
  Replacement,
} from "@/intor/types/message-structure-types";
import { createHasKey } from "@/intor/core/intor-translator/translator-methods/create-has-key";
import { createTranslate } from "@/intor/core/intor-translator/translator-methods/create-translate";
import { getFullKey } from "@/intor/core/intor-translator/utils/get-full-key";

export type Scoped<Messages extends LocaleNamespaceMessages> = <
  Locale extends RawLocale<Messages>,
>(
  preKey?: NestedKeyPaths<Messages[Locale]>,
) => {
  t: Translate<Messages>;
  hasKey: HasKey<Messages>;
};

export const createScoped = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
  translatorOptions: TranslatorOptions<Messages>,
) => {
  const t = createTranslate<Messages>(localeRef, translatorOptions);
  const hasKey = createHasKey<Messages>(localeRef, translatorOptions);

  const scoped = <Locale extends RawLocale<Messages>>(
    preKey?: NestedKeyPaths<Messages[Locale]>,
  ): ReturnType<Scoped<Messages>> => {
    return {
      // t (Scoped)
      t: (
        key?: NestedKeyPaths<Messages[Locale]>,
        replacements?: Replacement,
      ): string => {
        const fullKey = getFullKey(preKey, key);
        return t(fullKey, replacements);
      },

      // hasKey (Scoped)
      hasKey: <Locale extends RawLocale<Messages>>(
        key?: NestedKeyPaths<Messages[Locale]>,
        locale?: Locale,
      ): boolean => {
        const fullKey = getFullKey(preKey, key);
        return hasKey(
          fullKey as unknown as NestedKeyPaths<Messages[Locale]>,
          locale,
        );
      },
    };
  };

  return scoped;
};
