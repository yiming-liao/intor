/**
 * Determine whether locale persistence is enabled.
 */
export function shouldPersist(cookie: { enabled: boolean; persist: boolean }) {
  return cookie.enabled && cookie.persist;
}
