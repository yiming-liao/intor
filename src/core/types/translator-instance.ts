import type { HtmlTagRenderers } from "../render";
import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type ScopedKey,
  type LocalizedValue,
  type ScopedValue,
  type Replacement,
  type LocalizedReplacement,
  type LocalizedRich,
  type Rich,
  type ScopedRich,
  type ScopedReplacement,
} from "intor-translator";

type FallbackIfNever<T, Fallback> = [T] extends [never] ? Fallback : T;

/**
 * Core translator instance interface.
 *
 * This type represents the minimal, framework-independent translator contract.
 */
export type TranslatorInstance<
  M extends LocaleMessages,
  ReplacementSchema = Replacement,
  RichSchema = Rich,
  PK extends string | undefined = undefined,
> = {
  /** Localized message map. */
  messages: M;

  /** Active locale. */
  locale: Locale<M>;

  /** Check if a given key exists in the messages. */
  hasKey: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
  >(
    key?: K | (string & {}),
    targetLocale?: Locale<M>,
  ) => boolean;

  /** Resolve a localized value for the given key. */
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

  /** Resolve a localized value and apply rich tag renderers. */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = PK extends string
      ? ScopedRich<RichSchema, PK, K>
      : LocalizedRich<RichSchema, K>,
    RE = PK extends string
      ? ScopedReplacement<ReplacementSchema, PK, K>
      : LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: HtmlTagRenderers<RI> | HtmlTagRenderers,
    replacements?: RE | Replacement,
  ) => string;
};
