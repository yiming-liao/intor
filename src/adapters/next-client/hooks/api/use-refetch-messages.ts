"use client";

import { LocaleNamespaceMessages } from "intor-translator";
import * as React from "react";
import {
  FetchMessagesErrorHandler,
  useFetchMessages,
} from "@/adapters/next-client/hooks/api/use-fetch-messages";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { mergeStaticAndDynamicMessages } from "@/shared/utils/merge-static-and-dynamic-messages";
import { resolveNamespaces } from "@/shared/utils/resolve-namespaces";

type UseRefetchMessagesParams = {
  config: IntorResolvedConfig;
  pathname: string;
  setLoadedMessages: React.Dispatch<
    React.SetStateAction<LocaleNamespaceMessages | null>
  >;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  onError?: FetchMessagesErrorHandler;
};

/**
 * Refetch messages (Dynamic API)
 */
export const useRefetchMessages = ({
  config,
  pathname,
  setLoadedMessages,
  setIsLoadingMessages,
  onError, // Error handler
}: UseRefetchMessagesParams) => {
  const { messages: staticMessages } = config;

  const namespaces = React.useMemo(() => {
    if (!config.loaderOptions) {
      return [];
    }
    return resolveNamespaces({ config, pathname });
  }, [config, pathname]);

  const { fetcher } = useFetchMessages({ onError });

  // Refetch messages
  const refetchMessages = React.useCallback(
    async (newLocale: string) => {
      if (config.loaderOptions?.type === "api") {
        setIsLoadingMessages(true); // Start loading

        // Fetcher
        const dynamicMessages = await fetcher({
          ...config.loaderOptions,
          locale: newLocale,
          fallbackLocales: config.fallbackLocales[newLocale] || [],
          namespaces,
          loggerId: config.id,
        });

        // Merge static and dynamic messages (Only the first level after locales)
        const messages = mergeStaticAndDynamicMessages(
          staticMessages,
          dynamicMessages as LocaleNamespaceMessages,
        );
        setLoadedMessages(messages);

        setIsLoadingMessages(false); // End loading
      }
    },
    [
      config.loaderOptions,
      config.fallbackLocales,
      config.id,
      setIsLoadingMessages,
      fetcher,
      namespaces,
      staticMessages,
      setLoadedMessages,
    ],
  );

  return { refetchMessages };
};
