import type { SvelteTranslator } from "./types";
import type {
  TypedConfigKeys,
  TypedMessages,
  TypedReplacements,
  TypedRich,
} from "../../../core";
import type { LocalizedPreKey } from "intor-translator";
import { derived } from "svelte/store";
import { createTRich } from "../../../core";
import { getIntorContext } from "../provider";

/**
 * Svelte utility for accessing the active, scope-aware translator instance.
 *
 * @public
 */
export function useTranslator<
  CK extends TypedConfigKeys = "__default__",
  ReplacementShape = TypedReplacements<CK>,
  RichShape = TypedRich<CK>,
  PK extends LocalizedPreKey<TypedMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): SvelteTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK> {
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
  } as SvelteTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK>;
}
