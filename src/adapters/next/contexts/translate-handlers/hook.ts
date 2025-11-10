import * as React from "react";
import { TranslateHandlersContext } from "./context";

// Hook
export function useTranslateHandlers() {
  const context = React.useContext(TranslateHandlersContext);
  return context;
}
