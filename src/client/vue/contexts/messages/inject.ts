import type { MessagesContextValue } from "@/client/shared/types";
import { inject, type ComputedRef } from "vue";
import { MessagesContextKey } from "./context";

export function injectMessages(): ComputedRef<MessagesContextValue> {
  const context = inject(MessagesContextKey);
  if (!context)
    throw new Error("injectMessages must be used within MessagesProvider");
  return context;
}
