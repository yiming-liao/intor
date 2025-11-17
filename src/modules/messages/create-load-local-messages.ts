import type { LoadLocalMessagesOptions } from "@/modules/messages/load-local-messages";
import type { LocaleMessages } from "intor-translator";
import { loadLocalMessages } from "@/modules/messages/load-local-messages";

/**
 * Returns a version of `loadLocalMessages` with a fixed root directory.
 *
 * By fixing the rootDir, this avoids issues with dynamic paths
 * in bundled or non-static environments.
 */
export const createLoadLocalMessages = (
  rootDir?: string,
): ((
  options: LoadLocalMessagesOptions,
) => Promise<LocaleMessages | undefined>) => {
  return (options: LoadLocalMessagesOptions) =>
    loadLocalMessages({ rootDir, ...options }); // Load messages with the fixed rootDir
};
