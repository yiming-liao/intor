"use client";

import type { ConfigProviderProps } from "./types";
import * as React from "react";
import { ConfigContext } from "./context";

export function ConfigProvider({
  value: { config, pathname },
  children,
}: ConfigProviderProps) {
  const value = React.useMemo(() => ({ config, pathname }), [config, pathname]);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
