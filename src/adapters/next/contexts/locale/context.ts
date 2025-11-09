import type { LocaleContextValue } from "./types";
import * as React from "react";

// Context
export const LocaleContext = React.createContext<
  LocaleContextValue | undefined
>(undefined);
