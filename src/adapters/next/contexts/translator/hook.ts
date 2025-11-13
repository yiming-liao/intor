import type { TranslatorContextValue } from "./types";
import * as React from "react";
import { TranslatorContext } from "./context";

// Hook
export function useTranslator<M>() {
  const context = React.useContext(TranslatorContext) as
    | TranslatorContextValue<M>
    | undefined;
  if (!context)
    throw new Error(
      "useTranslator must be used within IntorTranslatorProvider",
    );
  return context;
}
