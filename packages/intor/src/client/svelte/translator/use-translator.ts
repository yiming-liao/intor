import type { SvelteTranslator } from "./types";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  TranslatorKeyMode,
} from "../../../core";
import type { IntlFormatter, LocalizedPreKey } from "intor-translator";
import { derived, get } from "svelte/store";
import { createTRich } from "../../../core";
import { getIntorContext } from "../provider";

/**
 * Svelte utility for accessing the active, scope-aware translator instance.
 *
 * @public
 */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
>(): SvelteTranslator<
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
): SvelteTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>;

/** @public */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): SvelteTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM> {
  const { translator, locale, setLocale } = getIntorContext();
  const scoped = derived(translator, ($t) => $t.scoped(preKey));

  const format: IntlFormatter = {
    number: (v, o) => get(scoped).format.number(v, o),
    currency: (v, currency, o) => get(scoped).format.currency(v, currency, o),
    date: (v, o) => get(scoped).format.date(v, o),
    relativeTime: (v, unit, o) => get(scoped).format.relativeTime(v, unit, o),
    list: (vs, o) => get(scoped).format.list(vs, o),
    displayName: (v, o) => get(scoped).format.displayName(v, o),
    plural: (vs, o) => get(scoped).format.plural(vs, o),
  };

  return {
    messages: derived(translator, ($t) => $t.messages),
    locale,
    isLoading: derived(translator, ($t) => $t.isLoading),
    setLocale,
    hasKey: derived(scoped, ($t) => $t.hasKey),
    t: derived(scoped, ($t) => $t.t),
    tRich: derived(scoped, ($t) => createTRich($t.t)),
    format,
  } as SvelteTranslator<
    GenMessages<CK>,
    GenReplacements<CK>,
    GenRich<CK>,
    PK,
    KM
  >;
}
