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
  /** `messages`: The message object containing all translations. */
  messages: M;

  /** Current locale in use. */
  locale: Locale<M>;

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

  /** Translate a key into an HTML string using semantic rich tags. */
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
