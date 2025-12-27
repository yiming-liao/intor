import type { MessagesContextValue } from "@/client/shared/types";
import type { InjectionKey, ComputedRef } from "vue";

export const MessagesContextKey: InjectionKey<
  ComputedRef<MessagesContextValue>
> = Symbol("IntorMessagesContext");
