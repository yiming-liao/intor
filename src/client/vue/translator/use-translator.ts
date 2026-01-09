import type { TranslatorInstanceVue } from "./translator-instance";
import type { GenConfigKeys, GenMessages, GenLocale } from "@/core";
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
  ReplacementSchema = unknown,
>(): TranslatorInstanceVue<GenMessages<CK>, ReplacementSchema, undefined>;

// With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = unknown,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(preKey?: PK): TranslatorInstanceVue<GenMessages<CK>, ReplacementSchema, PK>;

// Implementation
export function useTranslator<CK extends GenConfigKeys = "__default__">(
  preKey?: string,
) {
  const intor = injectIntor();

  const translator = computed(() => intor.value.translator);
  const scoped = computed(() =>
    preKey ? translator.value.scoped(preKey) : translator.value,
  );

  const hasKey = computed(() => scoped.value.hasKey);
  const t = computed(() => scoped.value.t);

  return {
    messages: computed(() => translator.value.messages as GenMessages<CK>),
    locale: computed(() => translator.value.locale as GenLocale<CK>),
    isLoading: computed(() => translator.value.isLoading),
    setLocale: intor.value.setLocale,
    hasKey,
    t,
    tRich: createTRich(translator, preKey),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
