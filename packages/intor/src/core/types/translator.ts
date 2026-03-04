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

/**
 * Base translator interface.
 *
 * This type represents the minimal, framework-independent translator contract.
 *
 * @public
 */
export type BaseTranslator<
  M extends LocaleMessages,
  ReplacementShape = Replacement,
  RichShape = Rich,
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
    R extends Replacement = LocalizedReplacement<ReplacementShape, K>,
  >(
    key?: K | (string & {}),
    replacements?: R | Replacement,
  ) => [
    PK extends string ? ScopedValue<M, PK, K> : LocalizedValue<M, K>,
  ] extends [never]
    ? string
    : PK extends string
      ? ScopedValue<M, PK, K>
      : LocalizedValue<M, K>;

  /** Resolve a localized value and apply rich tag renderers. */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = PK extends string
      ? ScopedRich<RichShape, PK, K>
      : LocalizedRich<RichShape, K>,
    RE = PK extends string
      ? ScopedReplacement<ReplacementShape, PK, K>
      : LocalizedReplacement<ReplacementShape, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: HtmlTagRenderers<RI> | HtmlTagRenderers,
    replacements?: RE | Replacement,
  ) => string;
};
