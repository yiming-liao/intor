import type { LocaleMessages, Translator } from "intor-translator";
import type * as React from "react";

// context value
export type TranslatorContextValue<M extends LocaleMessages = LocaleMessages> =
  { translator: Translator<M> };

// provider props
export type TranslatorProviderProps = {
  value: { isLoading?: boolean };
  children: React.ReactNode;
};
