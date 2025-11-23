"use client";

import type { MessagesProviderProps } from "./types";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useRefetchMessages } from "@/client/react/contexts/messages/utils/use-refetch-messages";
import { MessagesContext } from "./context";

// Provider
export function MessagesProvider({
  value: { messages = {} },
  children,
}: MessagesProviderProps): React.JSX.Element {
  const { config, pathname } = useConfig();

  const [loadedMessages, setLoadedMessages] =
    React.useState<LocaleMessages | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] =
    React.useState<boolean>(false);

  // Setup refetch messages function
  const { refetchMessages } = useRefetchMessages({
    config,
    pathname,
    setLoadedMessages,
    setIsLoadingMessages,
  });

  // context value
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
