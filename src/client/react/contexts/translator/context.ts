import type { TranslatorContextValue } from "@/client/shared/types";
import * as React from "react";

export const TranslatorContext = React.createContext<
  TranslatorContextValue | undefined
>(undefined);
