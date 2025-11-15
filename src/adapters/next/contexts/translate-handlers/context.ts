import type { TranslateHandlersContextValue } from "./types";
import * as React from "react";

// Context
export const TranslateHandlersContext = React.createContext<
  TranslateHandlersContextValue | undefined
>(undefined);
