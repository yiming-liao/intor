import type { IntorContextValue } from "./types";
import React from "react";
import { IntorContext } from "./intor-provider";

/** @internal */
export function useIntorContext(): IntorContextValue {
  const context = React.useContext(IntorContext);
  if (!context)
    throw new Error("useIntorContext must be used within IntorProvider");
  return context;
}
