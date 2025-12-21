import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { loadRemoteMessages } from "@/server/messages";
import { deepMerge } from "@/shared/utils";

interface UseRefetchMessagesParams {
  config: IntorResolvedConfig;
  setRuntimeMessages: React.Dispatch<
    React.SetStateAction<LocaleMessages | null>
  >;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Refetch messages
 */
export const useRefetchMessages = ({
  config,
  setRuntimeMessages,
  setIsLoadingMessages,
}: UseRefetchMessagesParams) => {
  const { loader } = config;

  // Refetch messages
  const refetchMessages = React.useCallback(
    async (newLocale: string) => {
      if (loader?.type !== "remote") return;
      setIsLoadingMessages(true);

      const loadedMessages = await loadRemoteMessages({
        locale: newLocale,
        fallbackLocales: config.fallbackLocales[newLocale] || [],
        namespaces: loader.namespaces,
        rootDir: loader.rootDir,
        remoteUrl: loader.remoteUrl,
        remoteHeaders: loader.remoteHeaders,
        extraOptions: {
          cacheOptions: config.cache,
          loggerOptions: { id: config.id },
        },
      });

      setRuntimeMessages(deepMerge(config.messages, loadedMessages) || {});
      setIsLoadingMessages(false);
    },
    [
      loader,
      config.id,
      config.messages,
      config.fallbackLocales,
      config.cache,
      setRuntimeMessages,
      setIsLoadingMessages,
    ],
  );

  return { refetchMessages };
};
