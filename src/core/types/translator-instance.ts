import {
  type Locale,
  type Replacement,
  type ScopedLeafKeys,
  type LocalizedLeafKeys,
  type LocaleMessages,
  type MessageValue,
} from "intor-translator";

/** Key resolution strategy. */
export type KeyMode = "auto" | "strict" | "string";

/** Only allows keys resolved from message definitions. */
type StrictMessageKey<M, PK extends string | undefined> = PK extends string
  ? ScopedLeafKeys<M, PK>
  : LocalizedLeafKeys<M>;

/** Allows resolved keys, with string fallback for DX. */
type LooseMessageKey<M, PK extends string | undefined> =
  | StrictMessageKey<M, PK>
  | (string & {}); // `& {}` preserve literal autocomplete while allowing free-form strings

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
  : Mode extends "auto"
    ? LooseMessageKey<M, PK>
    : StrictMessageKey<M, PK>;

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

  /** Translate a given key and return its raw message value. */
  tRaw: (
    key?: MessageKey<M, PK, Mode>,
    replacements?: Replacement,
  ) => MessageValue | undefined;
};
