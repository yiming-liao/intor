"use client";

import type { IntorConfigProviderProps } from "./types";
import { IntorConfigContext } from "./intor-config-context";
import * as React from "react";

// Provider
export const IntorConfigProvider = ({
  value: { config, pathname },
  children,
}: IntorConfigProviderProps) => {
  // Context value
  const value = React.useMemo(
    () => ({
      config,
      pathname,
    }),
    [config, pathname],
  );

  return (
    <IntorConfigContext.Provider value={value}>
      {children}
    </IntorConfigContext.Provider>
  );
};
