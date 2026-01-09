import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type ScopedKey,
  type LocalizedValue,
  type ScopedValue,
  type Replacement,
  type LocalizedReplacement,
} from "intor-translator";

type FallbackIfNever<T, Fallback> = [T] extends [never] ? Fallback : T;

/**
 * Core translator instance interface.
 *
 * This type represents the minimal, framework-independent translator contract.
 */
export type TranslatorInstance<
  M extends LocaleMessages,
  ReplacementSchema = unknown,
  PK extends string | undefined = undefined,
> = {
  /** Check if a given key exists in the messages. */
  hasKey: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
  >(
    key?: K | (string & {}),
    targetLocale?: Locale<M>,
  ) => boolean;

  /** Translate a given key into its string representation. */
  t: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    R extends Replacement = LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    replacements?: R | Replacement,
  ) => FallbackIfNever<
    PK extends string ? ScopedValue<M, PK, K> : LocalizedValue<M, K>,
    string
  >;
};
