import type { TranslatorContextValue } from "@/client/shared/types";
import * as React from "react";
import { TranslatorContext } from "./context";

export function useTranslator(): TranslatorContextValue {
  const context = React.useContext(TranslatorContext);
  if (!context)
    throw new Error(
      "useTranslator must be used within IntorTranslatorProvider",
    );
  return context;
}
