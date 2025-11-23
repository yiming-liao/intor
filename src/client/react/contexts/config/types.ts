import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type * as React from "react";

// context value
export type ConfigContextValue = {
  config: IntorResolvedConfig;
  pathname: string;
};

// provider props
export type ConfigProviderProps = {
  value: ConfigContextValue;
  children: React.ReactNode;
};
