import type { ConfigContextValue } from "@/client/shared/types";
import * as React from "react";

export const ConfigContext = React.createContext<
  ConfigContextValue | undefined
>(undefined);
