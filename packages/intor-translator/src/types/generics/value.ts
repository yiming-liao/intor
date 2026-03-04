import type { AtPath, IsRuntime } from "./utils";
import type { LocaleMessages } from "../messages";

/**
 * Resolves the value type at a dot-separated path.
 *
 * @example
 * ```ts
 * Value<{ a: { b: { c: string } } }, "a.b.c">; // => string
 * ```
 *
 * @public
 */
export type Value<M, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Head extends keyof M
    ? Value<M[Head], Tail>
    : never
  : K extends keyof M
    ? M[K]
    : never;

/**
 * Value resolved from localized messages (union of all locales).
 *
 * @example
 * ```ts
 * LocalizedValue<{ en: { a: { b: { c: string }; z: string } } }, "a.b.c">; // => string
 * ```
 *
 * @public
 */
export type LocalizedValue<M, K extends string> =
  IsRuntime<M> extends true
    ? string
    : M extends LocaleMessages
      ? Value<M[keyof M], K>
      : never;

/**
 * Value resolved under a scoped prefix key.
 *
 * @example
 * ```ts
 * ScopedValue<{ en: { a: { b: { c: string }; z: string } } }, "a", "b.c">; // => string
 * ```
 *
 * @public
 */
export type ScopedValue<M, PK extends string, K extends string> =
  IsRuntime<M> extends true
    ? string
    : M extends LocaleMessages
      ? Value<AtPath<M[keyof M], PK>, K>
      : never;
