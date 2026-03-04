/**
 * Combines a prefix and subkey into a dot-separated full key path.
 *
 * @example
 * ```ts
 * getFullKey("home", "welcome.title"); // "home.welcome.title"
 * getFullKey(undefined, "about");      // "about"
 * getFullKey("profile");               // "profile"
 * ```
 */
export const getFullKey = (preKey: string = "", key: string = ""): string => {
  if (!preKey) return key;
  if (!key) return preKey;

  return `${preKey}.${key}`;
};
