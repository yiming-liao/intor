import type { ConfigContextValue } from "./types";
import * as React from "react";

// Context
export const ConfigContext = React.createContext<
  ConfigContextValue | undefined
>(undefined);
