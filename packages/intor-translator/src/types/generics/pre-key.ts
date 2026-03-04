import type { GeneratePaths, IfLocaleMessages, IfMessageObject } from "./utils";

/**
 * Prefix keys that may resolve to intermediate or leaf paths.
 *
 * @example
 * ```ts
 * PreKey<{ a: { b: { c: string }; z: string } }>; // → "a" | "a.b" | "a.z" | "a.b.c"
 * ```
 *
 * @public
 */
export type PreKey<M> = GeneratePaths<M, true>;

/**
 * Prefix keys resolved from localized messages (union of all locales).
 *
 * @example
 * ```ts
 * LocalizedPreKey<{ en: { a: { b: { c: string }; z: string } } }>; // →   "a" | "a.b" | "a.z" | "a.b.c"
 * ```
 *
 * @public
 */
export type LocalizedPreKey<M> = IfLocaleMessages<
  M,
  PreKey<IfMessageObject<M[keyof M]>>,
  string
>;
