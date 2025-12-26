import type { TranslatorRuntimeContextValue } from "@/client/shared/types";
import * as React from "react";
import { TranslatorRuntimeContext } from "./context";

export function useTranslatorRuntime():
  | TranslatorRuntimeContextValue
  | undefined {
  const context = React.useContext(TranslatorRuntimeContext);
  // Optional runtime context for injecting translator handlers or plugins.
  // This hook intentionally does not throw, allowing usage without a provider.
  return context;
}
