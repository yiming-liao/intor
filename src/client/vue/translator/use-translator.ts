import type { TranslatorInstanceVue } from "@/client/vue/translator/translator-instance";
import type { IfGen, GenConfigKeys, GenMessages } from "@/core/types/generated";
import type { LocalizedNodeKeys } from "intor-translator";
import { computed } from "vue";
import { injectLocale } from "@/client/vue/contexts/locale";
import { injectTranslator } from "@/client/vue/contexts/translator";
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
  const translatorRef = injectTranslator();
  const localeRef = injectLocale();

  const translator = computed(() => translatorRef.value.translator);
  const scoped = computed(() =>
    preKey ? translator.value.scoped(preKey) : translator.value,
  );

  const t = computed(() => scoped.value.t);
  const hasKey = computed(() => scoped.value.hasKey);

  return {
    messages: computed(() => translator.value.messages),
    locale: computed(() => translator.value.locale),
    isLoading: computed(() => translator.value.isLoading),
    setLocale: localeRef.value.setLocale,
    hasKey,
    t,
    tRich: createTRich(translator, preKey),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
