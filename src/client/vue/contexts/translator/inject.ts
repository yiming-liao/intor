import type { TranslatorContextValue } from "@/client/shared/types";
import { inject, type ComputedRef } from "vue";
import { TranslatorContextKey } from "./context";

export function injectTranslator(): ComputedRef<TranslatorContextValue> {
  const context = inject(TranslatorContextKey);
  if (!context)
    throw new Error("injectTranslator must be used within TranslatorProvider");
  return context;
}
