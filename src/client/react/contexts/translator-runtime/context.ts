import type { TranslatorRuntimeContextValue } from "./types";
import * as React from "react";

export const TranslatorRuntimeContext = React.createContext<
  TranslatorRuntimeContextValue | undefined
>(undefined);
