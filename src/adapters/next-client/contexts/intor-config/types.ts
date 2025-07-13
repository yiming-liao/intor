import * as React from "react";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

// Context value
export type IntorConfigContextValue = {
  config: IntorResolvedConfig;
  pathname: string;
};

// Provider props
export type IntorConfigProviderProps = {
  value: {
    config: IntorResolvedConfig;
    pathname: string;
  };
  children: React.ReactNode;
};
