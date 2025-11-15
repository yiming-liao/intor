import type { LoadLocalMessagesOptions } from "@/modules/messages/load-local-messages";
import type { LocaleMessages } from "intor-translator";
import { loadLocalMessages } from "@/modules/messages/load-local-messages";

/**
 * Create a loader for local messages.
 * Messages are loaded asynchronously from a fixed basePath.
 * The basePath is static to avoid issues with dynamic paths
 * in non-static contexts.
 */
export const createLoadLocalMessages = (
  basePath?: string,
): ((options: LoadLocalMessagesOptions) => Promise<LocaleMessages>) => {
  return (options: LoadLocalMessagesOptions) =>
    loadLocalMessages({ basePath, ...options }); // Load messages with the fixed basePath
};
