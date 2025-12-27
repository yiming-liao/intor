import type { ConfigContextValue } from "@/client/shared/types";
import type { InjectionKey, ComputedRef } from "vue";

export const ConfigContextKey: InjectionKey<ComputedRef<ConfigContextValue>> =
  Symbol("IntorConfigContext");
