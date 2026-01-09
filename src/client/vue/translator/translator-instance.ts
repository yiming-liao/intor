import type { VueTagRenderers } from "@/client/vue/render";
import type { KeyMode, Key, TranslatorInstance } from "@/core";
import type { ComputedRef, VNodeChild } from "vue";
import {
  type Locale,
  type LocaleMessages,
  type Replacement,
} from "intor-translator";

export type TranslatorInstanceVue<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = TranslatorInstance<M, PK, Mode> & {
  /** `messages`: The message object containing all translations. */
  messages: ComputedRef<M>;

  /** Current locale in use. */
  locale: ComputedRef<Locale<M>>;

  /** Indicates whether translations are currently loading. */
  isLoading: ComputedRef<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Translate a key into React nodes using semantic tags */
  tRich: <K extends Key<M, PK, Mode>>(
    key?: K,
    tagRenderers?: VueTagRenderers,
    replacements?: Replacement,
  ) => VNodeChild[];
};
