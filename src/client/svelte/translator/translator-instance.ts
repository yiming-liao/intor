import type { SvelteTagRenderers } from "../render";
import type { TranslatorInstance } from "@/core";
import type { Readable, Writable } from "svelte/store";
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

export type TranslatorInstanceSvelte<
  M extends LocaleMessages,
  ReplacementSchema = Replacement,
  RichSchema = Rich,
  PK extends string | undefined = undefined,
> = {
  /** `messages`: The message object containing all translations. */
  messages: Readable<M>;

  /** Current locale in use. */
  locale: Writable<Locale<M>>;

  /** Indicates whether translations are currently loading. */
  isLoading: Readable<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Check if a given key exists in the messages. */
  hasKey: Readable<TranslatorInstance<M, ReplacementSchema, PK>["hasKey"]>;

  /** Translate a given key into its string representation. */
  t: Readable<TranslatorInstance<M, ReplacementSchema, PK>["t"]>;

  /** Translate a key into an HTML string using semantic rich tags. */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = LocalizedRich<RichSchema, K>,
    RE = LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: SvelteTagRenderers<RI>,
    replacements?: RE | Replacement,
  ) => string;
};
