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
  ReplacementShape = Replacement,
  RichShape = Rich,
  PK extends string | undefined = undefined,
> = {
  /** Localized message map. */
  messages: Readable<
    TranslatorInstance<M, ReplacementShape, RichShape, PK>["messages"]
  >;

  /** Active locale. */
  locale: Writable<
    TranslatorInstance<M, ReplacementShape, RichShape, PK>["locale"]
  >;

  /** Whether translations are loading. */
  isLoading: Readable<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Check if a given key exists in the messages. */
  hasKey: Readable<
    TranslatorInstance<M, ReplacementShape, RichShape, PK>["hasKey"]
  >;

  /** Resolve a localized value for the given key. */
  t: Readable<TranslatorInstance<M, ReplacementShape, RichShape, PK>["t"]>;

  /** Resolve a localized value and apply rich tag renderers. */
  tRich: Readable<
    TranslatorInstance<M, ReplacementShape, RichShape, PK>["tRich"]
  >;
};
