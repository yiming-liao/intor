import type { VueTagRenderers } from "@/client/vue/render";
import type { TranslatorInstance } from "@/core";
import type { ComputedRef, VNodeChild } from "vue";
import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type LocalizedReplacement,
  type Replacement,
  type ScopedKey,
} from "intor-translator";

export type TranslatorInstanceVue<
  M extends LocaleMessages,
  ReplacementSchema = unknown,
  PK extends string | undefined = undefined,
> = TranslatorInstance<M, ReplacementSchema, PK> & {
  /** `messages`: The message object containing all translations. */
  messages: ComputedRef<M>;

  /** Current locale in use. */
  locale: ComputedRef<Locale<M>>;

  /** Indicates whether translations are currently loading. */
  isLoading: ComputedRef<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Translate a key into React nodes using semantic tags */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    R extends Replacement = LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: VueTagRenderers,
    replacements?: R | Replacement,
  ) => VNodeChild[];
};
