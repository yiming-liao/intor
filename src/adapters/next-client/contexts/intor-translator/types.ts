import { Translator } from "intor-translator";
import * as React from "react";

// Context value
export type IntorTranslatorContextValue<M = unknown> = {
  translator: Translator<M>;
};

// Provider props
export type IntorTranslatorProviderProps = { children: React.ReactNode };
