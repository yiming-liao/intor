import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { loadRemoteMessages } from "@/server/messages";
import { mergeMessages, resolveNamespaces } from "@/shared/utils";

type UseRefetchMessagesParams = {
  config: IntorResolvedConfig;
  pathname: string;
  setLoadedMessages: React.Dispatch<
    React.SetStateAction<LocaleMessages | null>
  >;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Refetch messages (Dynamic API)
 */
export const useRefetchMessages = ({
  config,
  pathname,
  setLoadedMessages,
  setIsLoadingMessages,
}: UseRefetchMessagesParams) => {
  const { messages: staticMessages } = config;

  const namespaces = React.useMemo(() => {
    if (!config.loader) return [];
    return resolveNamespaces({ config, pathname });
  }, [config, pathname]);

  // Refetch messages
  const refetchMessages = React.useCallback(
    async (newLocale: string) => {
      if (config.loader?.type === "remote") {
        setIsLoadingMessages(true);

        const loadedMessages = await loadRemoteMessages({
          rootDir: config.loader.rootDir,
          remoteUrl: config.loader.remoteUrl,
          remoteHeaders: config.loader.remoteHeaders,
          locale: newLocale,
          fallbackLocales: config.fallbackLocales[newLocale] || [],
          namespaces,
          extraOptions: {
            cacheOptions: config.cache,
            loggerOptions: { id: config.id },
          },
        });

        const messages = mergeMessages(staticMessages, loadedMessages);
        setLoadedMessages(messages);
        setIsLoadingMessages(false);
      }
    },
    [
      config.loader,
      config.fallbackLocales,
      config.id,
      setIsLoadingMessages,
      namespaces,
      staticMessages,
      setLoadedMessages,
    ],
  );

  return { refetchMessages };
};
