import type { TranslatorInstanceVue } from "@/client/vue/translator/translator-instance";
import type { IfGen, GenConfigKeys, GenMessages } from "@/core";
import type { LocalizedNodeKeys } from "intor-translator";
import { computed } from "vue";
import { injectIntor } from "@/client/vue/provider";
import { createTRich } from "@/client/vue/translator/create-t-rich";

/**
 * Vue composable to access the active translator instance.
 */

// Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
>(): TranslatorInstanceVue<GenMessages<CK>>;

// With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(preKey: IfGen<PK, string>): TranslatorInstanceVue<GenMessages<CK>, PK>;

// Implementation
export function useTranslator(preKey?: string) {
  const intor = injectIntor();

  const translator = computed(() => intor.value.translator);
  const scoped = computed(() =>
    preKey ? translator.value.scoped(preKey) : translator.value,
  );

  const hasKey = computed(() => scoped.value.hasKey);
  const t = computed(() => scoped.value.t);

  return {
    messages: computed(() => translator.value.messages),
    locale: computed(() => translator.value.locale),
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
