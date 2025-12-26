"use client";

import type { IntorResolvedConfig } from "@/config";
import * as React from "react";
import { ConfigContext } from "./context";

export interface ConfigProviderProps {
  value: {
    config: IntorResolvedConfig;
  };
  children: React.ReactNode;
}

export function ConfigProvider({
  value: { config },
  children,
}: ConfigProviderProps) {
  const value = React.useMemo(
    () => ({
      config,
    }),
    [config],
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
