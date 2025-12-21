import type { ConfigContextValue } from "./types";
import * as React from "react";

export const ConfigContext = React.createContext<
  ConfigContextValue | undefined
>(undefined);
