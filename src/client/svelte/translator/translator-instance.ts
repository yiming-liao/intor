import type { TranslatorInstance } from "@/core";
import {
  type Locale,
  type LocaleMessages,
  type Replacement,
  type Rich,
} from "intor-translator";
import { type Readable, type Writable } from "svelte/store";

export type TranslatorInstanceSvelte<
  M extends LocaleMessages,
  ReplacementSchema = Replacement,
  RichSchema = Rich,
  PK extends string | undefined = undefined,
> = {
  /** `messages`: The message object containing all translations. */
  messages: Readable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["messages"]
  >;

  /** Current locale in use. */
  locale: Writable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["locale"]
  >;

  /** Indicates whether translations are currently loading. */
  isLoading: Readable<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Check if a given key exists in the messages. */
  hasKey: Readable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["hasKey"]
  >;

  /** Translate a given key into its string representation. */
  t: Readable<TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["t"]>;

  /** Translate a key into an HTML string using semantic rich tags. */
  tRich: Readable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["tRich"]
  >;
};
