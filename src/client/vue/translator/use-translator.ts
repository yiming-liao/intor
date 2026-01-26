import type { TranslatorInstanceVue } from "./translator-instance";
import type {
  GenConfigKeys,
  GenMessages,
  GenLocale,
  GenReplacements,
  GenRich,
} from "@/core";
import type { LocalizedPreKey } from "intor-translator";
import { computed } from "vue";
import { injectIntor } from "..//provider";
import { createTRich } from "./create-t-rich";

/**
 * Vue composable to access the active translator instance.
 */

// Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
>(): TranslatorInstanceVue<
  GenMessages<CK>,
  ReplacementSchema,
  RichSchema,
  undefined
>;

// With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  preKey?: PK,
): TranslatorInstanceVue<GenMessages<CK>, ReplacementSchema, RichSchema, PK>;

// Implementation
export function useTranslator<CK extends GenConfigKeys = "__default__">(
  preKey?: string,
) {
  const intor = injectIntor();
  const translator = intor.value.translator;
  const scoped = computed(() => translator.value.scoped(preKey));

  return {
    messages: computed(() => translator.value.messages as GenMessages<CK>),
    locale: computed(() => translator.value.locale as GenLocale<CK>),
    isLoading: computed(() => translator.value.isLoading),
    setLocale: intor.value.setLocale,
    hasKey: computed(() => scoped.value.hasKey),
    t: computed(() => scoped.value.t),
    tRich: computed(() => createTRich(scoped.value.t)),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
