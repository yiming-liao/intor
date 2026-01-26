import type { RequestEvent } from "@sveltejs/kit";

/**
 * Heuristic to detect static (prerender) execution in SvelteKit.
 *
 * This is NOT a guaranteed signal.
 * It intentionally prefers false positives over false negatives.
 */
export function isSvelteKitSSG(
  event: RequestEvent<Record<string, string>, string | null>,
): boolean {
  // No user-agent is a strong signal of static rendering
  if (event.request.headers.get("user-agent") === null) {
    return true;
  }

  return false;
}
