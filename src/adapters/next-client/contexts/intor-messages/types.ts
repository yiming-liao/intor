import { LocaleNamespaceMessages } from "intor-translator";
import * as React from "react";

// Context value
export type IntorMessagesContextValue = {
  messages: Readonly<LocaleNamespaceMessages> | null;
  isLoading: boolean;
  setLoadedMessages: React.Dispatch<
    React.SetStateAction<LocaleNamespaceMessages | null>
  >;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  refetchMessages: (newLocale: string) => Promise<void>;
};

// Provider props
export type IntorMessagesProviderProps = {
  value: { messages: Readonly<LocaleNamespaceMessages> };
  children: React.ReactNode;
};
