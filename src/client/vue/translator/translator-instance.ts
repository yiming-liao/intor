import type { VueTagRenderers } from "@/client/vue/render";
import type { KeyMode, MessageKey, TranslatorInstance } from "@/core/types";
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
  tRich: (
    key?: MessageKey<M, PK, Mode>,
    tagRenderers?: VueTagRenderers,
    replacements?: Replacement,
  ) => VNodeChild[];
};
