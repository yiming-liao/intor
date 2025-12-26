import type { TranslatorRuntimeContextValue } from "@/client/shared/types";
import * as React from "react";

export const TranslatorRuntimeContext = React.createContext<
  TranslatorRuntimeContextValue | undefined
>(undefined);
