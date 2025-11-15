import type {
  IfGen,
  GenConfigKeys,
  GenMessages,
} from "@/shared/types/generated.types";
import type {
  TranslatorInstance,
  TranslatorBaseProps,
  TranslatorClientProps,
} from "@/shared/types/translator-instance.types";
import type { LocalizedNodeKeys } from "intor-translator";
import { useLocale } from "@/adapters/next/contexts/locale";
import { useTranslator as useTranslatorContext } from "@/adapters/next/contexts/translator";

/**
 * React hook to access a ready-to-use translator instance in the client.
 *
 * - Provides `t`, `hasKey`, `messages`, `locale`, `isLoading` and `setLocale`.
 * - Supports optional `preKey` to create a scoped translator for nested keys.
 * - Can accept a generic type parameter `M` to strongly type your messages.
 */

// Signature: Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
>(): TranslatorInstance<GenMessages<CK>>;

// Signature: With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(preKey: IfGen<PK, string>): TranslatorInstance<GenMessages<CK>, PK>;

// Implementation
export function useTranslator(preKey?: string) {
  const { translator } = useTranslatorContext();
  const { setLocale } = useLocale();

  const props: TranslatorBaseProps & TranslatorClientProps = {
    messages: translator.messages,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
  };

  const scoped = translator.scoped(preKey);
  return {
    ...props,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
  };
}
