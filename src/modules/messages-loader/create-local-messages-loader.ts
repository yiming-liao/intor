import { LocaleNamespaceMessages } from "intor-translator";
import {
  loadLocalMessages,
  LoadLocalMessagesOptions,
} from "@/modules/messages-loader/load-local-messages";

/**
 * Create a loader for local messages.
 * Messages are loaded asynchronously from a fixed basePath.
 * The basePath is static to avoid issues with dynamic paths
 * in non-static contexts.
 */
export const createLocalMessagesLoader = (
  basePath?: string,
): ((
  options: LoadLocalMessagesOptions,
) => Promise<LocaleNamespaceMessages>) => {
  return (options: LoadLocalMessagesOptions) =>
    loadLocalMessages({ basePath, ...options }); // Load messages with the fixed basePath
};
