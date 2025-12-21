"use client";

import type { TranslatorRuntimeProviderProps } from "./types";
import * as React from "react";
import { TranslatorRuntimeContext } from "./context";

export const TranslatorRuntimeProvider = ({
  value: { handlers, plugins },
  children,
}: TranslatorRuntimeProviderProps) => {
  const value = React.useMemo(
    () => ({
      handlers,
      plugins,
    }),
    [handlers, plugins],
  );

  return (
    <TranslatorRuntimeContext.Provider value={value}>
      {children}
    </TranslatorRuntimeContext.Provider>
  );
};
