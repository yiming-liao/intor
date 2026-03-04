import type { CookieResolvedOptions } from "../../../config";

/**
 * Build a serialized cookie string.
 */
export const buildCookieString = (
  cookieOptions: CookieResolvedOptions,
  value: string,
): string => {
  const { name, maxAge, path, domain, sameSite, secure } = cookieOptions;

  // Cookie name and encoded value
  const parts: string[] = [`${name}=${encodeURIComponent(value)}`];

  // Add expiration and max-age if provided
  if (maxAge !== undefined) {
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    parts.push(`expires=${expires}`, `max-age=${maxAge}`);
  }

  // Set path (default to "/")
  parts.push(`path=${path ?? "/"}`);

  // Add domain if specified
  if (domain) {
    parts.push(`domain=${domain}`);
  }

  // Add SameSite policy (e.g., Lax, Strict)
  if (sameSite) {
    const normalized =
      sameSite.charAt(0).toUpperCase() + sameSite.slice(1).toLowerCase();
    parts.push(`SameSite=${normalized}`);
  }

  // Add Secure flag if not explicitly disabled
  if (secure !== false) {
    parts.push(`Secure`);
  }

  return parts.join("; ");
};
