import type { Translator } from "intor-translator";
import type * as React from "react";

// Context value
export type TranslatorContextValue<M = unknown> = {
  translator: Translator<M>;
};

// Provider props
export type TranslatorProviderProps = { children: React.ReactNode };
