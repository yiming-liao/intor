import type { CookieResolvedOptions } from "@/config/types/cookie.types";

/**
 * Gets the locale value from the browser cookie.
 *
 * - Browser-only.
 * - Returns null if the cookie does not exist.
 */
export function getLocaleCookieBrowser(
  cookie: CookieResolvedOptions,
): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const entry = cookies.find((c) => c.startsWith(`${cookie.name}=`));

  if (!entry) return null;

  return decodeURIComponent(entry.slice(cookie.name.length + 1));
}
