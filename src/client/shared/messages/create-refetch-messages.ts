import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { loadRemoteMessages, deepMerge, resolveLoaderOptions } from "@/core";

interface CreateRefetchMessagesParams {
  config: IntorResolvedConfig;
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onMessages?: (messages: LocaleMessages) => void;
}

export type RefetchMessagesFn = (newLocale: string) => Promise<void>;

/**
 * Creates a framework-agnostic message refetcher.
 *
 * - At most one remote request is active at any time
 * - Previous in-flight requests are aborted on subsequent calls
 * - State updates are applied only for the latest, non-aborted request
 */
export const createRefetchMessages = ({
  config,
  onLoadingStart,
  onLoadingEnd,
  onMessages,
}: CreateRefetchMessagesParams): RefetchMessagesFn => {
  // Tracks the currently active remote request for this refetcher instance
  let controller: AbortController | null = null;

  return async function refetchMessages(newLocale: string) {
    // No-op when remote loading is not enabled
    const loader = resolveLoaderOptions(config, "client");
    if (!loader || loader.type !== "remote") return;

    // Abort previous request
    controller?.abort();

    const currentController = new AbortController();
    controller = currentController;

    onLoadingStart?.();

    try {
      const loadedMessages = await loadRemoteMessages({
        // --- Messages Scope ---
        locale: newLocale,
        fallbackLocales: config.fallbackLocales[newLocale] || [],
        namespaces: loader.namespaces,
        rootDir: loader.rootDir,
        // --- Remote Source ---
        url: loader.url,
        headers: loader.headers,
        signal: currentController.signal,
        // --- Caching ---
        cacheOptions: config.cache,
        // --- Observability ---
        loggerOptions: config.logger,
      });

      // Apply state updates only when this request is still the active one
      // and has not been aborted.
      if (
        controller === currentController &&
        !currentController.signal.aborted
      ) {
        onMessages?.(deepMerge(config.messages, loadedMessages));
      }
    } finally {
      // Clear loading state only if this request is still the active one
      if (
        controller === currentController &&
        !currentController.signal.aborted
      ) {
        onLoadingEnd?.();
      }
    }
  };
};
