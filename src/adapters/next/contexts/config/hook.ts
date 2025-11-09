import type { ConfigContextValue } from "./types";
import * as React from "react";
import { ConfigContext } from "./context";

// Hook
export function useConfig(): ConfigContextValue {
  const context = React.useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
}
