import type { TranslateHandlersContextValue } from "./types";
import * as React from "react";

// context
export const TranslateHandlersContext = React.createContext<
  TranslateHandlersContextValue | undefined
>(undefined);
