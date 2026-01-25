import type { IntorContextValue } from "./types";
import { getContext } from "svelte";
import { INTOR_CONTEXT_KEY } from "./create-intor-store";

export function useIntorContext(): IntorContextValue {
  const context = getContext<IntorContextValue>(INTOR_CONTEXT_KEY);
  if (!context)
    throw new Error("useIntorContext must be used within IntorProvider");
  return context;
}
