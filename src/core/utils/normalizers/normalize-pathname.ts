/**
 * Normalizes a raw pathname string into a consistent structural form.
 *
 * Canonical guarantees:
 * - Leading and trailing whitespace (code points ≤ 32) are trimmed
 * - Consecutive slashes are collapsed into a single slash
 * - The result always starts with a single "/"
 * - Redundant trailing slashes are removed
 * - The root path is represented as "/"
 *
 * This function is deterministic and allocation-minimized.
 */
export const normalizePathname = (rawPathname: string): string => {
  const length = rawPathname.length;
  let start = 0;
  let end = length - 1;

  // Trim leading whitespace
  while (start <= end && rawPathname.codePointAt(start)! <= 32) start++;
  // Trim trailing whitespace
  while (end >= start && rawPathname.codePointAt(end)! <= 32) end--;

  if (start > end) return "/"; // Only whitespace

  let result = "";
  let hasSlash = false;

  for (let i = start; i <= end; i++) {
    const char = rawPathname[i];

    if (char === "/") {
      if (!hasSlash) {
        hasSlash = true;
      }
    } else {
      result += hasSlash || result === "" ? "/" + char : char;
      hasSlash = false;
    }
  }

  return result || "/";
};
