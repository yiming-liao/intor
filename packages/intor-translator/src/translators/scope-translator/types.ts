import type {
  Locale,
  LocalizedKey,
  LocalizedValue,
  ScopedReplacement,
  ScopedKey,
  ScopedValue,
} from "../../types";
import type { CoreTranslatorOptions } from "../core-translator";

/**
 * Options for initializing a `ScopeTranslator` instance.
 *
 * Inherits all core translator options and applies them
 * within a scoped key context.
 *
 * @public
 */
export type ScopeTranslatorOptions<M> = CoreTranslatorOptions<M>;

/**
 * Method signatures for a scoped translator view.
 *
 * Represents the translator contract after applying
 * a prefix key via `ScopeTranslator.scoped`.
 *
 * @public
 */
export type ScopeTranslatorMethods<
  M = unknown,
  ReplacementShape = unknown,
  PK extends string | undefined = undefined,
  K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
> = {
  hasKey: (key?: K, targetLocale?: Locale<M>) => boolean;

  t: <Key extends K>(
    key?: Key,
    replacements?: ScopedReplacement<ReplacementShape, PK, K>,
  ) => PK extends string ? ScopedValue<M, PK, Key> : LocalizedValue<M, Key>;
};
