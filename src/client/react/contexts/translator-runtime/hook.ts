import type { TranslatorRuntimeContextValue } from "@/client/react/contexts/translator-runtime/types";
import * as React from "react";
import { TranslatorRuntimeContext } from "./context";

export function useTranslatorRuntime():
  | TranslatorRuntimeContextValue
  | undefined {
  const context = React.useContext(TranslatorRuntimeContext);
  return context;
}
