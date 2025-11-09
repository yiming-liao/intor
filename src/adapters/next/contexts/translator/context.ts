import type { TranslatorContextValue } from "./types";
import * as React from "react";

// Context
export const TranslatorContext = React.createContext<
  TranslatorContextValue | undefined
>(undefined);
