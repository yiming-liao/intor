import type { ConfigContextValue } from "./types";
import * as React from "react";

// context
export const ConfigContext = React.createContext<
  ConfigContextValue | undefined
>(undefined);
