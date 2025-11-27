import type { TranslateHandlersContextValue } from "@/client/react/contexts/translate-handlers/types";
import * as React from "react";
import { TranslateHandlersContext } from "./context";

// hook
export function useTranslateHandlers() {
  const context = React.useContext(TranslateHandlersContext);
  return context as TranslateHandlersContextValue;
}
