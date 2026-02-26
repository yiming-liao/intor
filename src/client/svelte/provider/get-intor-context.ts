import type { IntorContextValue } from "./types";
import { getContext } from "svelte";
import { INTOR_CONTEXT_KEY } from "./create-intor-store";

export function getIntorContext(): IntorContextValue {
  const context = getContext<IntorContextValue>(INTOR_CONTEXT_KEY);
  if (!context)
    throw new Error("getIntorContext must be used within IntorProvider");
  return context;
}
