"use client";

import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import {
  createRefetchMessages,
  type RefetchMessagesFn,
} from "@/client/shared/utils/create-refetch-messages";
import { MessagesContext } from "./context";

export interface MessagesProviderProps {
  value: {
    initialMessages?: Readonly<LocaleMessages>;
  };
  children: React.ReactNode;
}

export function MessagesProvider({
  value: { initialMessages = {} },
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
  const refetchMessages: RefetchMessagesFn = React.useMemo(
    () =>
      createRefetchMessages({
        config,
        onLoadingStart: () => setIsLoadingMessages(true),
        onLoadingEnd: () => setIsLoadingMessages(false),
        onMessages: setRuntimeMessages,
      }),
    [config, setRuntimeMessages, setIsLoadingMessages],
  );

  // Refetch messages when locale changes (except initial render).
  React.useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    refetchMessages(locale);
  }, [refetchMessages, locale]);

  const value = React.useMemo(
    () => ({
      messages: runtimeMessages || initialMessages,
      isLoading: isLoadingMessages,
    }),
    [runtimeMessages, initialMessages, isLoadingMessages],
  );

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
