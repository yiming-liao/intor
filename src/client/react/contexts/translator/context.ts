import type { TranslatorContextValue } from "./types";
import * as React from "react";

// context
export const TranslatorContext = React.createContext<
  TranslatorContextValue | undefined
>(undefined);
