import type { LocaleMessages } from "intor-translator";
import type * as React from "react";

// provider props
export type MessagesProviderProps = {
  value: {
    messages?: Readonly<LocaleMessages>;
  };
  children: React.ReactNode;
};

// context value
export type MessagesContextValue = {
  messages: Readonly<LocaleMessages>;
  isLoading: boolean;
};
