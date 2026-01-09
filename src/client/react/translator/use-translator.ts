import type { TranslatorInstanceReact } from "./translator-instance";
import type { IfGen, GenConfigKeys, GenMessages, GenLocale } from "@/core";
import type { LocalizedNodeKeys } from "intor-translator";
import { useIntor } from "../provider";
import { createTRich } from "./create-t-rich";

/**
 * React hook to access the active translator instance.
 */

// Signature: Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
>(): TranslatorInstanceReact<GenMessages<CK>, undefined>;

// Signature: With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(preKey: IfGen<PK, string>): TranslatorInstanceReact<GenMessages<CK>, PK>;

// Implementation
export function useTranslator<CK extends GenConfigKeys = "__default__">(
  preKey?: string,
) {
  const { translator, setLocale } = useIntor();

  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages as GenMessages<CK>,
    locale: translator.locale as GenLocale<CK>,
    isLoading: translator.isLoading,
    setLocale,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
    tRich: createTRich(translator, preKey),
  };
}
