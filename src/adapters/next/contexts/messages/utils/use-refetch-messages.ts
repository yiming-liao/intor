"use client";

import { LocaleNamespaceMessages } from "intor-translator";
import * as React from "react";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { loadApiMessages } from "@/modules/messages-loader";
import { mergeMessages } from "@/shared/utils/merge-messages";
import { resolveNamespaces } from "@/shared/utils/resolve-namespaces";

type UseRefetchMessagesParams = {
  config: IntorResolvedConfig;
  pathname: string;
  setLoadedMessages: React.Dispatch<
    React.SetStateAction<LocaleNamespaceMessages | null>
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
      if (config.loader?.type === "api") {
        setIsLoadingMessages(true);

        const loadedMessages = await loadApiMessages<LocaleNamespaceMessages>({
          ...config.loader,
          locale: newLocale,
          fallbackLocales: config.fallbackLocales[newLocale] || [],
          namespaces,
          configId: config.id,
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
