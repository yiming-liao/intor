import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { loadRemoteMessages } from "@/server/messages/load-remote-messages";
import { deepMerge } from "@/shared/utils";

interface UseRefetchMessagesParams {
  config: IntorResolvedConfig;
  setRuntimeMessages: React.Dispatch<
    React.SetStateAction<LocaleMessages | null>
  >;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Refetch remote locale messages.
 *
 * This hook ensures that:
 * - Only one remote request is active at a time
 * - In-flight requests are aborted when a new locale is requested
 * - State updates are applied only for the latest request
 */
export const useRefetchMessages = ({
  config,
  setRuntimeMessages,
  setIsLoadingMessages,
}: UseRefetchMessagesParams) => {
  const { loader } = config;

  // Holds the AbortController for the currently active remote request
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Refetch messages
  const refetchMessages = React.useCallback(
    async (newLocale: string) => {
      if (!loader || loader.type !== "remote") return;

      // Abort any in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoadingMessages(true);

      try {
        const loadedMessages = await loadRemoteMessages({
          locale: newLocale,
          fallbackLocales: config.fallbackLocales[newLocale] || [],
          namespaces: loader.namespaces,
          rootDir: loader.rootDir,
          remoteUrl: loader.remoteUrl,
          remoteHeaders: loader.remoteHeaders,
          extraOptions: {
            cacheOptions: config.cache,
            loggerOptions: { id: config.id, ...config.logger },
          },
          signal: controller.signal,
        });

        // Update state only if this request was not aborted
        if (!controller.signal.aborted) {
          setRuntimeMessages(deepMerge(config.messages, loadedMessages));
        }
      } finally {
        // Clear loading state only if this is still the active request
        if (abortControllerRef.current === controller) {
          setIsLoadingMessages(false);
        }
      }
    },
    [
      loader,
      config.id,
      config.messages,
      config.fallbackLocales,
      config.logger,
      config.cache,
      setRuntimeMessages,
      setIsLoadingMessages,
    ],
  );

  // Abort in-flight request on unmount
  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { refetchMessages };
};
