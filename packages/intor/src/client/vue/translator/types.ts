import type { BaseTranslator } from "../../../core";
import type { VueTagRenderers } from "../render";
import type { ComputedRef, VNodeChild } from "vue";
import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type LocalizedReplacement,
  type LocalizedRich,
  type Replacement,
  type Rich,
  type ScopedKey,
  type ScopedReplacement,
  type ScopedRich,
} from "intor-translator";

/**
 * Vue-specific translator interface.
 *
 * Extends `BaseTranslator` with runtime state
 * and rich message rendering tailored for Vue.
 *
 * @public
 */
export type VueTranslator<
  M extends LocaleMessages,
  ReplacementShape = Replacement,
  RichShape = Rich,
  PK extends string | undefined = undefined,
> = Omit<
  BaseTranslator<M, ReplacementShape, RichShape, PK>,
  "tRich" | "messages" | "locale"
> & {
  /** Localized message map. */
  messages: ComputedRef<M>;

  /** Active locale. */
  locale: ComputedRef<Locale<M>>;

  /** Whether translations are loading. */
  isLoading: ComputedRef<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Resolve a localized value and render it as Vue nodes. */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = PK extends string
      ? ScopedRich<RichShape, PK, K>
      : LocalizedRich<RichShape, K>,
    RE = PK extends string
      ? ScopedReplacement<ReplacementShape, PK, K>
      : LocalizedReplacement<ReplacementShape, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: VueTagRenderers<RI> | VueTagRenderers,
    replacements?: RE | Replacement,
  ) => VNodeChild[];
};
