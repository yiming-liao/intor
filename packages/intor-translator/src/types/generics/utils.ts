import type { LocaleMessages, MessageLeaf, MessageObject } from "../messages";

// --------------------------------------------------------------------
// Type Predicates & Branch Helpers
// --------------------------------------------------------------------

/**
 * Detects `any` to prevent infinite type recursion.
 *
 * @public
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Detects `never` for safe conditional branching in type pipelines.
 *
 * @public
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Detects whether `M` is the generic runtime `LocaleMessages` type.
 *
 * @public
 */
export type IsRuntime<M> = [M] extends [LocaleMessages]
  ? [LocaleMessages] extends [M]
    ? true
    : false
  : false;

/**
 * Narrows a type to `MessageObject`, otherwise resolves to never.
 *
 * @public
 */
export type IfMessageObject<T> = T extends MessageObject ? T : never;

/**
 * Conditional helper for branching on `LocaleMessages`.
 *
 * @public
 */
export type IfLocaleMessages<T, Then, Else> = T extends LocaleMessages
  ? Then
  : Else;

// --------------------------------------------------------------------
// Path Generation Engine
// --------------------------------------------------------------------

/**
 *  Countdown tuple for limiting recursive depth (up to 15 levels).
 *
 * @public
 */
export type DepthDecrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Expands a single object property into its dot-separated path form.
 *
 * @example
 * ```ts
 * ExpandPath<"user", { name: string }>; // => "user" | "user.name"
 * ```
 *
 * @public
 */
export type ExpandPath<
  K extends PropertyKey,
  V,
  IncludeSelf extends boolean = true,
  D extends number = 15,
> = V extends MessageLeaf
  ? `${K & string}`
  : V extends MessageObject
    ? IncludeSelf extends true
      ?
          | `${K & string}`
          | `${K & string}.${GeneratePaths<V, IncludeSelf, DepthDecrement[D]>}`
      : `${K & string}.${GeneratePaths<V, IncludeSelf, DepthDecrement[D]>}`
    : never;

/**
 * Generates dot-separated path strings from a nested message object.
 *
 * @example
 * ```ts
 * GeneratePaths<{ user: { name: "Ivan" } }>; // => "user" | "user.name"
 * ```
 *
 * @public
 */
export type GeneratePaths<
  M,
  IncludeSelf extends boolean = true,
  D extends number = 15,
> =
  IsAny<M> extends true
    ? never
    : [D] extends [never]
      ? never
      : M extends MessageObject
        ? { [K in keyof M]: ExpandPath<K, M[K], IncludeSelf, D> }[keyof M]
        : never;

/**
 * Resolves the type located at a dot-separated path.
 *
 * @example
 * ```ts
 * AtPath<{ a: { b: { c: string } } }, "a.b">; // => { c: string };
 * ```
 *
 * @public
 */
export type AtPath<
  T,
  PK extends string,
> = PK extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? AtPath<T[Head], Tail>
    : never
  : PK extends keyof T
    ? T[PK]
    : never;
