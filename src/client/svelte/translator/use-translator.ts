import type { TranslatorInstanceSvelte } from "./translator-instance";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "@/core";
import type { LocalizedPreKey } from "intor-translator";
import { derived } from "svelte/store";
import { useIntorContext } from "../provider";
import { createTRich } from "./create-t-rich";

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

  const scoped = preKey
    ? derived(translator, ($t) => $t.scoped(preKey))
    : translator;

  return {
    messages: derived(translator, ($t) => $t.messages),
    locale,
    isLoading: derived(translator, ($t) => $t.isLoading),
    setLocale,
    hasKey: derived(scoped, ($t) => $t.hasKey),
    t: derived(scoped, ($t) => $t.t),
    tRich: derived(translator, ($t) => createTRich($t, preKey)),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
