/**
 * Extract interpolation argument names from a message string.
 *
 * Policy:
 * - Only the outermost `{ ... }` blocks are considered
 * - Nested `{}` are treated as part of the same block
 * - For each block, only the identifier before the first `,` is extracted
 * - Unmatched `{` or `}` are ignored
 * - No ICU syntax parsing or semantic validation is performed
 *
 * This function is syntax-aware but not syntax-validating.
 *
 * @example
 * ```ts
 * extractInterpolationNames("Hello, {name}.")
 * // => ["name"]
 *
 * extractInterpolationNames(
 *   "{name} has {count, plural, =0 {no messages} one {1 message} other {# messages}}."
 * )
 * // => ["name", "count"]
 * ```
 */
export function extractInterpolationNames(message: string): string[] {
  const result = new Set<string>();

  let depth = 0;
  let start = -1;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];

    if (char === "{") {
      if (depth === 0) {
        start = i + 1;
      }
      depth++;
      continue;
    }

    if (char === "}") {
      depth--;

      // Unbalanced closing brace → reset state
      if (depth < 0) {
        depth = 0;
        start = -1;
        continue;
      }

      if (depth === 0 && start !== -1) {
        const raw = message.slice(start, i).trim();

        // ICU invariant:
        // argument name is always the first segment
        const name = raw.split(",", 1)[0]?.trim();

        if (name) {
          result.add(name);
        }

        start = -1;
      }

      continue;
    }
  }

  return [...result];
}
