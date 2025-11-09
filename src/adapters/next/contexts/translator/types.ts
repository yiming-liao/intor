import { Translator } from "intor-translator";
import * as React from "react";

// Context value
export type TranslatorContextValue<M = unknown> = {
  translator: Translator<M>;
};

// Provider props
export type TranslatorProviderProps = { children: React.ReactNode };
