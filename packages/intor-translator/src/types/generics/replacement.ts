import type { MessageObject } from "../messages";
import type { AtPath, IsNever } from "./utils";

/**
 * Generic replacement object used when no shape is available.
 *
 * Acts as a safe fallback for dynamic or unknown replacement shapes.
 *
 * @public
 */
export type Replacement = Record<string, unknown>;

/**
 * Replacement object resolved from a localized replacement shape.
 *
 * - If the key exists in the shape, resolves to the declared object shape
 * - Otherwise falls back to generic `Replacement`
 *
 * @example
 * ```ts
 * type ReplacementShape = { "{locale}": { greeting: { name: string } } };
 * LocalizedReplacement<ReplacementShape, "greeting">; // => { name: string }
 * LocalizedReplacement<ReplacementShape, "missing">;  // => Replacement
 * ```
 *
 * @public
 */
export type LocalizedReplacement<
  ReplacementShape,
  K extends string,
> = ReplacementShape extends { "{locale}": infer LM }
  ? IsNever<AtPath<LM, K>> extends true
    ? Replacement
    : AtPath<LM, K> extends MessageObject
      ? AtPath<LM, K>
      : Replacement
  : Replacement;

/**
 * Replacement object resolved under a scoped prefix key.
 *
 * Internally composes the full dot-path (`"${PK}.${K}"`)
 * and delegates resolution to `LocalizedReplacement`.
 *
 * @example
 * ```ts
 * type ReplacementShape = { "{locale}": { user: { info: { name: string } } } };
 * ScopedReplacement<ReplacementShape, "user", "info">; // => { name: string }
 * ScopedReplacement<ReplacementShape, "user", "missing">; // => Replacement
 * ```
 *
 * @public
 */
export type ScopedReplacement<
  ReplacementShape,
  PK extends string | undefined,
  K extends string,
> = LocalizedReplacement<ReplacementShape, `${PK}.${K}`>;
