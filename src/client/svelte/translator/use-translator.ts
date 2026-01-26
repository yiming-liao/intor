import type { TranslatorInstanceSvelte } from "./translator-instance";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "@/core";
import type { LocalizedPreKey } from "intor-translator";
import { derived } from "svelte/store";
import { createTRich } from "@/core";
import { useIntorContext } from "../provider";

/**
 * Svelte utility for accessing the active Intor translator instance.
 */

// Signature: Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
>(): TranslatorInstanceSvelte<
  GenMessages<CK>,
  ReplacementSchema,
  RichSchema,
  undefined
>;

// Signature: With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  preKey?: PK,
): TranslatorInstanceSvelte<GenMessages<CK>, ReplacementSchema, RichSchema, PK>;

// Implementation
export function useTranslator(preKey?: string) {
  const { translator, locale, setLocale } = useIntorContext();
  const scoped = derived(translator, ($t) => $t.scoped(preKey));

  return {
    messages: derived(translator, ($t) => $t.messages),
    locale,
    isLoading: derived(translator, ($t) => $t.isLoading),
    setLocale,
    hasKey: derived(scoped, ($t) => $t.hasKey),
    t: derived(scoped, ($t) => $t.t),
    tRich: derived(scoped, ($t) => createTRich($t.t)),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
