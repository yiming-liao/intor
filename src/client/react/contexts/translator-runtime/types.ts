import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type * as React from "react";

// provider props
export type TranslatorRuntimeProviderProps = {
  value: {
    handlers: TranslateHandlers;
    plugins: (TranslatorPlugin | TranslateHook)[];
  };
  children: React.ReactNode;
};

// context value
export type TranslatorRuntimeContextValue = {
  handlers: TranslateHandlers;
  plugins: (TranslatorPlugin | TranslateHook)[];
};
