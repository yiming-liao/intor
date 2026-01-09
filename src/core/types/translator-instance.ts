import {
  type Locale,
  type Replacement,
  type ScopedLeafKeys,
  type LocalizedLeafKeys,
  type LocaleMessages,
  type LocalizedLeafValue,
  type ScopedLeafValue,
} from "intor-translator";

/** Key resolution strategy. */
export type KeyMode = "auto" | "strict" | "string";

/** Only allows keys resolved from message definitions. */
type StrictKey<M, PK extends string | undefined> = PK extends string
  ? ScopedLeafKeys<M, PK>
  : LocalizedLeafKeys<M>;

/** Allows resolved keys, with string fallback for DX. */
type LooseKey<M, PK extends string | undefined> =
  | StrictKey<M, PK>
  | (string & {}); // `& {}` preserve literal autocomplete while allowing free-form strings

/**
 * Message key type resolved from translator context.
 *
 * - Uses scoped keys when a `preKey` is provided
 * - Falls back to all localized leaf keys otherwise
 *
 * This type is compile-time only and framework-agnostic.
 */
export type Key<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = Mode extends "string"
  ? string
  : Mode extends "auto"
    ? LooseKey<M, PK>
    : StrictKey<M, PK>;

/**
 * Resolved message value type for a given translation key.
 *
 * - In generated mode, resolves to the exact leaf value type
 *   derived from message definitions.
 * - In fallback mode (no generated types), falls back to `string`
 *   to preserve safety and predictable DX.
 *
 * This type is compile-time only and framework-agnostic.
 */
export type Value<M, PK extends string | undefined, K extends string> =
  IsLooseMessages<M> extends true
    ? string
    : PK extends string
      ? ScopedLeafValue<M, PK, K>
      : LocalizedLeafValue<M, K>;

// `true` if message keys are not statically known.
type IsLooseMessages<M> = string extends keyof M ? true : false;

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
  hasKey: <K extends Key<M, PK, Mode>>(
    key?: K,
    targetLocale?: Locale<M>,
  ) => boolean;

  /** Translate a given key into its string representation. */
  t: <K extends Key<M, PK, Mode>>(
    key?: K,
    replacements?: Replacement,
  ) => Value<M, PK, K>;
};
