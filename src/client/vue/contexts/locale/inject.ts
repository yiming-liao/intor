import type { LocaleContextValue } from "@/client/shared/types";
import { inject, type ComputedRef } from "vue";
import { LocaleContextKey } from "./context";

export function injectLocale(): ComputedRef<LocaleContextValue> {
  const context = inject(LocaleContextKey);
  if (!context)
    throw new Error("injectLocale must be used within LocaleProvider");
  return context;
}
