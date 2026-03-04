/**
 * Replaces placeholders in a message string with corresponding values from the given parameters.
 *
 * @example
 * ```ts
 * const message = "Hello, {user.name}! You have {notifications.count} new messages.";
 * const params = { user: { name: "Alice" }, notifications: { count: 5 } };
 * const result = replaceValues(message, params);
 * // result: "Hello, Alice! You have 5 new messages."
 * ```
 */
export const replaceValues = (
  message: string,
  params?: Record<string, unknown>,
): string => {
  // Check if params is a valid object (excluding null and undefined)
  if (
    !params ||
    typeof params !== "object" ||
    Object.keys(params).length === 0
  ) {
    return message;
  }

  // Deep replace
  const replaced = message.replaceAll(
    /{([^}]+)}/g,
    (match: string, key: string): string => {
      const keys = key.split(".");
      let value: unknown = params;

      for (const k of keys) {
        // If value is undefined or null, return the original match
        if (value == null || typeof value !== "object" || !(k in value)) {
          return match;
        }
        // Move to the next nested level
        value = (value as Record<string, unknown>)[k];
      }

      return typeof value === "string" || typeof value === "number"
        ? String(value)
        : match;
    },
  );

  return replaced;
};
