import type { TranslatorInstanceReact } from "@/client/react/translator/translator-instance";
import type { IfGen, GenConfigKeys, GenMessages } from "@/core/types/generated";
import type { LocalizedNodeKeys } from "intor-translator";
import { useIntor } from "@/client/react/provider";
import { createTRich } from "@/client/react/translator/create-t-rich";

/**
 * React hook to access the active translator instance.
 */

// Signature: Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
>(): TranslatorInstanceReact<GenMessages<CK>>;

// Signature: With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(preKey: IfGen<PK, string>): TranslatorInstanceReact<GenMessages<CK>, PK>;

// Implementation
export function useTranslator(preKey?: string) {
  const { translator, setLocale } = useIntor();

  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
    tRich: createTRich(translator, preKey),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
