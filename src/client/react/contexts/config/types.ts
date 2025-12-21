import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type * as React from "react";

// provider props
export type ConfigProviderProps = {
  value: {
    config: IntorResolvedConfig;
  };
  children: React.ReactNode;
};

// context value
export type ConfigContextValue = {
  config: IntorResolvedConfig;
};
