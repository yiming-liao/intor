import type { VueTranslator } from "./types";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  TranslatorKeyMode,
} from "../../../core";
import type { IntlFormatter, LocalizedPreKey } from "intor-translator";
import { computed } from "vue";
import { injectIntorContext } from "../provider";
import { createTRich } from "./create-t-rich";

/**
 * Vue composable for accessing the active, scope-aware translator instance.
 *
 * @public
 */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
>(): VueTranslator<
  GenMessages<CK>,
  GenReplacements<CK>,
  GenRich<CK>,
  undefined,
  KM
>;

/** @public */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> = LocalizedPreKey<
    GenMessages<CK>
  >,
>(
  preKey: PK,
): VueTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>;

/** @public */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): VueTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM> {
  const intor = injectIntorContext();
  const translator = intor.value.translator;
  const scoped = computed(() => translator.value.scoped(preKey));

  const format: IntlFormatter = {
    number: (v, o) => scoped.value.format.number(v, o),
    currency: (v, c, o) => scoped.value.format.currency(v, c, o),
    date: (v, o) => scoped.value.format.date(v, o),
    relativeTime: (v, u, o) => scoped.value.format.relativeTime(v, u, o),
    list: (vs, o) => scoped.value.format.list(vs, o),
    displayName: (v, o) => scoped.value.format.displayName(v, o),
    plural: (vs, o) => scoped.value.format.plural(vs, o),
  };

  return {
    messages: computed(() => translator.value.messages),
    locale: computed(() => translator.value.locale),
    isLoading: computed(() => translator.value.isLoading),
    setLocale: intor.value.setLocale,
    hasKey: (...args: Parameters<typeof scoped.value.hasKey>) =>
      scoped.value.hasKey(...args),
    t: (...args: Parameters<typeof scoped.value.t>) => scoped.value.t(...args),
    tRich: (...args: Parameters<ReturnType<typeof createTRich>>) =>
      createTRich(scoped.value.t)(...args),
    format,
  } as VueTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>;
}
