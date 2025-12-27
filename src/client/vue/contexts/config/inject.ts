import type { ConfigContextValue } from "@/client/shared/types";
import { inject, type ComputedRef } from "vue";
import { ConfigContextKey } from "./context";

export function injectConfig(): ComputedRef<ConfigContextValue> {
  const context = inject(ConfigContextKey);
  if (!context)
    throw new Error("injectConfig must be used within ConfigProvider");
  return context;
}
