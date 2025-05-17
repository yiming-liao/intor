import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import {
  loadLocalMessages,
  type LoadLocalMessagesOptions,
} from "../../intor-messages-loader/load-local-messages";
/**
 * Create a loader for dynamic import of local messages.
 * basePath is static to prevent issues with dynamic parsing
 * that may occur when basePath is passed dynamically in a
 * non-static context.
 */
export const createLocalMessagesLoader = (
  basePath?: string,
): ((
  options: LoadLocalMessagesOptions,
) => Promise<LocaleNamespaceMessages>) => {
  return (options: LoadLocalMessagesOptions) =>
    loadLocalMessages({ basePath, ...options }); // Load messages with the fixed basePath
};
