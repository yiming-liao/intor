import type { VueTagRenderers } from "@/client/vue/render";
import type { TranslatorInstance } from "@/core";
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
} from "intor-translator";

export type TranslatorInstanceVue<
  M extends LocaleMessages,
  ReplacementSchema = Replacement,
  RichSchema = Rich,
  PK extends string | undefined = undefined,
> = Omit<
  TranslatorInstance<M, ReplacementSchema, RichSchema, PK>,
  "tRich" | "messages" | "locale"
> & {
  /** `messages`: The message object containing all translations. */
  messages: ComputedRef<M>;

  /** Current locale in use. */
  locale: ComputedRef<Locale<M>>;

  /** Indicates whether translations are currently loading. */
  isLoading: ComputedRef<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Translate a key into VNodes using semantic tags */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = LocalizedRich<RichSchema, K>,
    RE = LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: VueTagRenderers<RI> | VueTagRenderers,
    replacements?: RE | Replacement,
  ) => VNodeChild[];
};
