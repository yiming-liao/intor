import type { CookieResolvedOptions } from "@/config/types/cookie.types";

/**
 * Builds a serialized cookie string with the given value.
 */
export const buildCookieString = (
  cookie: CookieResolvedOptions,
  value: string,
): string => {
  // Cookie name and encoded value
  const parts: string[] = [`${cookie.name}=${encodeURIComponent(value)}`];

  // Add expiration and max-age if provided
  if (cookie.maxAge) {
    const expires = new Date(Date.now() + cookie.maxAge * 1000).toUTCString();
    parts.push(`expires=${expires}`, `max-age=${cookie.maxAge}`);
  }

  // Set path (default to "/")
  parts.push(`path=${cookie.path ?? "/"}`);

  // Add domain if specified
  if (cookie.domain) {
    parts.push(`domain=${cookie.domain}`);
  }

  // Add SameSite policy (e.g., Lax, Strict)
  if (cookie.sameSite) {
    parts.push(
      `SameSite=${cookie.sameSite[0].toUpperCase()}${cookie.sameSite.slice(1).toLowerCase()}`,
    );
  }

  // Add Secure flag if not explicitly disabled
  if (cookie.secure !== false) {
    parts.push(`Secure`);
  }

  return parts.join("; ");
};
