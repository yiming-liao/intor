import type { LocaleContextValue } from "@/client/shared/types";
import * as React from "react";

export const LocaleContext = React.createContext<
  LocaleContextValue | undefined
>(undefined);
