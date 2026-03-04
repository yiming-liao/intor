import type {
  AtPath,
  GeneratePaths,
  IfLocaleMessages,
  IfMessageObject,
} from "./utils";

/**
 * Dot-separated leaf keys derived from a single message object.
 *
 * @example
 * ```ts
 * Key<{ a: { b: { c: string }; z: string } }>; // => "a.z" | "a.b.c"
 * ```
 *
 * @public
 */
export type Key<M> = GeneratePaths<M, false>;

/**
 * Leaf keys resolved from localized messages (union of all locales).
 *
 * @example
 * ```ts
 * LocalizedKey<{ en: { a: { b: { c: string }; z: string } } }>; // =>  "a.z" | "a.b.c"
 * ```
 *
 * @public
 */
export type LocalizedKey<M> = IfLocaleMessages<
  M,
  Key<IfMessageObject<M[keyof M]>>,
  string
>;

/**
 * Leaf keys scoped under a given prefix key.
 *
 * @example
 * ```ts
 *  ScopedKey<{ en: { a: { b: { c: string }; z: string } } }, "a">; // => "b.c" | "z"
 * ```
 *
 * @public
 */
export type ScopedKey<M, PK extends string> = IfLocaleMessages<
  M,
  Key<IfMessageObject<AtPath<M[keyof M], PK>>>,
  string
>;
