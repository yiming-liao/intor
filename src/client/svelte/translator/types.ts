import type { BaseTranslator } from "../../../core";
import {
  type Locale,
  type LocaleMessages,
  type Replacement,
  type Rich,
} from "intor-translator";
import { type Readable, type Writable } from "svelte/store";

/**
 * Svelte-specific translator interface.
 *
 * Extends `BaseTranslator` with runtime state
 * and rich message rendering tailored for Svelte.
 *
 * @public
 */
export type SvelteTranslator<
  M extends LocaleMessages,
  ReplacementShape = Replacement,
  RichShape = Rich,
  PK extends string | undefined = undefined,
> = {
  /** Localized message map. */
  messages: Readable<
    BaseTranslator<M, ReplacementShape, RichShape, PK>["messages"]
  >;

  /** Active locale. */
  locale: Writable<
    BaseTranslator<M, ReplacementShape, RichShape, PK>["locale"]
  >;

  /** Whether translations are loading. */
  isLoading: Readable<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Check if a given key exists in the messages. */
  hasKey: Readable<
    BaseTranslator<M, ReplacementShape, RichShape, PK>["hasKey"]
  >;

  /** Resolve a localized value for the given key. */
  t: Readable<BaseTranslator<M, ReplacementShape, RichShape, PK>["t"]>;

  /** Resolve a localized value and apply rich tag renderers. */
  tRich: Readable<BaseTranslator<M, ReplacementShape, RichShape, PK>["tRich"]>;
};
