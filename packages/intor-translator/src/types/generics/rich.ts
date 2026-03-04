import type { MessageObject } from "../messages";
import type { AtPath, IsNever } from "./utils";

/**
 * Generic rich tag map used when no shape is available.
 *
 * Acts as a safe fallback for dynamic or unknown rich tag shapes.
 *
 * @public
 */
export type Rich = Record<string, unknown>;

/**
 * Rich tag map resolved from a localized rich shape.
 *
 * - If the key exists in the shape, resolves to the declared tag map
 * - Otherwise falls back to generic `Rich`
 *
 * @example
 * ```ts
 * type RichShape = { "{locale}": { link: { a: {} } } }
 * LocalizedRich<RichShape, "link"> // => { a: {} }
 * LocalizedRich<RichShape, "missing">; // => Rich
 * ```
 *
 * @public
 */
export type LocalizedRich<RichShape, K extends string> = RichShape extends {
  "{locale}": infer LM;
}
  ? IsNever<AtPath<LM, K>> extends true
    ? Rich
    : AtPath<LM, K> extends MessageObject
      ? AtPath<LM, K>
      : Rich
  : Rich;

/**
 * Rich tag map resolved under a scoped prefix key.
 *
 * Internally composes the full dot-path (`"${PK}.${K}"`)
 * and delegates resolution to `LocalizedRich`.
 *
 * @example
 * ```ts
 * type RichShape = { "{locale}": { app: { link: { a: {} } } } };
 * ScopedRich<RichShape, "app", "link">; // => { a: {} }
 * ScopedRich<RichShape, "app", "missing">; // => Rich
 * ```
 *
 * @public
 */
export type ScopedRich<
  RichShape,
  PK extends string | undefined,
  K extends string,
> = LocalizedRich<RichShape, `${PK}.${K}`>;
