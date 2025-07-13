"use client";

import type { IntorMessagesProviderProps } from "./types";
import * as React from "react";
import { IntorMessagesContext } from "./intor-messages-context";
import { LocaleNamespaceMessages } from "intor-translator";
import { useIntorConfig } from "@/adapters/next-client/contexts/intor-config";
import { useRefetchMessages } from "@/adapters/next-client/hooks/api/use-refetch-messages";

// Provider
export const IntorMessagesProvider = ({
  value: { messages },
  children,
}: IntorMessagesProviderProps): React.JSX.Element => {
  const { config, pathname } = useIntorConfig();

  const [loadedMessages, setLoadedMessages] =
    React.useState<LocaleNamespaceMessages | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] =
    React.useState<boolean>(false);

  // Setup refetch messages function
  const { refetchMessages } = useRefetchMessages({
    config,
    pathname,
    setLoadedMessages,
    setIsLoadingMessages,
  });

  // Context value
  const value = React.useMemo(
    () => ({
      messages: loadedMessages || messages,
      isLoading: isLoadingMessages,
      setLoadedMessages,
      setIsLoadingMessages,
      refetchMessages,
    }),
    [loadedMessages, messages, isLoadingMessages, refetchMessages],
  );

  return (
    <IntorMessagesContext.Provider value={value}>
      {children}
    </IntorMessagesContext.Provider>
  );
};
