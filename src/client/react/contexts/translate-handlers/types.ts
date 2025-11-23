import type { TranslateHandlers } from "intor-translator";
import type * as React from "react";

// context value
export type TranslateHandlersContextValue = TranslateHandlers;

// provider props
export type TranslateHandlersProviderProps = {
  children: React.ReactNode;
  handlers: TranslateHandlers;
};
