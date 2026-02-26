import type { IntorContextValue } from "./types";
import { inject, type ComputedRef } from "vue";
import { IntorContextKey } from "./intor-provider";

export function injectIntorContext(): ComputedRef<IntorContextValue> {
  const context = inject(IntorContextKey);
  if (!context)
    throw new Error("injectIntorContext must be used within IntorProvider");
  return context;
}
