import type { IntorContextValue } from "./types";
import type { GenConfigKeys } from "@/core";
import React from "react";
import { IntorContext } from "./intor-provider";

export function useIntorContext<
  CK extends GenConfigKeys = "__default__",
>(): IntorContextValue<CK> {
  const context = React.useContext(IntorContext);
  if (!context)
    throw new Error("useIntorContext must be used within IntorProvider");
  return context;
}
