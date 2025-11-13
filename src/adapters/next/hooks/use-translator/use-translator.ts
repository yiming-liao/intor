import { LocaleNamespaceMessages } from "intor-translator";
import { useLocale } from "@/adapters/next/contexts/locale";
import { useTranslator as useTranslatorContext } from "@/adapters/next/contexts/translator";
import {
  IfGen,
  GenConfigKeys,
  GenMessages,
} from "@/shared/types/generated.types";
import {
  ScopedTranslatorInstance,
  TranslatorBaseProps,
  TranslatorInstance,
  PreKey,
  TranslatorClientProps,
} from "@/shared/types/translator-instance.types";

/**
 * React hook to access a ready-to-use translator instance in the client.
 *
 * - Provides `t`, `hasKey`, `messages`, `locale`, `isLoading` and `setLocale`.
 * - Supports optional `preKey` to create a scoped translator for nested keys.
 * - Can accept a generic type parameter `M` to strongly type your messages.
 */

// Signature: Without preKey
export function useTranslator<
  C extends GenConfigKeys = "__default__",
>(): TranslatorInstance<GenMessages<C>>;

// Signature: With preKey
export function useTranslator<
  C extends GenConfigKeys = "__default__",
  K extends PreKey<C> = PreKey<C>,
>(preKey: IfGen<K, string>): ScopedTranslatorInstance<GenMessages<C>, K>;

// Implementation
export function useTranslator(preKey?: string) {
  const { translator } = useTranslatorContext<LocaleNamespaceMessages>();
  const { setLocale } = useLocale();

  const props: TranslatorBaseProps<LocaleNamespaceMessages> &
    TranslatorClientProps<LocaleNamespaceMessages> = {
    messages: translator.messages as LocaleNamespaceMessages,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
  };

  if (preKey) {
    const { hasKey, t } = translator.scoped(preKey);
    return { ...props, hasKey, t };
  } else {
    const { hasKey, t } = translator;
    return { ...props, hasKey, t };
  }
}
