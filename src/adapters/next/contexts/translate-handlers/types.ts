import type { TranslateHandlers } from "intor-translator";
import type * as React from "react";

// Context value
export type TranslateHandlersContextValue = TranslateHandlers;

// Provider props
export type TranslateHandlersProviderProps = {
  children: React.ReactNode;
  handlers: TranslateHandlers;
};
