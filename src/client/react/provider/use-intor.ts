import type { IntorContextValue } from "./types";
import type { GenConfigKeys } from "@/core";
import React from "react";
import { IntorContext } from "./intor-provider";

export function useIntor<
  CK extends GenConfigKeys = "__default__",
>(): IntorContextValue<CK> {
  const context = React.useContext(IntorContext);
  if (!context) throw new Error("useIntor must be used within IntorProvider");
  return context;
}
