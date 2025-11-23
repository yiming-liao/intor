import type { Translator } from "intor-translator";
import type * as React from "react";

// context value
export type TranslatorContextValue<M = unknown> = {
  translator: Translator<M>;
};

// provider props
export type TranslatorProviderProps = { children: React.ReactNode };
