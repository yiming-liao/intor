import type { IntorContextValue } from "./types";
import type { GenConfigKeys } from "@/core";
import { inject, type ComputedRef } from "vue";
import { IntorContextKey } from "./intor-provider";

export function injectIntor<
  CK extends GenConfigKeys = "__default__",
>(): ComputedRef<IntorContextValue<CK>> {
  const context = inject(IntorContextKey);
  if (!context)
    throw new Error("injectIntor must be used within IntorProvider");
  return context;
}
