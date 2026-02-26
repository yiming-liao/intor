import type { SvelteTranslator } from "./types";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "../../../core";
import type { LocalizedPreKey } from "intor-translator";
import { derived } from "svelte/store";
import { createTRich } from "../../../core";
import { getIntorContext } from "../provider";

/**
 * Svelte utility for accessing the active, scope-aware translator instance.
 *
 * @platform Svelte
 */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): SvelteTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK> {
  const { translator, locale, setLocale } = getIntorContext();
  const scoped = derived(translator, ($t) => $t.scoped(preKey));

  return {
    messages: derived(translator, ($t) => $t.messages),
    locale,
    isLoading: derived(translator, ($t) => $t.isLoading),
    setLocale,
    hasKey: derived(scoped, ($t) => $t.hasKey),
    t: derived(scoped, ($t) => $t.t),
    tRich: derived(scoped, ($t) => createTRich($t.t)),
  } as unknown as SvelteTranslator<
    GenMessages<CK>,
    ReplacementShape,
    RichShape,
    PK
  >;
}
