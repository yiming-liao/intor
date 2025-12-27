import type { LocaleContextValue } from "@/client/shared/types";
import type { InjectionKey, ComputedRef } from "vue";

export const LocaleContextKey: InjectionKey<ComputedRef<LocaleContextValue>> =
  Symbol("IntorLocaleContext");
