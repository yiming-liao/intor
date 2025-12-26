import type { LocaleContextValue } from "@/client/shared/types";
import * as React from "react";
import { LocaleContext } from "./context";

export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale must be used within a LocaleProvider");
  return context;
}
