"use client";

import type { MessagesProviderProps } from "./types";
import * as React from "react";
import { MessagesContext } from "./context";
import { LocaleNamespaceMessages } from "intor-translator";
import { useConfig } from "@/adapters/next/contexts/config";
import { useRefetchMessages } from "@/adapters/next/contexts/messages/utils/use-refetch-messages";

// Provider
export function MessagesProvider({
  value: { messages },
  children,
}: MessagesProviderProps): React.JSX.Element {
  const { config, pathname } = useConfig();

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
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
