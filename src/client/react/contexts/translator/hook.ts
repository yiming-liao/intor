import type { TranslatorContextValue } from "./types";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { TranslatorContext } from "./context";

// hook
export function useTranslator<M extends LocaleMessages = LocaleMessages>() {
  const context = React.useContext(TranslatorContext) as
    | TranslatorContextValue<M>
    | undefined;
  if (!context)
    throw new Error(
      "useTranslator must be used within IntorTranslatorProvider",
    );
  return context;
}
