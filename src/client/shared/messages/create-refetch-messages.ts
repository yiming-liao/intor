import type { IntorResolvedConfig } from "../../../config";
import type { Locale, LocaleMessages } from "intor-translator";
import { loadRemoteMessages, resolveLoaderOptions } from "../../../core";
import { mergeMessages } from "../../../core";

interface CreateRefetchMessagesParams {
  config: IntorResolvedConfig;
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onMessages?: (messages: LocaleMessages) => void;
}

export type RefetchMessagesFn = (newLocale: Locale) => Promise<void>;

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

  return async function refetchMessages(newLocale: Locale) {
    // No-op when remote loading is not enabled
    const loader = resolveLoaderOptions(config, "client");
    if (!loader || loader.mode !== "remote") return;
    const { namespaces, concurrency, url, headers } = loader;

    // Abort previous request
    controller?.abort();

    const currentController = new AbortController();
    controller = currentController;

    onLoadingStart?.();

    try {
      const loadedMessages = await loadRemoteMessages({
        locale: newLocale,
        fallbackLocales: config.fallbackLocales[newLocale] || [],
        ...(namespaces !== undefined ? { namespaces } : {}),
        ...(concurrency !== undefined ? { concurrency } : {}),
        fetch: globalThis.fetch,
        url,
        ...(headers !== undefined ? { headers: headers } : {}),
        signal: currentController.signal,
        loggerOptions: config.logger,
      });

      // Apply state updates only when this request is still the active one
      // and has not been aborted.
      if (
        controller === currentController &&
        !currentController.signal.aborted
      ) {
        onMessages?.(
          mergeMessages(config.messages, loadedMessages, {
            config,
            locale: newLocale,
          }),
        );
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
