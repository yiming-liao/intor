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
  type IntlFormatter,
} from "intor-translator";

/**
 * Translator key typing mode.
 *
 * @public
 */
export type TranslatorKeyMode = "loose" | "strict";

/**
 * Translator key input type for the given typing mode.
 *
 * @public
 */
export type TranslatorKeyInput<
  K,
  M extends TranslatorKeyMode = "loose",
> = M extends "loose" ? K | (string & {}) : K;

/**
 * Base translator interface.
 *
 * This type represents the minimal, framework-independent translator contract.
 *
 * @public
 */
export type BaseTranslator<
  M extends LocaleMessages = LocaleMessages,
  ReplacementShape = Replacement,
  RichShape = Rich,
  PK extends string | undefined = undefined,
  KM extends TranslatorKeyMode = "loose",
> = {
  /** Localized message map. */
  messages: M;

  /** Active locale. */
  locale: Locale<M>;

  /** Check if a given key exists in the messages. */
  hasKey: <K extends PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>>(
    key?: TranslatorKeyInput<K, KM>,
    targetLocale?: Locale<M>,
  ) => boolean;

  /** Resolve a localized value for the given key. */
  t: <
    K extends PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    R extends Replacement = LocalizedReplacement<ReplacementShape, K>,
  >(
    key?: TranslatorKeyInput<K, KM>,
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
    K extends PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = PK extends string
      ? ScopedRich<RichShape, PK, K>
      : LocalizedRich<RichShape, K>,
    RE = PK extends string
      ? ScopedReplacement<ReplacementShape, PK, K>
      : LocalizedReplacement<ReplacementShape, K>,
  >(
    key?: TranslatorKeyInput<K, KM>,
    tagRenderers?: HtmlTagRenderers<RI> | HtmlTagRenderers,
    replacements?: RE | Replacement,
  ) => string;

  /** Locale-aware formatting helpers. */
  format: IntlFormatter;
};
