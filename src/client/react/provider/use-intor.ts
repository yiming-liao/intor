import type { IntorContextValue } from "./types";
import React from "react";
import { IntorContext } from "./intor-provider";

export function useIntor(): IntorContextValue {
  const context = React.useContext(IntorContext);
  if (!context) throw new Error("useIntor must be used within IntorProvider");
  return context;
}
