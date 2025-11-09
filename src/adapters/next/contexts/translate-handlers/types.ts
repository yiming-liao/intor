import { TranslateHandlers } from "intor-translator";
import * as React from "react";

// Context value
export type TranslateHandlersContextValue = TranslateHandlers;

// Provider props
export type TranslateHandlersProviderProps = {
  children: React.ReactNode;
  handlers: TranslateHandlers;
};
