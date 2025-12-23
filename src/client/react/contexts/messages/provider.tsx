"use client";

import type { MessagesProviderProps } from "./types";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { useRefetchMessages } from "@/client/react/contexts/messages/utils/use-refetch-messages";
import { MessagesContext } from "./context";

export function MessagesProvider({
  value: { messages = {} },
  children,
}: MessagesProviderProps): React.JSX.Element {
  const { config } = useConfig();
  const { locale } = useLocale();

  const [runtimeMessages, setRuntimeMessages] =
    React.useState<LocaleMessages | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] =
    React.useState<boolean>(false);
  const isInitialRenderRef = React.useRef(true);

  // Prepares message refetch function.
  const { refetchMessages } = useRefetchMessages({
    config,
    setRuntimeMessages,
    setIsLoadingMessages,
  });

  // Refetch messages when locale changes (except initial render).
  React.useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    refetchMessages(locale);
  }, [refetchMessages, locale]);

  // context value
  const value = React.useMemo(
    () => ({
      messages: runtimeMessages || messages,
      isLoading: isLoadingMessages,
    }),
    [runtimeMessages, messages, isLoadingMessages],
  );

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
