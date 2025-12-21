"use client";

import type { ConfigProviderProps } from "./types";
import * as React from "react";
import { ConfigContext } from "./context";

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
