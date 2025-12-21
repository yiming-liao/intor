import type { Translator } from "intor-translator";
import type * as React from "react";

// provider props
export type TranslatorProviderProps = {
  value?: {
    isLoading?: boolean;
  };
  children: React.ReactNode;
};

// context value
export type TranslatorContextValue = {
  translator: Translator<unknown>;
};
