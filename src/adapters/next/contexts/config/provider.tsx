"use client";

import type { ConfigProviderProps } from "./types";
import { ConfigContext } from "./context";
import * as React from "react";

export function ConfigProvider({
  value: { config, pathname },
  children,
}: ConfigProviderProps) {
  const value = React.useMemo(() => ({ config, pathname }), [config, pathname]);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
