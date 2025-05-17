import type {
  Locale,
  NamespaceMessages,
} from "../../../types/message-structure-types";
import { getMessageKeyCache } from "../../intor-cache";

/**
 * Get value by key
 */
export const getValueByKey = (
  locale: Locale,
  messages: NamespaceMessages,
  key: string,
  useCache: boolean = true,
): unknown => {
  const cache = getMessageKeyCache();
  useCache = Boolean(useCache && cache);

  const cacheKey = `${key}`;

  const currentLocale = cache?.get("locale");
  if (currentLocale !== locale) {
    cache?.clear();
    cache?.set("locale", locale);
  }

  if (useCache && cache?.has(cacheKey)) {
    return cache?.get(cacheKey);
  }

  const value = key.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  if (useCache && value !== undefined) {
    cache?.set(cacheKey, value);
  }

  return value;
};
