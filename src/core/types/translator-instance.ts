import type { IfGen } from "@/core/types/generated";
import {
  type Locale,
  type Replacement,
  type ScopedLeafKeys,
  type LocalizedLeafKeys,
  type LocaleMessages,
} from "intor-translator";

export type KeyMode = "auto" | "string";

/**
 * Message key type resolved from translator context.
 *
 * - Uses scoped keys when a `preKey` is provided
 * - Falls back to all localized leaf keys otherwise
 *
 * This type is compile-time only and framework-agnostic.
 */
export type MessageKey<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = Mode extends "string"
  ? string
  : IfGen<
      PK extends string ? ScopedLeafKeys<M, PK> : LocalizedLeafKeys<M>,
      string
    >;

/**
 * Core translator instance interface.
 *
 * This type represents the minimal, framework-independent translator contract.
 */
export type TranslatorInstance<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = {
  /** Check if a given key exists in the messages. */
  hasKey: (key?: MessageKey<M, PK, Mode>, targetLocale?: Locale<M>) => boolean;

  /** Translate a given key into its string representation. */
  t: (key?: MessageKey<M, PK, Mode>, replacements?: Replacement) => string;
};
