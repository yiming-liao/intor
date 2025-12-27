import type { TranslatorContextValue } from "@/client/shared/types";
import type { InjectionKey, ComputedRef } from "vue";

export const TranslatorContextKey: InjectionKey<
  ComputedRef<TranslatorContextValue>
> = Symbol("IntorTranslatorContext");
