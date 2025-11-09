import * as React from "react";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

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
