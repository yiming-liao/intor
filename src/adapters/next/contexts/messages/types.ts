import type { LocaleMessages } from "intor-translator";
import type * as React from "react";

// Context value
export type MessagesContextValue = {
  messages: Readonly<LocaleMessages> | null;
  isLoading: boolean;
  setLoadedMessages: React.Dispatch<
    React.SetStateAction<LocaleMessages | null>
  >;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  refetchMessages: (newLocale: string) => Promise<void>;
};

// Provider props
export type MessagesProviderProps = {
  value: { messages: Readonly<LocaleMessages> };
  children: React.ReactNode;
};
