import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import type * as React from "react";

// Context value
export type ConfigContextValue = {
  config: IntorResolvedConfig;
  pathname: string;
};

// Provider props
export type ConfigProviderProps = {
  value: ConfigContextValue;
  children: React.ReactNode;
};
