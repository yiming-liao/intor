import type { LocaleContextValue } from "./types";
import * as React from "react";

// context
export const LocaleContext = React.createContext<
  LocaleContextValue | undefined
>(undefined);
