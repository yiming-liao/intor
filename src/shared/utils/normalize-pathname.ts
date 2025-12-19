/**
 * Normalize a raw pathname string to ensure consistent formatting.
 *
 * - Trims leading and trailing whitespace (code points ≤ 32).
 * - Collapses consecutive slashes into a single slash.
 * - Ensures a leading slash and removes trailing slashes.
 * - Optionally removes the leading slash.
 * - Avoids intermediate array allocations for performance.
 */
export const normalizePathname = (
  rawPathname: string,
  options: { removeLeadingSlash?: boolean } = {},
): string => {
  const length = rawPathname.length;
  let start = 0;
  let end = length - 1;

  // Trim leading whitespace
  while (start <= end && (rawPathname.codePointAt(start) ?? 0) <= 32) start++;
  // Trim trailing whitespace
  while (end >= start && (rawPathname.codePointAt(end) ?? 0) <= 32) end--;

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

  // If the result has a leading slash and we want to remove it, do so
  if (options.removeLeadingSlash && result.startsWith("/")) {
    result = result.slice(1);
  }

  return result || "/";
};
