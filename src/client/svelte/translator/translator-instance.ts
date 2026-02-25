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
  /** Localized message map. */
  messages: Readable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["messages"]
  >;

  /** Active locale. */
  locale: Writable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["locale"]
  >;

  /** Whether translations are loading. */
  isLoading: Readable<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Check if a given key exists in the messages. */
  hasKey: Readable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["hasKey"]
  >;

  /** Resolve a localized value for the given key. */
  t: Readable<TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["t"]>;

  /** Resolve a localized value and apply rich tag renderers. */
  tRich: Readable<
    TranslatorInstance<M, ReplacementSchema, RichSchema, PK>["tRich"]
  >;
};
