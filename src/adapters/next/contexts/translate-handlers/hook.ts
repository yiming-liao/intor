import * as React from "react";
import { TranslateHandlersContext } from "./context";

// Hook
export function useTranslateHandlers() {
  const context = React.useContext(TranslateHandlersContext);
  if (!context)
    throw new Error(
      "useTranslateHandlers must be used within a TranslateHandlersProvider",
    );
  return context;
}
