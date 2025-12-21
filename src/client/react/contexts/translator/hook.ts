import type { TranslatorContextValue } from "./types";
import * as React from "react";
import { TranslatorContext } from "./context";

export function useTranslator() {
  const context = React.useContext(TranslatorContext) as
    | TranslatorContextValue
    | undefined;
  if (!context)
    throw new Error(
      "useTranslator must be used within IntorTranslatorProvider",
    );
  return context;
}
