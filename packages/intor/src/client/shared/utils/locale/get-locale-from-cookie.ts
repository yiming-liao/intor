/**
 * Gets the locale value from the browser cookie.
 *
 * This function relies on `document.cookie`.
 */
export function getLocaleFromCookie(cookieName: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const entry = cookies.find((c) => c.startsWith(`${cookieName}=`));

  if (!entry) return undefined;

  return decodeURIComponent(entry.slice(cookieName.length + 1));
}
