import { messageKeyCache } from "@/intor/core/intor-translator/cache/message-key-cache";

/**
 * Get value by key
 */
export const getValueByKey = (
  messages: unknown,
  key: string,
  useCache = true,
): unknown => {
  const cacheKey = `${key}`;

  // If useCache is true and cache exists
  if (useCache && messageKeyCache?.has(cacheKey)) {
    return messageKeyCache?.get(cacheKey);
  }

  // Find value by key path
  const value = key.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  // Cache the result if useCache is true
  if (useCache && value !== undefined) {
    messageKeyCache?.set(cacheKey, value);
  }

  return value;
};
