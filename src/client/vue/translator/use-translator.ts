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
    hasKey: (...args: Parameters<typeof scoped.value.hasKey>) =>
      scoped.value.hasKey(...args),
    t: (...args: Parameters<typeof scoped.value.t>) => scoped.value.t(...args),
    tRich: (...args: Parameters<ReturnType<typeof createTRich>>) =>
      createTRich(scoped.value.t)(...args),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
