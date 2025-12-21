import type { TranslatorContextValue } from "./types";
import * as React from "react";

export const TranslatorContext = React.createContext<
  TranslatorContextValue | undefined
>(undefined);
